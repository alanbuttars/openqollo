<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../friends/friends.php');

try {
	$response = getFriendshipNotifications($userId);
}
catch (Exception $e) {
	$response = array("errors" => $e);
}
sendResponse($response);
?>