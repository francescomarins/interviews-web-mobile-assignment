const express = require('express');
const cors = require('cors');

const app = express();
var mysql = require('mysql');

app.use(cors());
app.use(express.json());

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Cloud_08",
  database: "posts_db",
  socketPath: "/tmp/mysql.sock"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to db!");
});

var last_id;
con.query("SELECT id FROM posts ORDER BY id DESC LIMIT 1", function (err, result, fields) {
  if (err) throw err;
  last_id = result[0].id;
});

app.get('/posts', (req, res) => {
  console.log("Reading ID: from " + req.query.id_gte + " to " + req.query.id_lte);
  let id_from = req.query.id_gte;
  let id_to = req.query.id_lte;

  //this solution assumes that all ids are taken because all the time we click on load more from the frontend
  //if there are 15 position empty in the db, the client receives an empty array and removes the load-more button
  //as a consequence a better solution would be ordering posts by id and get the first 15 so that any deletion does not
  //cause any issue
  con.query("SELECT * FROM posts WHERE id>="+id_from+" AND id<="+id_to, function (err, result, fields) {
    if (err) throw err;
    res.json(JSON.parse(JSON.stringify(result)));
  });
});

app.get('/posts/*/comments', (req, res) => {
  console.log("Reading comments for: ");
  let postId = req.url.split('/').at(-2);

  con.query("SELECT * FROM comments WHERE postId="+ postId, function (err, result, fields) {
    if (err) throw err;
    res.json(JSON.parse(JSON.stringify(result)));
  });
});

app.post("/posts", (req, res) => {
  console.log("--- POST REQUEST ---");
  let id = last_id+1;
  let userId = req.body.userId;
  let title = req.body.title;
  let body = req.body.body;

  var sql = "INSERT INTO posts (id, userId, title, body) VALUES ('" + id + "', '" + userId + "', '" + title + "', '" + body + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record with id=" + id + " inserted");
    last_id++;
  });
});

app.put("/posts/*", (req, res) => {
  console.log("--- PUT REQUEST ---");
  let id = req.url.split('/').at(-1);
  let userId = req.body.userId;
  let title = req.body.title;
  let body = req.body.body;

  var sql = "UPDATE posts SET userId='"+userId+"', title='"+title+"', body='"+body+"' WHERE id='"+id+"'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record with id=" + id + " updated");
  });
})

app.delete('/posts/*', (req, res) => {
  console.log("--- Delete REQUEST ---");
  let id = req.url.split('/').at(-1);
  var sql = "DELETE FROM posts WHERE id = '" + id + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Post " + id + " deleted, now last_id is " + last_id);
      if(id == last_id) last_id--;
    });
});

app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
