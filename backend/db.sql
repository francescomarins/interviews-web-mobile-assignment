CREATE DATABASE `posts_db`;
USE posts_db;

CREATE TABLE posts (
  userId int not null,
  id int not null,
  title varchar(255) not null,
  body text not null,
  PRIMARY KEY (id)
);

CREATE TABLE comments (
  postId int not null,
  id int not null,
  name varchar(255) not null,
  email varchar(255) not null,
  body text not null,
  FOREIGN KEY (postId) REFERENCES posts(id),
  PRIMARY KEY (id)
);


INSERT INTO posts (userId, id, title, body)
VALUES ('1','1','title1','body1');

INSERT INTO posts (userId, id, title, body)
VALUES ('1','2','title2','body2');
