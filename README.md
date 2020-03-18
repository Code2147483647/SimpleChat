# SimpleChat assignment

Simple chat room and manage member
demo accounts:
acc/pwd
admin: admin@myAdmin.com Aa12345678!!
member: testUI1@g.com/111111

## Environment

Write and test in Nodejs 12
mysql  Ver 8.0.19 for osx10.15 on x86_64 (Homebrew)

## Setup

```
npm i
```

## Test

```
npm test
```

## Usage

default port 8080

```bash
./app.js
```

## DB Schmea

```
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
```
