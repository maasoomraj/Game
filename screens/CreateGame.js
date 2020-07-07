import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  BackHandler,
  TouchableOpacity,
} from "react-native";

import { snapshotToArray } from "../helpers/snapshot";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

let code = "game";

export default class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
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

  create = async () => {
    try {
      //   const key = await firebase.database().ref("users").push().key;
      //   await firebase
      //     .database()
      //     .ref("users")
      //     .child(key)
      //     .set({ name: this.state.user.name });

      const key = this.state.user.key;

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
        .set({ name: this.state.user.name, userKey: key, ready: true });

      await firebase
        .database()
        .ref("gameMap")
        .child(code)
        .set({ name: this.state.user.name, userKey: key, gameID: gameID }, () =>
          this.props.navigation.navigate("StartGame", {
            name: this.state.user.name,
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
      <View
        style={{
          flex: 1,
          marginTop: StatusBar.currentHeight,
        }}
      >
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
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Create Game</Text>
        </View>

        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <TouchableOpacity
            onPress={this.create}
            style={{
              borderRadius: 13,
              width: 170,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              borderColor: "#000",
              borderWidth: 0.2,
            }}
          >
            <Text style={{ fontWeight: "normal", color: "#000", fontSize: 20 }}>
              Create Game
            </Text>
          </TouchableOpacity>
        </View>

        {/* Join Game */}
        <View
          style={{
            height: 50,
            marginBottom: 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text>Already have a Game Code - </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("JoinGame", {
                user: this.state.user,
              })
            }
          >
            <Text style={{ fontWeight: "bold" }}>Join Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
