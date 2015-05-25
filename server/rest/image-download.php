<?php
error_log(json_encode($_REQUEST));
require_once (__DIR__ . '/../utils/errors.php');
require_once (__DIR__ . '/../utils/variables.php');
require_once (__DIR__ . '/../auth/auth-filter.php');
require_once (__DIR__ . '/../images/images.php');
define('TMP_DIR', __DIR__ . '/../../../../tmp/');

$imageId = $_GET["imageId"];
$encodedImage = getImage($userId, $imageId);
error_log($encodedImage);
$decodedImage = base64_decode($encodedImage);
error_log($decodedImage);

$filename = TMP_DIR . uniqid($userId . "_") . ".jpg";
$filehandle = fopen($filename, 'w');
fwrite($filehandle, $decodedImage);
header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
header("Cache-Control: public"); // needed for i.e.
header("Content-Type: image/jpeg");
header("Content-Transfer-Encoding: Binary");
header("Content-Length:".filesize($filename));
header("Content-Disposition: attachment; filename=" . basename($filename));
header("Something: " . $filename);
readfile($filename);

die();        

?>