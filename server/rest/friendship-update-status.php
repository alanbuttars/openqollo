<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../friends/friends.php');

$request = receiveRequest();
$contacts = sanitizeObjectArrayVar($request, "contacts");
$status = sanitizeObjectVar($request, "status");
$response = null;
try {
	$response = updateFriendshipStatuses($userId, $contacts, $status);
}
catch (Exception $e) {
	$response = array("errors" => $e);
}
sendResponse($response);
?>