import './App.css';
import Post from './Post.js';
import CreatePost from './CreatePost.js';
import React from 'react';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      posts: []
    };

    this.removePostFromState = this.removePostFromState.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  // the list of posts will be filled after the component is mounted
  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(resp => resp.json())
      .then(resp => {
        this.setState({posts: resp})
      });
      console.log("Fetch concluded");
}

  removePostFromState(id) {
    fetch('https://jsonplaceholder.typicode.com/posts/'+id, {
      method: 'DELETE',
    });

    let updatingArray = this.state.posts.slice();
    let index = updatingArray.findIndex(item => item.id === id);
    updatingArray.splice(index, 1);
    this.setState({posts: updatingArray});
  }

  handleUpdate(event) {
    event.preventDefault();
    let id = event.target.id.value.trim();

    if (!id || (!event.target.title.value.trim().length &&
      !event.target.body.value.trim().length && !event.target.userId.value.trim().length)) {
      alert("Fill all the fields properly");
      return;
    }

    if (isNaN(id)) {
      alert("The id must be a number");
      return;
    }
    let index = this.state.posts.findIndex(item => item.id == id);
    if(index == -1) {
      alert("The post you want to update is not present");
      return;
    }

    let item = this.state.posts[index];
    let userId = (!event.target.userId.value.trim().length) ? item.userId : event.target.userId.value;
    let title = (!event.target.title.value.trim().length) ? item.title : event.target.title.value;
    let body = (!event.target.body.value.trim().length) ? item.body : event.target.body.value;

    if (isNaN(userId)) {
      alert("The userId must be a number");
      return;
    }

    console.log(id);
    fetch('https://jsonplaceholder.typicode.com/posts/'+id, {
  method: 'PUT',
  body: JSON.stringify({
    id: id,
    title: title,
    body: body,
    userId: userId,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
    alert("Post updated");
    document.getElementById("create-post-form").reset();

    let newItem = new Object();
    newItem.id = id;
    newItem.title = title;
    newItem.body = body;
    newItem.userId = userId;
    let updatingArray = this.state.posts.slice();
    updatingArray.splice(index, 1, newItem);
    this.setState({posts: updatingArray});
  }

  render() {
    return (
      <div className="body">
      <h1>Welcome to the Beautiful Collection of Posts</h1>

      <details>
      <summary className='create-summary'>Add a new post</summary>
        <CreatePost/>
      </details>
      <details>
        <summary className='update-summary'>Modify an existing post</summary>
        <form id="update-post-form" className="post-form" onSubmit={this.handleUpdate}>
        Insert only data to be modified, a field left empty will be kept untouched.<br/>
        Do not forget to insert the "ID" associated to the post to be updated.<br/>
        <input type="text" id="id" name="id" placeholder='ID of the post to be updated'/><br/>
        <input type="text" id="userId" name="userId" placeholder='UserId'/><br/>
        <input type="text" id="title" name="title" placeholder='Title'/><br/>
        <textarea id="body" name="body" placeholder="Body of the post"/><br/>
        <input type="submit" value="Update"/>
        </form>
      </details>
      <h2>List of posts</h2>
      {this.state.posts.map((item) => (
        <Post key={item.id} post={item} delete={this.removePostFromState}/>
      ))}
      </div>
    );
  }
}

export default App;
