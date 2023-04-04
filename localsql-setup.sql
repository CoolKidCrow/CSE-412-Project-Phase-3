DROP TABLE Users;

CREATE TABLE Users (
    UID serial,
	gender varchar(255),
	hometown varchar(255),
	dob varchar(255) NOT NULL,
	fName varchar(255) NOT NULL,
	lName varchar(255) NOT NULL,
	email varchar(255) NOT NULL UNIQUE,
	hashPass varchar(255) NOT NULL,
	
	PRIMARY KEY (UID)
);