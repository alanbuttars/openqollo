<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');

sendResponse(array(
		"auth" => $userId
));
?>