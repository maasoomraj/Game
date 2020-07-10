import React, { Component } from "react";
import {
  View,
  Text,
  BackHandler,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";

import { store } from "../helpers/redux-store";
import questions from "../helpers/questions/friends";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

let backPressed = 0;

export default class GameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      answer: "",
      playersAnswered: 0,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const admin = navigation.getParam("admin");
    const gameID = navigation.getParam("gameID");
    const players = navigation.getParam("players");
    const playerID = navigation.getParam("playerID");

    console.log("USERS");
    console.log(store.getState().user);
    console.log("admin");
    console.log(admin);

    this.setState(
      {
        admin,
        gameID,
        players,
        playerID,
        user: store.getState().user,
      },
      () => {
        this.questionMake();
        this.receiveQuestion();
        this.changesMade();
      }
    );

    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );
  }

  handleBackButton() {
    if (backPressed > 0) {
      this.props.navigation.navigate("GameSelect");
      backPressed = 0;
    } else {
      backPressed++;
      ToastAndroid.show("Press Again To Exit the Game", ToastAndroid.SHORT);
      setTimeout(() => {
        backPressed = 0;
      }, 2000);
      return true;
    }
  }

  questionMake = async () => {
    if (this.state.user.key === this.state.admin) {
      try {
        await firebase
          .database()
          .ref("game")
          .child(this.state.gameID)
          .child("question")
          .set({
            question: questions(
              this.state.players[
                Math.floor(Math.random() * this.state.players.length)
              ].name,
              Math.floor(Math.random() * 77)
            ),
          });
      } catch (error) {
        alert("Problem in loading Page!");
      }
    }
  };

  changesMade = async () => {
    await firebase
      .database()
      .ref("game")
      .child(this.state.gameID)
      .child("players")
      .on("child_changed", (snapshot) => {
        let players = this.state.players;
        for (let i in players) {
          if (players[i].userKey === snapshot.val().userKey) {
            players[i] = snapshot.val();
            break;
          }
        }
        this.setState({
          players,
          playersAnswered: this.state.playersAnswered + 1,
        });
      });
  };

  receiveQuestion = async () => {
    await firebase
      .database()
      .ref("game")
      .child(this.state.gameID)
      .child("question")
      .on("child_added", (snapshot) =>
        this.setState({ question: snapshot.val() })
      );

    await firebase
      .database()
      .ref("game")
      .child(this.state.gameID)
      .child("question")
      .on("child_changed", (snapshot) =>
        this.setState({ question: snapshot.val() })
      );
  };

  submit = async () => {
    await firebase
      .database()
      .ref("game")
      .child(this.state.gameID)
      .child("players")
      .child(this.state.playerID)
      .update({ answer: this.state.answer, answered: true }, () =>
        this.props.navigation.navigate("AnswerState", {
          players: this.state.players,
          gameID: this.state.gameID,
          playersAnswered: this.state.playersAnswered,
          playerID: this.state.playerID,
          admin: this.state.admin,
        })
      );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          backgroundColor: "#130B21",
        }}
      >
        <View
          style={{
            margin: 20,
            justifyContent: "center",
            alignItems: "center",
            minHeight: 100,
            borderBottomWidth: 0.5,
            borderColor: "#EC3D6C",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#EC3D6C",
              paddingHorizontal: 10,
            }}
          >
            {this.state.question}
          </Text>
        </View>
        <TextInput
          style={{
            margin: 20,
            height: 200,
            borderWidth: 0.5,
            borderColor: "#000",
            borderColor: "#eee",
            color: "#eee",
            padding: 10,
          }}
          placeholder="Enter your answer"
          textAlignVertical="top"
          multiline={true}
          value={this.state.answer}
          onChangeText={(text) => this.setState({ answer: text })}
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            onPress={this.submit}
            style={{
              backgroundColor: "#F0B342",
              borderWidth: 0.5,
              borderColor: "#000",
              width: 80,
              height: 50,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
