<?php
require_once (__DIR__ . '/../auth/auth-utils.php');
require_once (__DIR__ . '/../friends/friends.php');
require_once (__DIR__ . '/../utils/arrays.php');
require_once (__DIR__ . '/../utils/database.php');

/**
 * Retrieves the user associated with the given email address.
 */
function getUserByEmail($email) {
	$encryptedEmail = encrypt($email, EMAIL_SALT);
	$conn = getConnection();
	$sql = "SELECT * FROM users WHERE email = :encryptedEmail LIMIT 1";
	$stmt = $conn->prepare($sql);
	$stmt->bindParam(":encryptedEmail", $encryptedEmail, PDO::PARAM_STR);
	
	$user = null;
	if ($stmt->execute()) {
		if ($stmt->rowCount()) {
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
		}
	}
	close($conn, $stmt);
	return $user;
}

/**
 * Retrieves the user associated with the given public token.
 */
function getUserByPublicToken($publicToken) {
	$conn = getConnection();
	$sql = "SELECT * FROM users WHERE tokenPublic = :publicToken LIMIT 1";
	$stmt = $conn->prepare($sql);
	$stmt->bindParam(":publicToken", $publicToken, PDO::PARAM_STR);
	
	$user = null;
	if ($stmt->execute()) {
		if ($stmt->rowCount()) {
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
		}
	}
	close($conn, $stmt);
	return $user;
}

/**
 * Retrieves the user associated with the given user ID.
 */
function getUserProfile($userId) {
	$conn = getConnection();
	$sql = "SELECT email, number, timeCreated FROM users WHERE userId = :userId";
	$stmt = $conn->prepare($sql);
	$stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
	
	$user = array();
	if ($stmt->execute()) {
		if ($stmt->rowCount()) {
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			$email = decrypt($row['email'], EMAIL_SALT);
			$number = $row['number'];
			$dbDate = strtotime($row['timeCreated']);
			$formattedDate = date("M d Y H:i:s", $dbDate);
			$user['success']['email'] = $email;
			$user['success']['number'] = $number;
			$user['success']['timeCreated'] = $formattedDate;
		}
		else {
			$user['errors']['No user found for userId=$userId'];
		}
	}
	else {
		$user['errors']['Query for userId=$userId failed'];
	}
	close($conn, $stmt);
	return $user;
}

/**
 * Retrieves the friendship details of a user with their phone contacts
 * 
 * @param $userId User's
 *        	ID
 * @param $contacts An
 *        	array of objects containing phone numbers
 */
function getUserDetails($userId, $contacts) {
	$numbersToUserIds = getNumbersToUserIds($contacts);
	$attachedContacts = attachUserIdsToContacts($contacts, $numbersToUserIds);
	$attachedFriends = attachFriendDataToContacts($userId, $attachedContacts);
	return $attachedFriends;
}

/**
 * Given a list of phone contacts, returns a mapping from registered numbers to their corresponding user IDs.
 * 
 * @param $contacts An
 *        	array of objects containing phone numbers
 */
function getNumbersToUserIds($contacts) {
	$sql = "SELECT userId, number FROM users WHERE number in (";
	$sqlRest = [];
	foreach ($contacts as $contactId => $contact) {
		foreach ($contact->phoneNumbers as $phoneNumber) {
			$sqlRest[] = "?";
		}
	}
	$sql .= implode($sqlRest, ",") . ")";
	
	$conn = getConnection('read');
	$stmt = $conn->prepare($sql);
	$i = 1;
	foreach ($contacts as $id => $contact) {
		foreach ($contact->phoneNumbers as $phoneNumber) {
			$safePhoneNumber = preg_replace("/[^0-9,.]/", "", $phoneNumber);
			$stmt->bindValue($i, $safePhoneNumber, PDO::PARAM_STR);
			$i++;
		}
	}
	$stmt->execute();
	
	$users = array();
	while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) {
		$number = $row["number"];
		$userId = $row["userId"];
		$users[$number] = $userId;
	}
	close($conn, $stmt);
	
	return $users;
}

/**
 * Attaches user ID data to phone contacts and returns the result.
 * 
 * @param $contacts An
 *        	array of objects containing phone numbers
 * @param $numbersToUserIds Mapping
 *        	of registered numbers to their corresponding user IDs.
 */
function attachUserIdsToContacts($contacts, $numbersToUserIds) {
	$attachedContacts = array();
	foreach ($contacts as $contactId => $contact) {
		$userId = null;
		$displayName = $contact->displayName;
		
		foreach ($numbersToUserIds as $number => $userId) {
			if (in_array($number, $contact->phoneNumbers)) {
				$userId = $userId;
				break;
			}
		}
		
		$attachedContacts[] = array(
				"contactId" => $contactId, 
				"userId" => $userId, 
				"displayName" => $displayName
		);
	}
	return $attachedContacts;
}

/**
 * Attaches friendship data to phone contacts and returns the result.
 * 
 * @param $userId User's
 *        	ID
 * @param $contacts An
 *        	array of objects containing phone numbers and user IDs.
 */
function attachFriendDataToContacts($userId, $contacts) {
	$contactUserIds = getValues("userId", $contacts, true);
	$sent = getSentFriendRequests($userId, $contactUserIds);
	$received = getReceivedFriendRequests($userId, $contactUserIds);
	$friendData = array();
	
	foreach ($contacts as $contact) {
		$contactUserId = intval($contact["userId"]);
		if (isset($sent[$contactUserId]) && isset($received[$contactUserId])) {
			$sentStatusInfo = $sent[$contactUserId];
			$receivedStatusInfo = $received[$friendUserId];
			$sentFriendshipId = $sentStatusInfo["friendshipId"];
			$receivedFriendshipId = $receivedStatusInfo["friendshipId"];
			
			if ($sentFriendshipId > $receivedFriendshipId) {
				$contact["friendshipId"] = $sentFriendshipId;
				$contact["friendshipType"] = "sent";
				$contact["friendshipStatus"] = $sentStatusInfo["status"];
			}
			else {
				$contact["friendship_id"] = $receivedFriendshipId;
				$contact["friendship_type"] = "received";
				$contact["friendship_status"] = $receivedStatusInfo["status"];
			}
		}
		else if (isset($sent[$contactUserId])) {
			$sentStatusInfo = $sent[$contactUserId];
			$contact["friendshipId"] = $sentStatusInfo["friendshipId"];
			$contact["friendshipType"] = "sent";
			$contact["friendshipStatus"] = $sentStatusInfo["status"];
		}
		else if (isset($received[$contactUserId])) {
			$receivedStatusInfo = $received[$contactUserId];
			$contact["friendshipId"] = $receivedStatusInfo["friendshipId"];
			$contact["friendshipType"] = "received";
			$contact["friendshipStatus"] = $receivedStatusInfo["status"];
		}
		else {
			$contact["friendshipId"] = null;
			$contact["friendshipType"] = null;
			$contact["friendshipStatus"] = null;
		}
		// $friendData[] = $friendDatum;
	}
	return $contacts;
	// return $friendData;
}

?>