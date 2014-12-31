<?php
require_once (__DIR__ . '/auth-input-checks.php');
require_once (__DIR__ . '/auth-utils.php');
require_once (__DIR__ . '/../users/users.php');
require_once (__DIR__ . '/../utils/database.php');

/**
 * Validates user input, then registers the user.
 * The returned response displays either success or failure information about the registration.
 */
function register($email, $number, $password, $confirm) {
	$response = array ();
	$response ['errors'] ['email'] = checkEmail ( $email );
	$response ['errors'] ['number'] = checkNumber ( $number );
	$response ['errors'] ['password'] = checkPassword ( $password );
	$response ['errors'] ['confirm'] = checkConfirm ( $confirm, $password );
	if (count ( array_filter ( $response ['errors'] ) ) == 0) {
		$response ['success'] = registerUser ( $email, $number, $password );
		if (empty ( $response ['success'] )) {
			$response ['errors'] ['other'] = "The server failed to register user";
		}
	}
	return $response;
}

/**
 * Registers user info that has already been validated.
 */
function registerUser($email, $number, $password) {
	$digestedEmail = digest ( $email, EMAIL_SALT );
	$salt = generateSalt ();
	$digestedPassword = digest ( $password, $salt );
	$tokenPrivate = generateRandomString ( 32 );
	$tokenPublic = generateRandomString ( 32 );
	$currentTimestamp = getCurrentTimestamp ();
	$conn = getConnection ( 'read' );
	$sql = "INSERT INTO users " . 	//
	"(email, number, salt, password, timeCreated, tokenPrivate, tokenPublic) " . 	//
	"VALUES(:digestedEmail1, :number, :salt, :digestedPassword, :currentTimestamp, :tokenPrivate, :tokenPublic); " . "SELECT userId FROM users WHERE email = :digestedEmail2";
	$stmt = $conn->prepare ( $sql );
	$stmt->bindParam ( ":number", $number, PDO::PARAM_STR );
	$stmt->bindParam ( ":salt", $salt, PDO::PARAM_STR );
	$stmt->bindParam ( ":digestedPassword", $digestedPassword, PDO::PARAM_STR );
	$stmt->bindParam ( ":tokenPrivate", $tokenPrivate, PDO::PARAM_STR );
	$stmt->bindParam ( ":tokenPublic", $tokenPublic, PDO::PARAM_STR );
	$stmt->bindParam ( ":digestedEmail1", $digestedEmail, PDO::PARAM_STR );
	$stmt->bindParam ( ":digestedEmail2", $digestedEmail, PDO::PARAM_STR );
	$stmt->bindParam ( ":currentTimestamp", $currentTimestamp, PDO::PARAM_STR );
	$inserted = array ();
	if ($stmt->execute ()) {
		$stmt->nextRowset ();
		$row = $stmt->fetch ( PDO::FETCH_ASSOC );
		$inserted ['userId'] = $row ["userId"];
		$inserted ['tokenPublic'] = $tokenPublic;
		$inserted ['tokenPrivate'] = $tokenPrivate;
	}
	close ( $conn, $stmt );
	return $inserted;
}

/**
 * Validates user login credentials.
 * The returned response displays either success or failure information about the login.
 */
function login($email, $password) {
	$response = array ();
	if (empty ( $email )) {
		$response ['errors'] ['email'] = "Please enter your email";
	} else if (empty ( $password )) {
		$response ['errors'] ['password'] = "Please enter your password";
	} else {
		$user = getUserByEmail ( $email );
		if (! empty ( $user )) {
			$storedSalt = $user ["salt"];
			$storedDigestedPassword = $user ["password"];
			$inputDigestedPassword = digest ( $password, $storedSalt );
			if ($inputDigestedPassword == $storedDigestedPassword) {
				$response ['success'] ['userId'] = $user ["userId"];
				$response ['success'] ['tokenPublic'] = $user ["tokenPublic"];
				$response ['success'] ['tokenPrivate'] = $user ["tokenPrivate"];
			} else {
				$response ['errors'] ['password'] = "That password is incorrect";
			}
		} else {
			$response ['errors'] ['email'] = "No account associated with that email";
		}
	}
	return $response;
}
?>