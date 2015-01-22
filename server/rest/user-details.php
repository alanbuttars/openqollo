<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../users/users.php');

$request = receiveRequest();
$response = array();
try {
	$response["success"] = getUserDetails($userId, $request);
}
catch (Exception $e) {
	$response["errors"] = $e;
}
sendResponse($response);
?>