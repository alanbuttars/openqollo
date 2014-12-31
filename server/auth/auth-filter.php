<?php
include_once (__DIR__ . '/auth.php');
include_once (__DIR__ . '/../utils/variables.php');

$userId = null;
$authResult = authenticateRest();
if (isset($authResult['errors'])) {
	sendResponse(array(
			"filter" => $authResult['errors']
	));
	exit();
}
else {
	$userId = $authResult['success']['userId'];
}
?>