<?php
error_reporting ( E_ALL );
ini_set ( 'display_errors', 'on' );

/**
 * A general-purpose error handling function.
 * This function should be included at the head of all REST entry points. It will log all error information, then return a 500 server error response.
 */
function errorHandler($errorNumber, $errorString, $errorFile, $errorLine) {
	$serverRootIndex = strpos ( $errorFile, "server" );
	$errorFile = substr ( $errorFile, $serverRootIndex );
	error_log ( "$errorFile:$errorLine  ($errorNumber) $errorString" );
	header ( 'HTTP/1.1 500 Internal Server Error' );
	exit ( 0 );
}

set_error_handler ( "errorHandler" );
?>