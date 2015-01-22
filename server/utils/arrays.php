<?php
require_once (__DIR__ . '/variables.php');

/**
 * Retrieves the properties of an associative array.
 */
function getValues($key, $array, $removeNulls = false) {
	$values = array();
	if (!empty($array)) {
		foreach ($array as $element) {
			$values[] = sanitizeArrayVar($element, $key);
		}
	}
	if ($removeNulls) {
		return array_filter($values, 'strlen');
	}
	return $values;
}
?>