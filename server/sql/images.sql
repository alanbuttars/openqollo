DROP TABLE IF EXISTS `images`;

CREATE TABLE IF NOT EXISTS `images` (
`imageId` int(11) unsigned NOT NULL AUTO_INCREMENT,
`senderUserId` int(11) unsigned NOT NULL,
`receiverUserId` int(11) unsigned NOT NULL,
`status` ENUM('live', 'deleted') NOT NULL DEFAULT 'live',
`image` LONGBLOB NOT NULL,
`viewed` boolean DEFAULT false,
`timeSent` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
`timeUpdated` timestamp NOT NULL DEFAULT now() ON UPDATE now(),
PRIMARY KEY (`imageId`),
CONSTRAINT FOREIGN KEY (`senderUserId`,`receiverUserId`) REFERENCES `users`
ON DELETE CASCADE ON UPDATE CASCADE,
UNIQUE KEY `ix_image` (`imageId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=41 ;