DROP TABLE Users;
DROP TABLE Friends;
DROP TABLE Albums;
DROP TABLE Photos;
DROP TABLE Likes;
DROP TABLE Tags

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

CREATE TABLE Photos (
	PID serial,
	AID serial NOT NULL REFERENCES Albums(AID) ON DELETE CASCADE,
	caption varchar(255),
	photoUrl varchar(2000),
	date timestamp default current_timestamp,
	
	PRIMARY KEY (PID)
);

CREATE TABLE Comments (
	CID serial,
	PID serial NOT NULL REFERENCES Photos(PID) ON DELETE CASCADE,
	UID serial NOT NULL REFERENCES Users(UID) ON DELETE CASCADE,
	text varchar(500),
	date timestamp default current_timestamp,
	
	PRIMARY KEY (CID)
);

CREATE TABLE Likes (
	UID serial NOT NULL REFERENCES Users(UID) ON DELETE CASCADE,
	PID serial NOT NULL REFERENCES Photos(PID) ON DELETE CASCADE,
	
	PRIMARY KEY (UID, PID)
);

CREATE TABLE Tags (
	TID serial,
	text varchar(255),
	PID serial NOT NULL REFERENCES Photos(PID) ON DELETE CASCADE,
	
	PRIMARY KEY (TID)
);

CREATE UNIQUE INDEX tags_pid_text ON Tags (text, PID) WHERE text IS NOT NULL;


