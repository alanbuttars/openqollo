<?php
require_once (__DIR__ . '/../utils/database.php');
require_once (__DIR__ . '/../auth/auth-utils.php');

function sendImage($senderUserId, $friendshipIds, $image) {
	$encryptionInfos = getEncryptionInfo($senderUserId, $friendshipIds);
	insertImages($senderUserId, $encryptionInfos, $image);
}

function getEncryptionInfo($senderUserId, $friendshipIds) {
	$qMarks = join(',', array_fill(0, count($friendshipIds), '?'));
	
	$conn = getConnection();
	$sql = "select friendshipId, senderUserId, receiverUserId, encryptionKey from friendships " . //
			"where (senderUserId = ? or receiverUserId = ?) " . //
			"and friendshipId in ($qMarks)";
	$stmt = $conn->prepare($sql);
	$stmt->bindValue(1, $senderUserId, PDO::PARAM_INT);
	$stmt->bindValue(2, $senderUserId, PDO::PARAM_INT);
	$i = 3;
	foreach ($friendshipIds as $friendshipId) {
		$stmt->bindValue($i++, $friendshipId, PDO::PARAM_INT);
	}
	
	if ($stmt->execute()) {
		$encryptionInfos = array();
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$friendUserId = null;
			if ($senderUserId == $row["senderUserId"]) {
				$friendUserId = $row["receiverUserId"];
			}
			else {
				$friendUserId = $row["senderUserId"];
			}
			$encryptionInfo = array(
				"friendshipId" 		=> $row["friendshipId"],
				"receiverUserId"	=> $friendUserId,
				"encryptionKey"		=> $row["encryptionKey"]
			);
			$encryptionInfos[] = $encryptionInfo;
		}
		close($conn, $stmt);
		
		return $encryptionInfos;
	}
	close($conn, $stmt);
	throw new Exception("Failed to gather friendship encryption keys");
}

function insertImages($senderUserId, $encryptionInfos, $image) {
	$error = null;
	if (!empty($encryptionInfos)) {
		$conn = getConnection();
		$sql = "insert into images " . //
				"(friendshipId, senderUserId, receiverUserId, image, timeSent) " . //
				"values ";
		$sqlRest = [];
		foreach ($encryptionInfos as $encryptionInfo) {
			$sqlRest[] = "(?, ?, ?, ?, CURRENT_TIMESTAMP)";
		}
		$sql .= implode(",", $sqlRest);
		$stmt = $conn->prepare($sql);
		
		$i = 1;
		foreach ($encryptionInfos as $encryptionInfo) {
			$friendshipId = $encryptionInfo["friendshipId"];
			$receiverUserId = $encryptionInfo["receiverUserId"];
			$encryptionKey = $encryptionInfo["encryptionKey"];
			$encryptedImage = encrypt($image, $encryptionKey);
			
			$stmt->bindValue($i++, $friendshipId, PDO::PARAM_INT);
			$stmt->bindValue($i++, $senderUserId, PDO::PARAM_INT);
			$stmt->bindValue($i++, $receiverUserId, PDO::PARAM_INT);
			$stmt->bindValue($i++, $encryptedImage, PDO::PARAM_STR);
		}
		
		if (!$stmt->execute()) {
			$error = $stmt->error;
		}
		close($conn, $stmt);
	}
	else {
		$error = "No images could be encrypted";
	}
	if ($error) {
		throw new Exception($error);
	}
}

function getImage($userId, $imageId) {
	error_log("$userId $imageId");
	$conn = getConnection();
	$sql = "select images.image, friendships.encryptionKey from images " . //
			"join friendships on " . //
			"((images.senderUserId = friendships.senderUserId and images.receiverUserId = friendships.receiverUserId) or " . //
			"(images.senderUserId = friendships.receiverUserId and images.receiverUserId = friendships.senderUserId)) " . //
			"where images.imageId = ? " . //
			"and (images.senderUserId = ? or images.receiverUserId = ?)";
	$stmt = $conn->prepare($sql);
	$stmt->bindValue(1, $imageId, PDO::PARAM_INT);
	$stmt->bindValue(2, $userId, PDO::PARAM_INT);
	$stmt->bindValue(3, $userId, PDO::PARAM_INT);
	$stmt->execute();

	$image = null;
	if ($stmt->rowCount()) {
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$encrypted = $row["image"];
		$encryptionKey = $row["encryptionKey"];
		$image = decrypt($encrypted, $encryptionKey);
	}
	close($conn, $stmt);
	return $image;
}
?>