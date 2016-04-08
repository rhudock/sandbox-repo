ALTER TABLE `configuration`.`page` DROP `pageURLPatternUI`;
ALTER TABLE `configuration`.`page_log` CHANGE `pageURLPatternUI` `pageURLPattern` VARCHAR(1000);
