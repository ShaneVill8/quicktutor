CREATE TABLE Users(
    id          INT     NOT NULL AUTO_INCREMENT,
    email       varchar(255) NOT NULL UNIQUE,
    password    varchar(255) NOT NULL,
    salt        char(16) NOT NULL,
    firstname   varchar(255) NOT NULL,
    lastname    varchar(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Listings(
    id          INT     NOT NULL AUTO_INCREMENT,
    owner       INT     NOT NULL,
    title       VARCHAR(255)    NOT NULL,
    description VARCHAR(512)    NOT NULL,
    time        DATETIME    DEFAULT NOW() NOT NULL,
    duration    INT     DEFAULT 0 NOT NULL,

    PRIMARY KEY(id),
    FOREIGN KEY(owner) REFERENCES Users(id)
);


