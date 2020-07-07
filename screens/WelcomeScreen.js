import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { snapshotToArray } from "../helpers/snapshot";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

let code = "game";

export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      gameCode: "",
    };
  }

  join = async () => {
    if (this.state.name === "") {
      alert("Enter a name !");
      return;
    }

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

      const key = await firebase.database().ref("users").push().key;
      await firebase
        .database()
        .ref("users")
        .child(key)
        .set({ name: this.state.name });

      const gameID = gameDetails.val().gameID;
      const admin = gameDetails.val().userKey;

      const playersSnap = await firebase
        .database()
        .ref("game")
        .child(gameID)
        .child("players")
        .once("value");

      const players = snapshotToArray(playersSnap);
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
        .set({ name: this.state.name, userKey: key, ready: false }, () =>
          this.props.navigation.navigate("StartGame", {
            name: this.state.name,
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

  create = async () => {
    if (this.state.name === "") {
      alert("Enter a name !");
      return;
    }

    try {
      const key = await firebase.database().ref("users").push().key;
      await firebase
        .database()
        .ref("users")
        .child(key)
        .set({ name: this.state.name });

      const gameID = await firebase.database().ref("game").push().key;
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
        .set({ name: this.state.name, userKey: key, ready: true });

      await firebase
        .database()
        .ref("gameMap")
        .child(code)
        .set({ name: this.state.name, userKey: key, gameID: gameID }, () =>
          this.props.navigation.navigate("StartGame", {
            name: this.state.name,
            userKey: key,
            admin: key,
            gameID: gameID,
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
            height: 100,
            borderBottomColor: "#000",
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Game</Text>
        </View>

        <View style={{ flex: 1, margin: 40 }}>
          <Text>Enter your name -</Text>
          <TextInput
            value={this.state.name}
            onChangeText={(text) => this.setState({ name: text })}
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#c4c4c4",
              marginVertical: 20,
            }}
          />

          <Text>Enter Game Code -</Text>
          <TextInput
            value={this.state.gameCode}
            onChangeText={(text) => this.setState({ gameCode: text })}
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#c4c4c4",
              marginVertical: 20,
            }}
          />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#452262",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={this.join}
            >
              <Text
                style={{ fontSize: 30, fontWeight: "normal", color: "#eee" }}
              >
                →
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            margin: 40,
          }}
        >
          <Text>Enter your name -</Text>
          <TextInput
            value={this.state.name}
            onChangeText={(text) => this.setState({ name: text })}
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#c4c4c4",
              marginVertical: 20,
            }}
          />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                width: 100,
                height: 50,
                borderRadius: 15,
                backgroundColor: "#377C1C",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={this.create}
            >
              <Text style={{ fontSize: 22, color: "#fff" }}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
