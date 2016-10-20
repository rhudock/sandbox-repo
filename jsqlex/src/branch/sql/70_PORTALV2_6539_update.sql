ALTER TABLE `configuration`.`page` ADD `pageURLPatternUI` VARCHAR(1000) NULL;
UPDATE `configuration`.`page`
SET `pageURLPatternUI` = `pageURLPattern`;
ALTER TABLE `configuration`.`page_log` CHANGE `pageURLPattern` `pageURLPatternUI` VARCHAR(1000);