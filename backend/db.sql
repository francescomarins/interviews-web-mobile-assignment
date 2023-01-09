CREATE USER assignment_user@localhost IDENTIFIED WITH mysql_native_password BY 'assignment';
CREATE DATABASE `posts_db`;
GRANT ALL PRIVILEGES ON posts_db.* TO assignment_user@localhost WITH GRANT OPTION;
FLUSH PRIVILEGES;

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

INSERT INTO posts (userId, id, title, body)
VALUES ('2','3','title3','body3');

INSERT INTO comments (postId, id, name, email, body)
VALUES ('1','1','n1','email1@e.e', 'c1');

INSERT INTO comments (postId, id, name, email, body)
VALUES ('2','1','name1','email1@e.e', 'c1');
