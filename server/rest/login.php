<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../auth/auth.php');
require_once (__DIR__ . '/../utils/variables.php');

$request = receiveRequest ();
$email = sanitizeObjectVar ( $request, "email" );
$password = sanitizeObjectVar ( $request, "password" );

$response = login ( $email, $password );
sendResponse ( $response );
?>