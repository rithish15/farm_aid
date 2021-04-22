CREATE TABLE user_details (
    user_key int NOT NULL AUTO_INCREMENT,    
    mobile decimal(10,0),
    name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
	PRIMARY KEY (user_key,mobile)
);

ALTER TABLE user_details AUTO_INCREMENT=200;