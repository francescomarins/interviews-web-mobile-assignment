import React from 'react';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false }
    this.delete = this.delete.bind(this);
  }

  delete() {
    this.props.delete(this.props.post.id)
  }



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
            <span className='post-ops'>
              <span>ID: {id}</span>
              <input type='button' className="delete-button" value='Delete' onClick={this.delete}/>
            </span>
          </div>
        <div>
          <strong>{title}</strong>
        </div>
          <div>{body}</div>
        </div>
      </div>
    );
  }
}

export default Post;
