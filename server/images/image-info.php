<?php
require_once (__DIR__ . '/../utils/database.php');

/**
 * Retrieves an <code>array</code> of image info.
 * 
 * @param int $userId        	
 * @param int $startIndex        	
 * @param int $numResults        	
 * @throws Exception On connection failure
 */
function getImageNotifications($userId, $startIndex, $numResults) {
	$conn = getConnection();
	$sql = "select imageId, senderUserId, receiverUserId, viewed, timeSent " . 	//
	"from images " . 	//
	"where (senderUserId = ? or receiverUserId = ?) " . 	//
	"and status = 'live' " . 	//
	"order by timeUpdated desc " . 	//
	"limit ?, ?";
	$stmt = $conn->prepare($sql);
	$stmt->bindValue(1, $userId, PDO::PARAM_INT);
	$stmt->bindValue(2, $userId, PDO::PARAM_INT);
	$stmt->bindValue(3, $startIndex, PDO::PARAM_INT);
	$stmt->bindValue(4, $numResults, PDO::PARAM_INT);
	
	if ($stmt->execute()) {
		$notifications = array();
		while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) {
			$notification = array();
			$notification["imageId"] = $row["imageId"];
			$notification["viewed"] = $row["viewed"];
			$notification["timeSent"] = $row["timeSent"];
			if ($row["senderUserId"] == $userId) {
				$notification["userId"] = $row["receiverUserId"];
				$notification["type"] = "sent";
			}
			else {
				$notification["userId"] = $row["senderUserId"];
				$notification["type"] = "received";
			}
			$notifications[] = $notification;
		}
		close($conn, $stmt);
		return $notifications;
	}
	close($conn, $stmt);
	throw new Exception("Failed to retrieve image notifications");
}

?>