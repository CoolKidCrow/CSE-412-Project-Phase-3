DROP TABLE Users;
DROP TABLE Friends;
DROP TABLE Albums;

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

CREATE TABLE Friends (
	UID serial NOT NULL REFERENCES Users(UID),
	FID serial NOT NULL REFERENCES Users(UID),
	date timestamp default current_timestamp,
	
	PRIMARY KEY (UID, FID)
);

CREATE TABLE Albums (
	AID serial,
	UID serial NOT NULL REFERENCES Users(UID),
	date timestamp default current_timestamp,
	albumName varchar(255) NOT NULL,
	
	PRIMARY KEY (AID)
);