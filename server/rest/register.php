<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../auth/auth.php');
require_once (__DIR__ . '/../utils/variables.php');

$request = receiveRequest ();
$email = sanitizeObjectVar ( $request, "email" );
$number = sanitizeObjectVar ( $request, "number" );
$password = sanitizeObjectVar ( $request, "password" );
$confirm = sanitizeObjectVar ( $request, "confirm" );

$response = register ( $email, $number, $password, $confirm );
sendResponse ( $response );
?>