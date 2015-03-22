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
	$conn = getConnection();
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
function getExistingFriendUserIds($userId, $contactUserIds) {
	$conn = getConnection();
	$qMarks = implode(',', array_fill(0, count($contactUserIds), '?'));
	$sql = "select senderUserId, receiverUserId from friendships " . 	//
	"where (senderUserId = ? and receiverUserId in ($qMarks)) " . 	//
	"or (senderUserId in ($qMarks) and receiverUserId = ?) " . 	//
	"order by friendshipId";
	$stmt = $conn->prepare($sql);
	$i = 1;
	for($j = 0; $j < 2; $j++) {
		$stmt->bindValue($i++, $userId, PDO::PARAM_INT);
		foreach ($contactUserIds as $contactUserId) {
			$stmt - bindValue($i++, $contactUserId, PDO::PARAM_INT);
		}
	}
	if ($stmt->execute()) {
		$existingFriendUserIds = array();
		while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) {
			$senderUserId = $row["senderUserId"];
			$receiverUserId = $row["receiverUserId"];
			
			if ($userId == $senderUserId) {
				$existingFriendUserIds[] = $receiverUserId;
			}
			else {
				$existingFriendUserIds[] = $senderUserId;
			}
		}
		return $existingFriendUserIds;
	}
	throw new Exception("Failed to retrieve existing friends from the database");
}

/**
 * Updates the friendship statuses of a collection of contacts
 */
function updateFriendshipStatuses($userId, $contactUserIds, $status) {
	$response = array();
	if (!empty($contacts)) {
		$existingFriendUserIds = getExistingFriendUserIds($userId, $contactUserIds);
		$nonexistingFriendUserIds = array_diff($contactUserIds, $existingFriendUserIds);
		updateExistingFriendshipStatuses($userId, $existingFriendUserIds, $status);
		updateNonexistingFriendshipStatuses($userId, $nonexistingFriendUserIds);
	}
	return array(
			"success" => true
	);
}
function updateExistingFriendshipStatuses($userId, $friendUserIds, $status) {
	$conn = getConnection();
	$sql = "update friendships " . 	//
	"set status = ?, lastUpdatedTimestamp = CURRENT_TIMESTAMP " . 	//
	"where (senderUserId = ? and receiverUserId in ($qMarks)) " . 	//
	"or (receiverUserId = ? and senderUserId in ($qMarks))";
	$stmt = $conn->prepare($sql);
	$i = 1;
	for($j = 0; $j < 2; $j++) {
		$stmt->bindValue($i++, $userId, PDO::PARAM_INT);
		foreach ($friendUserIds as $friendUserId) {
			$stmt - bindValue($i++, $friendUserId, PDO::PARAM_INT);
		}
	}
	if ($stmt->execute()) {
		$numFriendships = count($friendUserIds);
		$numFriendshipsChanged = $stmt->rowCount();
		error_log("User $userId: Successfully updated $numFriendshipsChanged/$numFriendships to '$status'");
		return;
	}
	error_log("User $userId: Failed to update friendships with " . explode(',', $friendUserIds) . " to $status");
	throw new Exception("Failed to update friendships");
}
function updateNonexistingFriendshipStatuses($userId, $friendUserIds) {
	$conn = getConnection();
	$sql = "insert into friendships " . 	//
	"(senderUserId, receiverUserId, status, encryptionKey, timeSent, timeUpdated) " . 	//
	"values ";
	$sqlRest = [];
	foreach ($contacts as $contact) {
		$sqlRest[] = "(?, ?, 'new', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
	}
	$sql .= implode(',', $sqlRest) . " ";
	$stmt = $conn->prepare($sql);
	$i = 1;
	foreach ($contacts as $contact) {
		$contactUserId = $contact["userId"];
		$encryptionKey = generateRandomString(128);
		$stmt->bindValue($i++, $userId, PDO::PARAM_INT);
		$stmt->bindValue($i++, $contactUserId, PDO::PARAM_INT);
		$stmt->bindValue($i++, $encryptionKey, PDO::PARAM_STR);
	}
	$stmt->bindValue($i++, $status, PDO::PARAM_STR);
	if ($stmt->execute()) {
		error_log("User $userId: Successfully updated $numFriendshipsChanged/$numFriendships to 'new'");
		return;
	}
	error_log("User $userId: Failed to update friendships with " . explode(',', $friendUserIds) . " to $status");
	throw new Exception("Failed to update new friendships");
}
function getFriendshipNotifications($userId) {
	$conn = getConnection();
	$sql = "select friendshipId, senderUserId as userId, viewed, timeSent " . 	//
	"from friendships " . 	//
	"where receiverUserId = :userId " . 	//
	"and status = 'new'";
	$stmt = $conn->prepare($sql);
	$stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
	if ($stmt->execute()) {
		$notifications = array();
		while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) {
			$notifications[] = $row;
		}
		return $notifications;
	}
	throw new Exception("Friendship notifications could not be retrieved from the database");
}
?>