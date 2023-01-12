import React from 'react';
import Post from './Post';
import CreatePost from './CreatePost';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable } from 'react-native';

var url = "http://192.168.1.11:5000/posts";
var bundle_size = 2;

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      posts: [],
      loaded: 0,
      loadPostsButton: true
    };

    this.changeLoadPostsVisibility = this.changeLoadPostsVisibility.bind(this);
    this.removePostFromState = this.removePostFromState.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  changeLoadPostsVisibility() {
    this.setState({loadPostsButton: !this.state.loadPostsButton});
  }

  fetchData() {
    console.log(url, this.state.loaded, bundle_size);
      let url_get = url + '?id_gte=' + Number(this.state.loaded+1) + '&id_lte=' + Number(this.state.loaded+bundle_size);
      fetch(url_get).then(resp => resp.json()).then(resp => {
        if(resp.length < bundle_size)
        this.setState({loadPostsButton: false});
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
    }

  render() {
    let loadPostsButton = this.state.loadPostsButton ?
    (<Pressable onPress={this.fetchData} style={styles.button}><Text style={styles.whiteText}>LOAD POSTS</Text></Pressable>) : null;
    return (
      <ScrollView style={styles.container}>
      <Text style={styles.titleText}> Welcome to the Beautiful Collection of Posts</Text>
      <CreatePost changeLoadPostsVisibility={this.changeLoadPostsVisibility}/>
      <Text style={styles.secondTitleText}>List of posts</Text>
      {this.state.posts.map((item) => (
        <Post key={item.id} post={item} delete={this.removePostFromState} edit={this.handleUpdate}/>
      ))}
      {loadPostsButton}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginLeft: 5,
    marginRigth: 5,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold"
  },
  secondTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
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

export default App;
