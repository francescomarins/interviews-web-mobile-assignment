import './App.css';
import Post from './Post.js';
import CreatePost from './CreatePost.js';
import React from 'react';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      posts: [],
      loaded: 0
    };

    this.removePostFromState = this.removePostFromState.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    let toload;
    let url = 'https://jsonplaceholder.typicode.com/posts';
    url = url + '?id=' + Number(this.state.loaded+1);
    for(toload = this.state.loaded+2; toload<=this.state.loaded+15; toload++) {
      url = url + '&id=' + toload;
    }
    console.log(url);
    fetch(url)
    .then(resp => resp.json())
    .then(resp => {
      if(resp.length < 15)
        document.getElementById('load-more').style.display = 'none';
      if(resp.length) {
      let updatingArray = this.state.posts.concat(resp);
      this.setState({posts: updatingArray, loaded: this.state.loaded+resp.length})
    }});
    console.log("Fetch concluded");
  }

  //   // the list of posts will be filled after the component is mounted
  //   componentDidMount() {
  //     this.fetchData();
  // }

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

    // Parameters' checks
    if (!id || (!event.target.title.value.trim().length &&
    !event.target.body.value.trim().length && !event.target.userId.value.trim().length)) {
      alert("Fill all the fields properly");
      return;
    }
    if (isNaN(id)) {
      alert("The id must be a number");
      return;
    }
    let index = this.state.posts.findIndex(item => item.id === id);
    if(index === -1) {
      alert("The post you want to update is not present");
      return;
    }

    // Setting up variables for the request to the server
    let item = this.state.posts[index];
    let userId = (!event.target.userId.value.trim().length) ? item.userId : event.target.userId.value;
    let title = (!event.target.title.value.trim().length) ? item.title : event.target.title.value;
    let body = (!event.target.body.value.trim().length) ? item.body : event.target.body.value;

    //Last check, done here to avoid doing it on an empty field which was not intended to be modified by the user
    if (isNaN(userId)) {
      alert("The userId must be a number");
      return;
    }

    //Request to server
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

    //Updating the state with the edited list of posts
    let newItem = {};
    newItem.id = id;
    newItem.title = title;
    newItem.body = body;
    newItem.userId = userId;
    let updatingArray = this.state.posts.slice();
    updatingArray.splice(index, 1, newItem);
    this.setState({posts: updatingArray});
  }


  render() {
    if(this.state.loaded === 0)
      this.fetchData();

    return (
      <div className="body" onScroll={this.fetchData}>
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
      <input type='button'id='load-more' value='Load more' onClick={this.fetchData}/>
      </div>
    );
  }
}

export default App;
