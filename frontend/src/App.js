import './App.css';
import Post from './Post.js';
import CreatePost from './CreatePost.js';
import React from 'react';

const bundle_size = 15;
const url = "http://localhost:5000/posts";

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
    let url_get = url + '?id_gte=' + Number(this.state.loaded+1) + '&id_lte=' + Number(this.state.loaded+bundle_size);
    fetch(url_get).then(resp => resp.json()).then(resp => {
      if(resp.length < bundle_size)
      document.getElementById('load-more').style.display = 'none';
      if(resp.length && this.state.posts.indexOf(resp[0].id)===-1) {
        let updatingArray = this.state.posts.concat(resp);
        this.setState({posts: updatingArray, loaded: this.state.loaded+resp.length})
      }}).catch(function(err) {
        console.log('Data retrival error -> ' + err);
      });
    }

    removePostFromState(id) {
      fetch(url+'/'+id, {
        method: 'DELETE',
      }).catch(function(err) {
        console.log('Removal error -> ' + err);
        return;
      });

      let updatingArray = this.state.posts.slice();
      let index = updatingArray.findIndex(item => item.id === id);
      updatingArray.splice(index, 1);
      this.setState({posts: updatingArray, loaded: updatingArray.length});
    }

    handleUpdate(id, title, body, userId) {
      let index = this.state.posts.findIndex(item => item.id === Number(id));

      //Request to server
      fetch(url+'/'+id, {
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
      .then((response) => response.json()).catch(function(err) {
        console.log('Fetch error -> ' + err);
        return;
      });

      //Updating the state with the edited list of posts
      let newItem = {};
      newItem.id = id;
      newItem.title = title;
      newItem.body = body;
      newItem.userId = userId;
      let updatingArray = this.state.posts.slice();
      updatingArray.splice(index, 1, newItem);
      this.setState({posts: updatingArray});

      document.getElementById("post-"+id+"-content").style.display = 'block';
      document.getElementById("update-post-"+id+"-form").style.display = 'none'
    }

    render() {

      return (
        <div className="body" onScroll={this.fetchData}>
        <h1>Welcome to the Beautiful Collection of Posts</h1>
        <details>
        <summary className='create-summary'>Add a new post</summary>
        <CreatePost/>
        </details>
        <h2>List of posts</h2>
        {this.state.posts.map((item) => (
          <Post key={item.id} post={item} delete={this.removePostFromState} edit={this.handleUpdate}/>
        ))}
        <input type='button' id='load-more' value='Load Posts' onClick={this.fetchData}/>
        </div>
      );
    }
  }

  export default App;
