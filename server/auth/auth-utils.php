<?php
define ( 'ALPHABET_LOWER', 'abcdefghijklmnopqrstuvwxyz' );
define ( 'ALPHABET_UPPER', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' );
define ( 'NUMBERS', '0123456789' );
define ( 'EMAIL_SALT', 'ZcOR4oC6PUrDj2PDp8Kz4oC5BsK7w5B' );
define ( 'SALT_SIZE', 64 );
define ( 'SALT_SOURCE', MCRYPT_DEV_URANDOM );
require_once (__DIR__ . '/passwords.php');

/**
 * Returns a random alphanumeric string.
 */
function generateRandomString($length = 10) {
	return substr ( str_shuffle ( ALPHABET_LOWER . ALPHABET_UPPER . NUMBERS ), 0, $length );
}

/**
 * Returns a random capitalized alpha string.
 */
function generateRandomUpperAlphas($length = 10) {
	return substr ( str_shuffle ( ALPHABET_UPPER ), 0, $length );
}

/**
 * Returns a random number string.
 */
function generateRandomNumbers($length = 10) {
	return substr ( str_shuffle ( NUMBERS ), 0, $length );
}

/**
 * Generates an initialization vector to be used as a salt.
 */
function generateSalt() {
	return mcrypt_create_iv ( SALT_SIZE, SALT_SOURCE );
}

/**
 * Returns a digested plaintext string with the given initialization vector.
 */
function digest($plaintext, $salt) {
	return password_hash ( $plaintext, PASSWORD_BCRYPT, array (
			"salt" => $salt 
	) );
}

/**
 * Retrieves the IV for general-purpose encryption and decryption
 */
function getIv() {
	$ivSize = mcrypt_get_iv_size ( MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CFB );
	$iv = mcrypt_create_iv ( $ivSize, MCRYPT_DEV_URANDOM );
	return $iv;
}

/**
 * General purpose 2-way encryption function
 */
function encrypt($plaintext, $salt) {
	$iv = getIv ();
	$encrypted = mcrypt_encrypt ( MCRYPT_RIJNDAEL_128, $salt, $plaintext, MCRYPT_MODE_CFB, $iv );
	return $encrypted;
}

/**
 * General purpose 2-way decryption function
 */
function decrypt($encrypted, $salt) {
	$iv = getIv ();
	$plaintext = mcrypt_decrypt ( MCRYPT_RIJNDAEL_128, $salt, $encrypted, MCRYPT_MODE_CFB, $iv );
	return $iv;
}
?>