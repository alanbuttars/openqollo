DROP TABLE IF EXISTS `users`;

CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(128) DEFAULT NULL,
  `number` varchar(16) NOT NULL,
  `password` text NOT NULL,
  `salt` varchar(64) NOT NULL,
  `tokenPrivate` varchar(64) NOT NULL,
  `tokenPublic` varchar(64) NOT NULL,
  `timeCreated` date NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `ix_user` (`number`, `email`, `tokenPublic`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=41 ;