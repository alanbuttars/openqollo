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
	$sql = "select friendshipId, receiverUserId, status, timeUpdated from friendships " . 	//
	"where senderUserId = ? " . 	//
	"and receiverUserId in ($qMarks) " . 	//
	"and status != 'denied' " . 	//
	"order by timeUpdated desc";
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
		$timeUpdated = $row["timeUpdated"];
		$requests[$receiverUserId] = array(
				'status' => $status, 
				'friendshipId' => $friendshipId, 
				'timeUpdated' => $timeUpdated
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
	$sql = "select friendshipId, senderUserId, status, timeUpdated from friendships " . 	//
	"where receiverUserId = ? " . 	//
	"and senderUserId in ($qMarks) " . 	//
	"order by timeUpdated desc";
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
		$timeUpdated = $row["timeUpdated"];
		$requests[$senderUserId] = array(
				'status' => $status, 
				'friendshipId' => $friendshipId, 
				'timeUpdated' => $timeUpdated
		);
	}
	close($conn, $stmt);
	return $requests;
}
function getExistingFriendUserIds($userId, $contactUserIds) {
	$existingFriendUserIds = array();
	if (!empty($contactUserIds)) {
		$conn = getConnection();
		$qMarks = implode(',', array_fill(0, count($contactUserIds), '?'));
		$sql = "select senderUserId, receiverUserId from friendships " . 		//
		"where (senderUserId = ? and receiverUserId in ($qMarks)) " . 		//
		"or (receiverUserId = ? and senderUserId in ($qMarks)) " . 		//
		"order by timeUpdated desc";
		$stmt = $conn->prepare($sql);
		$i = 1;
		for($j = 0; $j < 2; $j++) {
			$stmt->bindValue($i++, $userId, PDO::PARAM_INT);
			foreach ($contactUserIds as $contactUserId) {
				$stmt->bindValue($i++, $contactUserId, PDO::PARAM_INT);
			}
		}
		if ($stmt->execute()) {
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
	return $existingFriendUserIds;
}

/**
 * Updates the friendship statuses of a collection of contacts
 */
function updateFriendshipStatuses($userId, $contacts, $status) {
	$response = array();
	if (!empty($contacts)) {
		$contactUserIds = getValues("userId", $contacts);
		if ($status == "new") {
			updateNonexistingFriendshipStatuses($userId, $contactUserIds);
		}
		else {
			$existingFriendUserIds = getExistingFriendUserIds($userId, $contactUserIds);
			$nonexistingFriendUserIds = array_diff($contactUserIds, $existingFriendUserIds);
			updateExistingFriendshipStatuses($userId, $existingFriendUserIds, $status);
			updateNonexistingFriendshipStatuses($userId, $nonexistingFriendUserIds);
		}
	}
	return array(
			"success" => true
	);
}
function updateExistingFriendshipStatuses($userId, $friendUserIds, $status) {
	if (!empty($friendUserIds)) {
		$conn = getConnection();
		$qMarks = implode(',', array_fill(0, count($friendUserIds), '?'));
		$sql = "update friendships " . 		//
		"set status = ?, timeUpdated = CURRENT_TIMESTAMP " . 		//
		"where (senderUserId = ? and receiverUserId in ($qMarks)) " . 		//
		"or (receiverUserId = ? and senderUserId in ($qMarks)) " . 		//
		"order by timeUpdated desc " . 		//
		"limit 1";
		
		$stmt = $conn->prepare($sql);
		$i = 1;
		$stmt->bindValue($i++, $status, PDO::PARAM_STR);
		for($j = 0; $j < 2; $j++) {
			$stmt->bindValue($i++, $userId, PDO::PARAM_INT);
			foreach ($friendUserIds as $friendUserId) {
				$friendUserIdInt = intval($friendUserId);
				$stmt->bindValue($i++, $friendUserIdInt, PDO::PARAM_INT);
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
}
function updateNonexistingFriendshipStatuses($userId, $friendUserIds) {
	if (!empty($friendUserIds)) {
		$conn = getConnection();
		$sql = "insert into friendships " . 		//
		"(senderUserId, receiverUserId, status, encryptionKey, timeSent, timeUpdated) " . 		//
		"values ";
		$sqlRest = [];
		foreach ($friendUserIds as $friendUserId) {
			$sqlRest[] = "(?, ?, 'new', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) " . 			//
			"on duplicate key update status = 'new', timeUpdated = CURRENT_TIMESTAMP";
		}
		$sql .= implode(',', $sqlRest) . " ";
		$stmt = $conn->prepare($sql);
		$i = 1;
		foreach ($friendUserIds as $friendUserId) {
			$encryptionKey = generateRandomString(32);
			$stmt->bindValue($i++, $userId, PDO::PARAM_INT);
			$stmt->bindValue($i++, $friendUserId, PDO::PARAM_INT);
			$stmt->bindValue($i++, $encryptionKey, PDO::PARAM_STR);
		}
		if ($stmt->execute()) {
			$numFriendshipsChanged = $stmt->rowCount();
			error_log("User $userId: Successfully updated $numFriendshipsChanged to 'new'");
			return;
		}
		error_log("User $userId: Failed to update friendships with " . explode(',', $friendUserIds) . " to $status");
		throw new Exception("Failed to update new friendships");
	}
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