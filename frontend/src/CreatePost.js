import React from 'react';
// var url = 'https://jsonplaceholder.typicode.com/posts';
var url = 'http://localhost:5000/posts'

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.title.value.trim().length || !event.target.body.value.trim().length || !event.target.userId.value.trim().length) {
      alert("Fill all the fields properly");
      return;
    }
    if (isNaN(event.target.userId.value)) {
      alert("The userId must be a number");
      return;
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        title: event.target.title.value ,
        body: event.target.body.value,
        userId: event.target.userId.value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json()).catch(function(err) {
      console.log('Creation error -> ' + err);
      return;
    });
    document.getElementById("create-post-form").reset();
    document.getElementById('load-more').style.display = 'block';
  }

  render() {
    return (
      <form id="create-post-form" className="post-form" onSubmit={this.handleSubmit}>
      <input type="text" id="userId" name="userId" placeholder='UserId'/><br/>
      <input type="text" id="title" name="title" placeholder='Title'/><br/>
      <textarea id="body" name="body" placeholder="Body of the post"/><br/>
      <input type="submit" value="Publish"/>
      </form>
    );
  }
}

export default CreatePost;
