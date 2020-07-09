import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { snapshotToArray } from "../helpers/snapshot";
import { codeGenerator } from "../helpers/CodeGenerator";
import { store } from "../helpers/redux-store";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

export default class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      numberOfRounds: "",
    };
  }

  componentDidMount = () => {
    // const { navigation } = this.props;
    // const user = navigation.getParam("user");
    const rounds = [5, 10, 15, 20];
    this.setState({ user: store.getState().user, rounds });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect", {
        user: store.getState().user,
      })
    );
  };

  create = async () => {
    if (!this.state.numberOfRounds) {
      alert("Select number of rounds");
      return;
    }

    try {
      let code = codeGenerator();

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
        .set({
          name: this.state.user.name,
          userKey: key,
          ready: true,
          answer: "",
          answered: false,
          point: 0,
          picked: false,
        });

      await firebase
        .database()
        .ref("game")
        .child(gameID)
        .child("gameStatus")
        .set({ start: false, counter: 0, rounds: this.state.numberOfRounds });

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
            gameCode: code,
          })
        );
    } catch (error) {
      alert(error);
    }
  };

  roundDisplay = (item, index) => {
    return this.state.numberOfRounds === item ? (
      <TouchableOpacity
        style={{
          borderRadius: 10,
          width: 70,
          height: 50,
          borderWidth: 0.5,
          borderColor: "#000",
          justifyContent: "center",
          alignItems: "center",
          margin: 10,
          backgroundColor: "#EBF1F5",
        }}
        onPress={() => this.setState({ numberOfRounds: item })}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={{
          borderRadius: 10,
          width: 70,
          height: 50,
          borderWidth: 0.5,
          borderColor: "#000",
          justifyContent: "center",
          alignItems: "center",
          margin: 10,
        }}
        onPress={() => this.setState({ numberOfRounds: item })}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    );
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
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 20, fontWeight: "normal" }}>
              Select number of rounds -{" "}
            </Text>
            <FlatList
              data={this.state.rounds}
              renderItem={({ item }, index) => this.roundDisplay(item, index)}
              keyExtractor={(item, index) => index.toString()}
              numColumns={4}
              contentContainerStyle={{ alignItems: "center" }}
            />
          </View>
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
              backgroundColor: "#F0B342",
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
