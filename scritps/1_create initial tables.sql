
CREATE TABLE dbo.Attachments (
    Id INT PRIMARY KEY IDENTITY(1,1),
	CollaboratorId int not null,
    FileName VARCHAR(50) NOT NULL,
    Description VARCHAR(150) NULL,
	EAttachmentType int not null,
	Active bit NOT NULL
);

CREATE TABLE dbo.Leadership(--gerencia
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(150) NOT NULL,
	Active bit NULL,
);

CREATE TABLE dbo.Segment (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Color VARCHAR(150) NOT NULL,
	Name VARCHAR(150) NULL,
	Active bit NOT NULL
);

CREATE TABLE dbo.Collaborators (
	Id INT PRIMARY KEY IDENTITY(1,1),
    RUT VARCHAR(50)  NULL,
    CompleteName VARCHAR(250)  NULL,
	Area varchar(200) not NULL, --sede
	LeadershipId int  NULL,
	SegmentId int  null,
	Position VARCHAR(180) NULL,
	ECollaboratorStatus INT not NULL,
	Phone VARCHAR(20) NULL,
	Email VARCHAR(200) NULL,
	Active bit NOT NULL
    FOREIGN KEY (SegmentId) REFERENCES Segment(Id),
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


alter table dbo.Users add FOREIGN KEY (CollaboratorId) REFERENCES Collaborators(Id);