
CREATE TABLE dbo.Attachments (
    Id INT PRIMARY KEY IDENTITY(1,1),
	CollaboratorIdId int not null,
    FileBase64 VARCHAR(MAX) NOT NULL,
    FileName VARCHAR(50) NOT NULL,
    Description VARCHAR(150) NOT NULL,
	EAttachmentType int not null,
	Active bit NOT NULL
);

CREATE TABLE dbo.Areas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(150) NOT NULL,
	Description VARCHAR(150) NULL,
);

CREATE TABLE dbo.Leadership (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(150) NOT NULL,
	Description VARCHAR(150) NULL,
);


CREATE TABLE dbo.Collaborators (
    RUT VARCHAR(50)  NULL,
    CompleteName VARCHAR(250)  NULL,
	--AreaId int not NULL,
	Area varchar(200) not NULL,
	LeadershipId int not NULL,
	Position VARCHAR(180) NULL,
	ECollaboratorStatus INT not NULL,
	Phone VARCHAR(20) NULL,
	Email VARCHAR(200) NULL,
	Active bit NOT NULL
    --FOREIGN KEY (AreaId) REFERENCES Areas(Id),
    FOREIGN KEY (LeadershipId) REFERENCES Leadership(Id)
);


CREATE TABLE dbo.Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
	CollaboratorId INT not NULL,
	ERoleUser INT not NULL,
	Email VARCHAR(200) NULL,
	Password VARCHAR(200) NULL,
	ChangePassword bit NOT NULL default 1,
	Active bit NOT NULL
);
