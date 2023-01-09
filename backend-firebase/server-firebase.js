const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const fb = require("firebase-admin");
var serviceAccount = require("./webassignment-d6aa0-firebase-adminsdk-e4g6p-7832d7d559.json");

fb.initializeApp({
  credential: fb.credential.cert(serviceAccount),
  apiKey: "AIzaSyDY45lF5AXa1XX2VQ7nrXoNND287ioYFps",
  authDomain: "webassignment-d6aa0.firebaseapp.com",
  databaseURL: "https://webassignment-d6aa0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "webassignment-d6aa0",
  storageBucket: "webassignment-d6aa0.appspot.com",
  messagingSenderId: "79260697945",
  appId: "1:79260697945:web:d8997c4de59265d21db848"
});

const db = fb.database();
const postsRef = db.ref('posts');
var lastId;

postsRef.orderByKey().limitToLast(1).once('value', (data) => {
  if(!data.val()) {
    lastId = 0;
  } else {
    data.forEach((childSnapshot) => {
      lastId = childSnapshot.key;
    });
  }
  console.log(lastId);
});

obj = [
  {
    "postId": 1,
    "id": 1,
    "name": "id labore ex et quam laborum",
    "email": "Eliseo@gardner.biz",
    "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
  },
  {
    "postId": 1,
    "id": 2,
    "name": "quo vero reiciendis velit similique earum",
    "email": "Jayne_Kuhic@sydney.com",
    "body": "est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et"
  },
  {
    "postId": 1,
    "id": 3,
    "name": "odio adipisci rerum aut animi",
    "email": "Nikita@garfield.biz",
    "body": "quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione"
  }];
db.ref("posts/1/comments").set(obj)

app.get('/posts', (req, res) => {
  console.log("Reading ID: from " + req.query.id_gte + " to " + req.query.id_lte);
  let idFrom = req.query.id_gte;
  let idTo = req.query.id_lte;

  //this solution assumes that all ids are taken because all the time we click on load more from the frontend
  //if there are 15 position empty in the db, the client receives an empty array and removes the load-more button
  //as a consequence a better solution would be ordering posts by id and get the first 15 so that any deletion does not
  //cause any issue
  postsRef.once('value', (data) => {
    if (!data.val()) {
      console.log("Empty set");
      res.json([]);
      return;
    } else {
      let result = data.val().filter(item => item.id >= idFrom && item.id <= idTo);
      res.json(result);
    }
  });
});

app.get('/posts/*/comments', (req, res) => {
  let postId = req.url.split('/').at(-2);
  console.log("Reading comments for: " + postId);
  let email = req.body.email;
  let name = req.body.name;
  let body = req.body.body;
  db.ref("posts/"+postId+"/comments").once('value', (data) => {
    if (!data.val()) {
      console.log("No comments found");
      res.json([]);
      return;
    } else {
      res.json(data.val());
    }
  });
});

app.post("/posts", (req, res) => {
  console.log("--- POST REQUEST ---");
  let id = Number(lastId)+1;
  let userId = req.body.userId;
  let title = req.body.title;
  let body = req.body.body;

  postsRef.child(id).set({
    'id' : id,
    'userId' : userId,
    'title' : title,
    'body' : body
  });
  lastId++;
});

app.put("/posts/*", (req, res) => {
  console.log("--- PUT REQUEST ---");
  let id = req.url.split('/').at(-1);
  let userId = req.body.userId;
  let title = req.body.title;
  let body = req.body.body;

  postsRef.child(id).set({
    'id' : id,
    'userId' : userId,
    'title' : title,
    'body' : body
  });
})

app.delete('/posts/*', (req, res) => {
  console.log("--- Delete REQUEST ---");
  let id = req.url.split('/').at(-1);
  db.ref("posts/"+id).remove();
});

app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
