import './App.css';
import Post from './Post.js';
import React from 'react';

class App extends React.Component {
  fetchPosts(){
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(resp => resp.json())
      .then(resp => {
        this.setState({posts: resp})
      });
  }

  constructor(){
    super();
    this.fetchPosts = this.fetchPosts.bind(this);
    this.state = {
      posts: []
    };
  }

  // the list of posts will be filled after the component is mounted
  componentDidMount() {
   this.fetchPosts();
}

  render() {
    return (
      <div className="body">
      <h1>List of posts</h1>
      {this.state.posts.map((item) => (
        <Post key={item.id} post={item}/>
      ))}
      </div>
    );
  }
}

export default App;
