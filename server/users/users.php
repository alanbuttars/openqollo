<?php
require_once (__DIR__ . '/../auth/auth-utils.php');
require_once (__DIR__ . '/../utils/database.php');

/**
 * Retrieves the user associated with the given email address.
 */
function getUserByEmail($email) {
	$digestedEmail = digest ( $email, EMAIL_SALT );
	$conn = getConnection ();
	$sql = "SELECT * FROM users WHERE email = :digestedEmail LIMIT 1";
	$stmt = $conn->prepare ( $sql );
	$stmt->bindParam ( ":digestedEmail", $digestedEmail, PDO::PARAM_STR );
	$user = null;
	if ($stmt->execute ()) {
		if ($stmt->rowCount ()) {
			$user = $stmt->fetch ( PDO::FETCH_ASSOC );
		}
	}
	close ( $conn, $stmt );
	return $user;
}
?>