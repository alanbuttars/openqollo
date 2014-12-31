<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../users/users.php');

$response = getUserProfile($userId);
sendResponse($response);
?>