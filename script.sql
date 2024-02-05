CREATE DATABASE bookstore;
USE bookstore;


CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) not null,
    author VARCHAR(255) not null,
    year INT 
);
