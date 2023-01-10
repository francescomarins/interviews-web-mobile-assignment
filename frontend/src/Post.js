import React from 'react';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = { comments: [] };
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.loadComments = this.loadComments.bind(this);
  }

  delete() {
    this.props.delete(this.props.post.id)
  }

  edit() {
    document.getElementById("post-"+this.props.post.id+"-content").style.display = 'none';
    document.getElementById("update-post-"+this.props.post.id+"-form").style.display = 'block';
  }

  sendEdit(event) {
    event.preventDefault();
    let id = this.props.post.id;

    // Setting up variables for the request to the server
    let userId = (!event.target.userId.value.trim().length) ? this.props.post.userId : event.target.userId.value;
    let title = (!event.target.title.value.trim().length) ? this.props.post.title : event.target.title.value;
    let body = (!event.target.body.value.trim().length) ? this.props.post.body : event.target.body.value;

    //Last check, done here to avoid doing it on an empty field which was not intended to be modified by the user
    if (isNaN(userId)) {
      alert("The userId must be a number");
      return;
    }

    this.props.edit(id, title, body, userId);
    document.getElementById("update-post-"+id+"-form").reset();
  }

  cancelEdit() {
    document.getElementById("post-"+this.props.post.id+"-content").style.display = 'block';
    document.getElementById("update-post-"+this.props.post.id+"-form").style.display = 'none';
    document.getElementById("update-post-"+this.props.post.id+"-form").reset();
  }

  loadComments() {
    fetch('http://localhost:5000/posts/' + this.props.post.id + '/comments')
    .then(resp => resp.json())
    .then(resp => {
      this.setState({comments: resp})
    });
    document.getElementById("post-"+this.props.post.id+"-load-comments").style.display = 'none';
  }

  render() {
    let post = this.props.post;
    let user = post.userId;
    let id = post.id;
    let title = post.title;
    let body = post.body;
    return (
      <div id={"post-"+id} className="post">
      <form id={"update-post-"+id+"-form"} className="edit-form post-form" onSubmit={this.sendEdit}>
      <input className="cancel-button" type="button" value="Cancel" onClick={this.cancelEdit}/><br/>
      Please, leave as they are (empty) those fields that you want to keep unchanged.<br/>
      <label>ID: <input type="text" id="id" name="id" placeholder={id} disabled/></label><br/>
      <label>UserId: <input type="text" id="userId" name="userId" placeholder={user}/></label><br/>
      <label>Title: <input type="text" id="title" name="title" placeholder={title}/></label><br/>
      <textarea id="body" name="body" placeholder={body}/><br/>
      <input type="submit" value="Update"/>
      </form>
        <div id={"post-"+id+"-content"} className="post-content">
          <div className="post-header">
            <span id={"post-"+id+"-user"} className="user">User: {user}</span>
            <span className='post-ops'>
              <span>ID: {id}</span>
              <input type='button' className="delete-button" value='Delete' onClick={this.delete}/>
              <input type='button' className="edit-button" value='Edit' onClick={this.edit}/>
            </span>
          </div>
        <div>
          <strong id={"post-"+id+"-title"} >{title}</strong>
        </div>
          <div id={"post-"+id+"-body"} >{body}</div>
          <input id={"post-"+id+"-load-comments"} type="button" className="load-comments" value="Show comments" onClick={this.loadComments}/>
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
