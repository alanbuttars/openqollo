<?php
define('PASSWORD_MIN_CHARS', 8);
define('PASSWORD_MIN_NUMBERS', 1);
define('PASSWORD_MIN_SYMBOLS', 0);
define('PASSWORD_MIXED_CASE', false);
require_once (__DIR__ . '/auth-utils.php');

/**
 * Validates email input
 */
function checkEmail($email) {
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		return "Please enter a valid email address.";
	}
	else if (!checkEmailUnique($email)) {
		return "That email has already been taken.";
	}
	return null;
}

/**
 * Validates email input is unique
 */
function checkEmailUnique($email) {
	$digestedEmail = encrypt($email, EMAIL_SALT);
	
	$conn = getConnection();
	$sql = "SELECT email FROM users WHERE email = :encryptedEmail";
	$stmt = $conn->prepare($sql);
	$stmt->bindParam(":encryptedEmail", $digestedEmail, PDO::PARAM_STR);
	
	$isUnique = false;
	if ($stmt->execute()) {
		if ($stmt->rowCount() == 0) {
			$isUnique = true;
		}
	}
	close($conn, $stmt);
	return $isUnique;
}

/**
 * Validates number input
 */
function checkNumber($number) {
	$strNumber = "" . $number;
	if (empty($strNumber)) {
		return "You must specify a number.";
	}
	$strArray = str_split($strNumber, 1);
	$illegalChars = array();
	for($i = 0; $i < count($strArray); $i++) {
		$num = $strArray[$i];
		if (!is_numeric($num)) {
			$illegalChars[] = $num;
		}
	}
	if (!empty($illegalChars)) {
		return "Your number contains illegal characters";
	}
	else if (!checkNumberUnique($number)) {
		return "That number has already been taken.";
	}
	return null;
}

/**
 * Validates number input is unique
 */
function checkNumberUnique($number) {
	$conn = getConnection();
	$sql = "SELECT email FROM users WHERE number = :number";
	$stmt = $conn->prepare($sql);
	$stmt->bindParam(":number", $number, PDO::PARAM_STR);
	
	$isUnique = false;
	if ($stmt->execute()) {
		if ($stmt->rowCount() == 0) {
			$isUnique = true;
		}
	}
	close($conn, $stmt);
	return $isUnique;
}

/**
 * Validates password input
 */
function checkPassword($password) {
	$conditionsMet = true;
	$conditionsMet &= !preg_match('/\s/', $password);
	$conditionsMet &= strlen($password) >= PASSWORD_MIN_CHARS;
	$conditionsMet &= (preg_match('/(?=.*[a-z])(?=.*[A-Z])/', $password) || !PASSWORD_MIXED_CASE);
	$conditionsMet &= preg_match_all('/\d/', $password, $matches) >= PASSWORD_MIN_NUMBERS;
	$conditionsMet &= preg_match_all("/[-!$%^&*(){}<>[\]'" . '"|#@:;.,?+=_\/\~]/', $password, $matches) >= PASSWORD_MIN_SYMBOLS;
	
	if (!$conditionsMet) {
		$requirements = array();
		if (PASSWORD_MIN_NUMBERS == 1) {
			$requirements[] = "1 number";
		}
		else if (PASSWORD_MIN_NUMBERS > 1) {
			$requirements[] = PASSWORD_MIN_NUMBERS . " numbers";
		}
		if (PASSWORD_MIN_SYMBOLS == 1) {
			$requirements[] = "1 symbol";
		}
		else if (PASSWORD_MIN_SYMBOLS > 1) {
			$requirements[] = PASSWORD_MIN_SYMBOLS . " symbols";
		}
		if (PASSWORD_MIXED_CASE) {
			$requirements[] = "have mixed case";
		}
		$message = "Must contain " . PASSWORD_MIN_CHARS . " characters including ";
		for($i = 0; $i < count($requirements); $i++) {
			if ($i == count($requirements) - 1 && $i == 0) {
				$message .= " $requirements[$i].";
			}
			else if ($i == count($reqs) - 1) {
				$message .= " $requirements[$i] and no spaces.";
			}
			else {
				$message .= "$requirements[$i], ";
			}
		}
		return $message;
	}
	return null;
}

/**
 * Validates confirm input
 */
function checkConfirm($confirm, $password) {
	if ($password != $confirm) {
		return "Your passwords don't match.";
	}
	return null;
}
?>