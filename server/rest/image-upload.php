<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../images/images.php');

$userIds = explode(",", trim($_REQUEST["userIds"], "[]"));
$image = $_FILES["file"];
$imageName = $image["tmp_name"];
$imageBinary = fread(fopen($imageName, "r"), filesize($imageName));

$encodedImage = base64_encode($imageBinary);
sendImage($userId, $userIds, $encodedImage);

echo json_encode(array(
		"success" => true
));

?>