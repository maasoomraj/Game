import React, { Component } from "react";
import {
  View,
  Text,
  BackHandler,
  TextInput,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { store } from "../helpers/redux-store";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

export default class AnswerState extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const players = navigation.getParam("players");
    const gameID = navigation.getParam("gameID");
    const playersAnswered = navigation.getParam("playersAnswered");
    const playerID = navigation.getParam("playerID");
    const admin = navigation.getParam("admin");

    console.log(store.getState().user);
    console.log("admin");
    console.log(admin);

    this.setState(
      {
        admin,
        players,
        user: store.getState().user,
        gameID,
        playersAnswered,
        playerID,
      },
      () => {
        this.changesMade();
        this.allAnswered();
      }
    );

    console.log(playersAnswered);
  };

  changesMade = async () => {
    try {
      console.log(this.state.gameID);
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
          this.setState(
            {
              players: players,
              playersAnswered: this.state.playersAnswered + 1,
            },
            () => this.allAnswered()
          );
        });
    } catch (error) {
      alert(error);
    }
  };

  allAnswered = () => {
    let numberOfAnswers = 0;
    for (let i in this.state.players) {
      if (this.state.players[i].answered === true) {
        numberOfAnswers += 1;
      }
    }

    console.log(this.state.user.name);
    console.log(numberOfAnswers);
    if (numberOfAnswers === this.state.players.length) {
      this.props.navigation.navigate("ChooseAnswer", {
        players: this.state.players,
        gameID: this.state.gameID,
        playerID: this.state.playerID,
        admin: this.state.admin,
      });
    }
  };

  playerDisplay = (item, index) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          margin: 10,
          borderColor: "#000",
          borderWidth: 0.4,
          height: 50,
          backgroundColor: "#C6B7FA",
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>{item.name}</Text>
        </View>
        <View
          style={{
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>{item.answered ? "✓" : "⨯"}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{ marginTop: StatusBar.currentHeight, flex: 1 }}>
        <FlatList
          data={this.state.players}
          renderItem={({ item }, index) => this.playerDisplay(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
