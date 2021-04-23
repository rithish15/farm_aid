CREATE TABLE user_details (
    user_key int NOT NULL AUTO_INCREMENT,    
    mobile decimal(10,0),
    name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    email varchar(255),
	PRIMARY KEY (user_key,mobile)
);

ALTER TABLE user_details AUTO_INCREMENT=200;

create table entryTable(entry_id int NOT NULL auto_increment primary key, user_id int ,entry_name varchar(100), farm_id int, irrigation boolean, pesticide boolean,fertilizer boolean, time date not null ,comments varchar(1024));