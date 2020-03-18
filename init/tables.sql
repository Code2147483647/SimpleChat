USE AIMazing;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (50) NOT NULL,
    email VARCHAR (50) NOT NULL,
    password VARCHAR (64) NOT NULL,
    role VARCHAR (6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email)
    INDEX email_idx (email ASC)
);
