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
 * Returns a sanitized array.
 */
function sanitizeArray($values) {
	$sanitizedValues = array();
	foreach ($values as $value) {
		if (is_object($value)) {
			$sanitizedObject = array();
			foreach ($value as $key => $val) {
				$sanitizedKey = null;
				$sanitizedVal = null;
				if (is_array($key)) {
					$sanitizedKey = sanitizeArray($key);
				}
				else {
					$sanitizedKey = sanitize($key);
				}
				if (is_array($val) || is_object($val)) {
					$sanitizedVal = sanitizeArray($val);
				}
				else {
					$sanitizedVal = sanitize($val);
				}
				$sanitizedObject[$sanitizedKey] = $sanitizedVal;
			}
			$sanitizedValues[] = $sanitizedObject;
		}
		else {
			$sanitizedValues[] = sanitize($value);
		}
	}
	return $sanitizedValues;
}

/**
 * Returns the sanitized object value associated with a given object's key, if it exists.
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
 * Returns the sanitized array of objects associated a given object's key, if it exists.
 * Otherwise, the default value is returned.
 */
function sanitizeObjectArrayVar($object, $variableName, $default = null) {
	if (isset($object)) {
		if (isset($object->$variableName)) {
			$value = $object->$variableName;
			return sanitizeArray($value);
		}
		else if (is_array($object) && isset($object["$variableName"])) {
			$value = $object["$variableName"];
			return sanitizeArray($value);
		}
	}
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