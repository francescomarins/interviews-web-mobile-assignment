import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, Pressable } from 'react-native';

var url = "http://192.168.1.11:5000/posts";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      userId: "",
      title: "",
      body: "",
      formVisible: false,
      showCommentsVisible: true
    };
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
    this.setState({formVisible: !this.state.formVisible});
  }

  sendEdit(event) {
    event.preventDefault();
    let id = this.props.post.id;

    // Setting up variables for the request to the server
    let userId = (!this.state.userId.trim().length) ? this.props.post.userId : this.state.userId;
    let title = (!this.state.title.trim().length) ? this.props.post.title : this.state.title;
    let body = (!this.state.body.trim().length) ? this.props.post.body : this.state.body;

    //Last check, done here to avoid doing it on an empty field which was not intended to be modified by the user
    if (isNaN(userId)) {
      alert("The userId must be a number");
      return;
    }

    this.props.edit(id, title, body, userId);
    this.setState({formVisible: !this.state.formVisible});
  }

  cancelEdit() {
    this.setState({formVisible: !this.state.formVisible});
  }

  loadComments() {
    fetch(url + '/' + this.props.post.id + '/comments')
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp);
        this.setState({comments: resp, showCommentsVisible: false})
    }).catch(function(err) {
      console.log('Comments retrival error -> ' + err.message);
    });
  }

  render() {
    let post = this.props.post;
    let user = post.userId;
    let id = post.id;
    let title = post.title;
    let body = post.body;

    let form = (this.state.formVisible) ? (<View>
          <Pressable style={styles.button} onPress={this.cancelEdit}><Text style={styles.whiteText}>CANCEL</Text></Pressable>
          <Text>Please, leave those fields that you want to keep unchanged as they are (empty).
          You're updating post {id}</Text>
          <View style={styles.inline}><Text>UserId: </Text><TextInput style={styles.input} onChangeText={newText => this.setState({user: newText})} defaultValue={user} keyboardType="numeric"/></View>
          <View style={styles.inline}><Text>Title: </Text><TextInput style={styles.input} multiline={true} numberOfLines={2} onChangeText={newText => this.setState({title: newText})} defaultValue={title}/></View>
          <TextInput style={styles.input} multiline={true} numberOfLines={4} onChangeText={newText => this.setState({body: newText})} defaultValue={body}/>
          <Pressable style={styles.button} onPress={this.sendEdit}><Text style={styles.whiteText}>UPDATE</Text></Pressable>
          </View>) : null;
    let postContent = (!this.state.formVisible) ? (
      <View>
      <View style={styles.postHeader}>
      <Text style={styles.userText}>User {user}</Text>
      <Text style={styles.postOps}>
      <Pressable style={styles.redButton} onPress={this.delete}><Text style={styles.whiteText}>Delete</Text></Pressable>
      <Pressable style={styles.greenButton} onPress={this.edit}><Text style={styles.whiteText}>Edit</Text></Pressable>
      </Text>
      </View>
      <View style={styles.postContent}>
      <Text style={[styles.bold, styles.leftPad]}>{title}</Text>
      <Text style={styles.leftPad}>{body}</Text>
      {showComments}
      </View>
      {this.state.comments.map((item) => (
        <View key={item.id} style={styles.comment}>
        <Text style={[styles.userText, styles.commentHead]}>{item.name}</Text>
        <Text >{item.body}</Text>
        </View>
      ))}
      </View>
    ) : null;
    let showComments = (this.state.showCommentsVisible) ?
    (<Pressable style={styles.showComments} onPress={this.loadComments}><Text style={styles.whiteText}>SHOW COMMENTS</Text></Pressable>) : null;
    return (
      <View style={styles.post}>
      {form}
      {postContent}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  whiteText: {
    color: 'white'
  },
  post: {
    borderRadius: 8,
    borderStyle: 'solid',
    borderColor: '#246875',
    borderWidth: 1,
    margin: 4,
  },
  userText: {
    padding: 2,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  input: {
    margin: 5,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 7,
    padding: 5,
    flex: 1
  },
  redButton: {
    backgroundColor: '#ff6666',
    borderRadius: 5,
    padding: 2,
    elevation: 3,
  },
  greenButton: {
    backgroundColor: '#5cd65c',
    borderRadius: 5,
    padding: 2,
    elevation: 3,
  },
  button: {
    backgroundColor: '#78c4d4',
    alignItems: 'center',
    borderRadius: 7,
    padding: 2,
    elevation: 3,
  },
  inline: {
    flexDirection: 'row',
    justifyContents: 'space-around',
    alignItems: 'center',
  },
  postHeader: {
    backgroundColor: '#78c4d4',
    borderColor: '#4bb8cf',
    flexDirection: 'row',
    justifyContents: 'space-around',
    alignItems: 'stretch',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  postOps: {
    position: 'absolute',
    right: 1,
  },
  leftPad: {
    paddingLeft: 2,
  },
  showComments: {
    backgroundColor: '#c4e6ed',
    padding: 1,
    paddingLeft: 2,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  comment: {
    borderRadius: 8,
    borderRadius: 8,
    borderColor: '#c4e6ed',
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 2,
  },
  commentHead: {
    backgroundColor: '#c4e6ed',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
});

export default Post;
