CREATE TABLE IF NOT EXISTS `categories` (
	id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	label varchar(255) NOT NULL,
  description varchar(255)
);

CREATE TABLE IF NOT EXISTS `products` (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  label varchar(255) NOT NULL,
  description LONGTEXT,
  price varchar(255),
  quantity int(11),
  video_link LONGTEXT,
  category_id int(11),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `meduse`.`user` (
  `id` INT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(80) NOT NULL,
  `phone` VARCHAR(45) NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);
