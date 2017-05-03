CREATE TABLE Users(
    id          INT     NOT NULL AUTO_INCREMENT,
    email       varchar(255) NOT NULL,
    password    varchar(255) NOT NULL,
    salt        char(16) NOT NULL,
    firstname   varchar(255) NOT NULL,
    lastname    varchar(255) NOT NULL,
    PRIMARY KEY(id)
);


