--Drop the database :  `example_jdbc`
DROP DATABASE IF EXISTS `example_jdbc`;

--Create the database :  `example_jdbc`
CREATE DATABASE IF NOT EXISTS `example_jdbc` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `example_jdbc`;

--Create the Example table.
CREATE TABLE IF NOT EXISTS `example` (
  `example_id` int(6) NOT NULL AUTO_INCREMENT,
  `title` varchar(60) NOT NULL,
  `description` varchar(250) NOT NULL,
  PRIMARY KEY (`example_id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--Insert some examples in the database.
INSERT INTO `example` (`title`, `description`) VALUES ('example title 1', 'example description 1');
INSERT INTO `example` (`title`, `description`) VALUES ('example title 2', 'example description 2');
INSERT INTO `example` (`title`, `description`) VALUES ('example title 3', 'example description 3');
INSERT INTO `example` (`title`, `description`) VALUES ('example title 4', 'example description 4');