<?php
require_once (__DIR__ . '/../auth/auth-utils.php');
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
?>