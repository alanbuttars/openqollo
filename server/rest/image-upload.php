<?php
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../images/images.php');

$friendshipIds = explode(",", trim($_REQUEST["friendshipIds"], "[]"));
$image = $_FILES["file"];
$imageName = $image["tmp_name"];
$imageBinary = fread(fopen($imageName, "r"), filesize($imageName));

$encodedImage = base64_encode($imageBinary);
sendImage($userId, $friendshipIds, $encodedImage);

echo json_encode(array(
		"success" => true
));

?>