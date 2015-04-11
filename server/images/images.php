<?php
require_once (__DIR__ . '/../utils/database.php');
require_once (__DIR__ . '/../auth/auth-utils.php');

function sendImage($senderUserId, $receiverUserIds, $image) {
	$encryptionKeys = getEncryptionKeys($senderUserId, $receiverUserIds);
	insertImages($senderUserId, $encryptionKeys, $image);
}

function getEncryptionKeys($senderUserId, $receiverUserIds) {
	$qMarks = join(',', array_fill(0, count($receiverUserIds), '?'));
	
	$conn = getConnection();
	$sql = "select senderUserId, receiverUserId, encryptionKey from friendships " . //
			"where (senderUserId = ? and receiverUserId in ($qMarks)) " . //
			"or (receiverUserId = ? and senderUserId in ($qMarks))";
	$stmt = $conn->prepare($sql);
	$i = 1;
	for ($j = 0; $j < 2; $j++) {
		$stmt->bindValue($i++, $senderUserId, PDO::PARAM_INT);
		foreach ($receiverUserIds as $receiverUserId) {
			$stmt->bindValue($i++, $receiverUserId, PDO::PARAM_INT);
		}
	}
	
	if ($stmt->execute()) {
		$keys = array();
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$friendUserId = null;
			if ($senderUserId == $row["senderUserId"]) {
				$friendUserId = $row["receiverUserId"];
			}
			else {
				$friendUserId = $row["senderUserId"];
			}
			$keys[$friendUserId] = $row["encryptionKey"];
		}
		close($conn, $stmt);
		return $keys;
	}
	close($conn, $stmt);
	throw new Exception("Failed to gather friendship encryption keys");
}

function insertImages($senderUserId, $encryptionKeys, $image) {
	$error = null;
	if (!empty($encryptionKeys)) {
		$conn = getConnection();
		$sql = "insert into images " . //
				"(senderUserId, receiverUserId, image, timeSent) " . //
				"values ";
		$sqlRest = [];
		foreach ($encryptionKeys as $encryptionKey) {
			$sqlRest[] = "(?, ?, ?, CURRENT_TIMESTAMP)";
		}
		$sql .= implode(",", $sqlRest);
		$stmt = $conn->prepare($sql);
		
		$i = 1;
		foreach ($encryptionKeys as $receiverUserId => $encryptionKey) {
			$encryptedImage = encrypt($image, $encryptionKey);
			
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
?>