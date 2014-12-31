<?php

/**
* Returns a safely decoded JSON request.
*/
function receiveRequest() {
	return json_decode(file_get_contents("php://input"));
}

/**
 * Returns a safely encoded JSON response.
 */
function sendResponse($objects) {
	echo ")]}',\n" . json_encode($objects);
}

/**
 * Returns the sanitized value.
 */
function sanitize($value) {
	if (is_string($value)) {
		$value = trim($value);
	}
	return htmlspecialchars($value);
}

/**
 * Returns the sanitized value associated with a given object's key, if it exists.
 * Otherwise, the default value is returned.
 */
function sanitizeObjectVar($object, $variableName, $default = NULL) {
	if (isset($object)) {
		if (isset($object->$variableName)) {
			$value = $object->$variableName;
			return sanitize($value);
		}
		else if (is_array($object) && isset($object["$variableName"])) {
			$value = $object["$variableName"];
			return sanitize($value);
		}
	}
	return $default;
}

/**
 * Returns the sanitized value associated with a given array's key, if it exists.
 * Otherwise, the default value is returned.
 */
function sanitizeArrayVar($array, $variableName, $default = null) {
	if (isset($array)) {
		if (isset($array[$variableName])) {
			$value = $array[$variableName];
			return sanitize($value);
		}
	}
	return $default;
}
?>