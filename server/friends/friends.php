<?php

/**
 * Retrieves the friend requests sent by a user to the given contact users
 */
function getSentFriendRequests($userId, $contactUserIds) {
	if (empty($contactUserIds)) {
		return array();
	}
	$conn = getConnection();
	$qMarks = implode(',', array_fill(0, count($contactUserIds), '?'));
	$sql = "select friendshipId, receiverUserId, status from friendships " . 	//
	"where senderUserId = ? " . 	//
	"and receiverUserId in ($qMarks)";
	$stmt = $conn->prepare($sql);
	$stmt->bindValue(1, $userId, PDO::PARAM_INT);
	$i = 2;
	foreach ($contactUserIds as $contactUserId) {
		$stmt->bindValue($i, $contactUserId, PDO::PARAM_INT);
		$i++;
	}
	$stmt->execute();
	
	$requests = array();
	while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) {
		$receiverUserId = $row["receiverUserId"];
		$friendshipId = $row["friendshipId"];
		$status = $row["status"];
		$requests[$receiverUserId] = array(
				'status' => $status, 
				'friendshipId' => $friendshipId
		);
	}
	close($conn, $stmt);
	return $requests;
}

/**
 * Retrieves the friend requests received by a user from the given contact users
 */
function getReceivedFriendRequests($userId, $contactUserIds) {
	if (empty($contactUserIds)) {
		return array();
	}
	$conn = getConnection('read');
	$qMarks = implode(',', array_fill(0, count($contactUserIds), '?'));
	$sql = "select friendshipId, senderUserId, status from friendships " . 	//
	"where receiverUserId = ? " . 	//
	"and senderUserId in ($qMarks)";
	$stmt = $conn->prepare($sql);
	$stmt->bindValue(1, $userId, PDO::PARAM_INT);
	$i = 2;
	foreach ($contactUserIds as $contactUserId) {
		$stmt->bindValue($i, $contactUserId, PDO::PARAM_INT);
		$i++;
	}
	$stmt->execute();
	
	$requests = array();
	while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) {
		$senderUserId = $row["senderUserId"];
		$friendshipId = $row["friendshipId"];
		$status = $row["status"];
		$requests[$senderUserId] = array(
				'status' => $status, 
				'friendshipId' => $friendshipId
		);
	}
	close($conn, $stmt);
	return $requests;
}
?>