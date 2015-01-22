DROP TABLE IF EXISTS `friendships`;

CREATE TABLE IF NOT EXISTS `friendships` (
`friendshipId` int(11) unsigned NOT NULL AUTO_INCREMENT,
`senderUserId` int(11) unsigned NOT NULL,
`receiverUserId` int(11) unsigned NOT NULL,
`status` ENUM('new','accepted','denied','ended') NOT NULL,
`encryptionKey` text NOT NULL,
`timeSent` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
`timeUpdated` timestamp NOT NULL DEFAULT now() on update now(),
PRIMARY KEY (`friendshipId`),
CONSTRAINT FOREIGN KEY (`senderUserId`,`receiverUserId`) REFERENCES `users`
ON DELETE CASCADE ON UPDATE CASCADE,
UNIQUE KEY `ix_friendship` (`friendshipId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=41 ;