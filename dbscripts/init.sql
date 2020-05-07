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