import React from 'react';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = { comments: [] };
    this.delete = this.delete.bind(this);
    this.loadComments = this.loadComments.bind(this);
  }

  delete() {
    this.props.delete(this.props.post.id)
  }

  loadComments() {
    fetch('http://localhost:5000/posts/' + this.props.post.id + '/comments')
    .then(resp => resp.json())
    .then(resp => {
      this.setState({comments: resp})
    });
    document.getElementById("post-"+this.props.post.id).style.cursor = 'default';
  }

  render() {
    let post = this.props.post;
    let user = post.userId;
    let id = post.id;
    let title = post.title;
    let body = post.body;
    return (
      <div id={"post-"+id} className="post">
        <div className="post-content" onClick={this.loadComments}>
          <div className="post-header">
            <span className="user">User: {user}</span>
            <span className='post-ops'>
              <span>ID: {id}</span>
              <input type='button' className="delete-button" value='Delete' onClick={this.delete}/>
            </span>
          </div>
        <div>
          <strong>{title}</strong>
        </div>
          <div>{body}</div>
          {this.state.comments.map((item) => (
            <div key={item.id} className='comment'>
              <div className='user'>Name: {item.name}</div>
              <div>{item.body}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Post;
