<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../images/image-info.php');

$request = receiveRequest();
$startIndex = intval(sanitizeObjectVar($request, "startIndex"));
$numResults = intval(sanitizeObjectVar($request, "numResults"));
$response = getImageNotifications($userId, $startIndex, $numResults);
sendResponse($response);
?>