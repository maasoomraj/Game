import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  BackHandler,
} from "react-native";

import { snapshotToArray } from "../helpers/snapshot";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

export default class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      gameCode: "",
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const user = navigation.getParam("user");
    this.setState({ user });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect", {
        user: user,
      })
    );
  };

  join = async () => {
    if (this.state.gameCode === "") {
      alert("Enter the Code !");
      return;
    }

    try {
      const gameDetails = await firebase
        .database()
        .ref("gameMap")
        .child(this.state.gameCode)
        .once("value");

      if (gameDetails.val() === null) {
        alert("Game Code is wrong.");
        return;
      }

      //   const key = await firebase.database().ref("users").push().key;
      //   await firebase
      //     .database()
      //     .ref("users")
      //     .child(key)
      //     .set({ name: this.state.user.name });

      const key = this.state.user.key;

      const gameID = gameDetails.val().gameID;
      const admin = gameDetails.val().userKey;

      const playersSnap = await firebase
        .database()
        .ref("game")
        .child(gameID)
        .child("players")
        .once("value");

      const players = snapshotToArray(playersSnap);
      players.push({ name: this.state.user.name, userKey: key, ready: false });
      console.log(players);

      const playerID = await firebase
        .database()
        .ref("game")
        .child(gameID)
        .child("players")
        .push().key;
      await firebase
        .database()
        .ref("game")
        .child(gameID)
        .child("players")
        .child(playerID)
        .set({ name: this.state.user.name, userKey: key, ready: false }, () =>
          this.props.navigation.navigate("StartGame", {
            name: this.state.user.name,
            userKey: key,
            admin: admin,
            gameID: gameID,
            players: players,
            playerID,
          })
        );
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return (
      <View style={{ marginTop: StatusBar.currentHeight, flex: 1 }}>
        <View
          style={{
            margin: 20,
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            borderBottomColor: "#000",
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Join Game</Text>
        </View>

        <View style={{ flex: 1, margin: 40 }}>
          <TextInput
            placeholder="Enter Game Code"
            value={this.state.gameCode}
            onChangeText={(text) => this.setState({ gameCode: text })}
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#c4c4c4",
              marginVertical: 20,
              paddingLeft: 20,
              height: 50,
              fontSize: 18,
            }}
          />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 0.7,
                borderColor: "#000",
              }}
              onPress={this.join}
            >
              <Text
                style={{ fontSize: 30, fontWeight: "normal", color: "#000" }}
              >
                →
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            height: 50,
            marginBottom: 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text>Don't have a Game Code - </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("CreateGame", {
                user: this.state.user,
              })
            }
          >
            <Text style={{ fontWeight: "bold" }}>Create Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
