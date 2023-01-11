import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, Pressable } from 'react-native';

const url = 'http://192.168.1.11:5000/posts'

class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
      title: "",
      body: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (!this.state.title.trim().length || !this.state.body.trim().length || !this.state.userId.trim().length) {
      alert("Fill all the fields properly");
      return;
    }
    if (isNaN(this.state.userId.trim())) {
      alert("The userId must be a number");
      return;
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        title: this.state.title ,
        body: this.state.body,
        userId: this.state.userId.trim(),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json()).catch(function(err) {
      console.log('Creation error -> ' + err);
      return;
    });

    this.props.changeLoadPostsVisibility();
  }

  render() {
    return (
      <View>
      <Text> Create a new post using the fields below. </Text>
      <TextInput id="userId" name="userId" onChangeText={newText => this.setState({userId: newText})} placeholder='UserId'/>
      <TextInput id="title" name="title" onChangeText={newText => this.setState({title: newText})} placeholder='Title'/>
      <TextInput id="body" name="body" onChangeText={newText => this.setState({body: newText})} placeholder="Body of the post"/>
      <Pressable style={styles.button} onPress={this.handleSubmit}><Text style={styles.whiteText}>PUBLISH</Text></Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '40%',
    backgroundColor: '#78c4d4',
    alignItems: 'center',
    borderRadius: 7,
    padding: 2,
    elevation: 3,
  },
  whiteText: {
    color: 'white'
  },
});

export default CreatePost;
