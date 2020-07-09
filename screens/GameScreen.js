import React, { Component } from "react";
import {
  View,
  Text,
  BackHandler,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import { store } from "../helpers/redux-store";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

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

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect")
    );
  }

  questions = (name, number) => {
    switch (number) {
      case 0:
        return `What do you hate about ${name} ?`;
      case 1:
        return `What is ${name}'s favourite colour ?`;
      case 2:
        return `What is ${name}'s bf/gf name ?`;
      case 3:
        return `What is ${name}'s age ?`;
      case 4:
        return `What is ${name}'s favourite food ?`;
      case 5:
        return `What is ${name}'s pet name ?`;
      case 6:
        return `What is ${name}'s darkest secret ?`;
      case 7:
        return `What is ${name}'s father's name ?`;
      case 8:
        return `What is ${name}'s favourite place ?`;
      case 9:
        return `Who is ${name} to you ?`;
      case 10:
        return `What is ${name}'s greatest fear ?`;
    }
  };

  questionMake = async () => {
    if (this.state.user.key === this.state.admin) {
      try {
        await firebase
          .database()
          .ref("game")
          .child(this.state.gameID)
          .child("question")
          .set({
            question: this.questions(
              this.state.players[
                Math.floor(Math.random() * this.state.players.length)
              ].name,
              Math.floor(Math.random() * 10)
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
      <View style={{ marginTop: StatusBar.currentHeight, flex: 1 }}>
        <View
          style={{
            margin: 20,
            justifyContent: "center",
            alignItems: "center",
            height: 100,
            borderBottomColor: "#000",
            borderBottomWidth: 0.5,
            backgroundColor: "#F5F2F0",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "500", padding: 20 }}>
            {this.state.question}
          </Text>
        </View>
        <TextInput
          style={{
            margin: 20,
            height: 400,
            borderWidth: 0.5,
            borderColor: "#000",
          }}
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
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
