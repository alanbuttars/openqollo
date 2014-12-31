<?php
define('HOST', 'localhost');
define('DB_ALIAS', 'ninespot_openqollo');
define('USERNAME', 'ninespot_qollo');
define('PASSWORD', 'txop2tlPZkdHEadh3q0H');

/**
 * Creates a database connection
 */
function getConnection($connectionType = 'pdo') {
	if ($connectionType == 'mysqli') {
		try {
			return new mysqli(HOST, USERNAME, PASSWORD, DB_ALIAS);
		}
		catch ( Exception $e ) {
			die('Cannot open database' . $e->getMessage());
		}
	}
	else {
		try {
			$pdo = new PDO("mysql:host=" . HOST . ";dbname=" . DB_ALIAS, USERNAME, PASSWORD);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			return $pdo;
		}
		catch ( PDOException $e ) {
			echo 'Cannot connect to database';
			exit();
		}
	}
}

/**
 * Closes the given database connection streams
 */
function close($connection, $statement, $resultSet = NULL) {
	$connection = null;
	$statement = null;
	$resultSet = null;
}

/**
 * Retrieves the current UTC timestamp
 */
function getCurrentTimestamp() {
	$dateFormat = "Y-m-d H:i:s";
	$date = gmdate($dateFormat);
	return $date;
}
?>