import React from 'react';

class Post extends React.Component {

  render() {
    let post = this.props.post;
    let user = post.userId;
    let id = post.id;
    let title = post.title;
    let body = post.body;
    return (
      <div className="post">
        <div className="post-content">
        <div className="post-header">
          <span className="user">User: {user}</span>
          <span>{id}</span>
        </div>
        <div><strong>{title}</strong></div>
        <div>{body}</div>
      </div>
      </div>
    );
  }
}

export default Post;
