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
import { MaterialIndicator } from "react-native-indicators";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

export default class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      numberOfRounds: "",
      isLoading: false,
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

    this.setState({ isLoading: true });

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
          photo: this.state.user.photoURL || "",
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
      this.setState({ isLoading: false });
      alert("Problem in creating game");
    }
  };

  roundDisplay = (item, index) => {
    return (
      <TouchableOpacity
        style={[
          {
            borderRadius: 10,
            width: 70,
            height: 50,
            borderWidth: 0.5,
            borderColor: "#000",
            justifyContent: "center",
            alignItems: "center",
            margin: 10,
          },
          this.state.numberOfRounds === item
            ? { backgroundColor: "#B43480" }
            : { backgroundColor: "#C27AC0" },
        ]}
        onPress={() => this.setState({ numberOfRounds: item })}
      >
        <Text style={{ color: "#000", fontSize: 14, fontWeight: "bold" }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return this.state.isLoading ? (
      <View
        style={{
          flex: 1,
          backgroundColor: "#130B21",
          paddingTop: StatusBar.currentHeight,
        }}
      >
        <View
          style={{ flex: 3, alignItems: "center", justifyContent: "center" }}
        >
          <MaterialIndicator color={"#2e424d"} size={50} color={"#EC3D6C"} />
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 40,
            marginHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#EC3D6C", fontSize: 16, fontWeight: "bold" }}>
            We are creating your game
          </Text>
        </View>
      </View>
    ) : (
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
            height: 140,
            borderBottomWidth: 0.5,
            borderColor: "#EC3D6C",
          }}
        >
          <Text style={{ fontSize: 50, fontWeight: "bold", color: "#EC3D6C" }}>
            Create Game
          </Text>
        </View>

        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "normal", color: "#eee" }}>
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
            <Text
              style={{
                fontWeight: "normal",
                color: "#000",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
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
          <Text style={{ color: "#EC3D6C", fontSize: 16 }}>
            Already have a Game Code -{" "}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("JoinGame", {
                user: this.state.user,
              })
            }
          >
            <Text
              style={{ fontWeight: "bold", color: "#EC3D6C", fontSize: 16 }}
            >
              Join Game
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
