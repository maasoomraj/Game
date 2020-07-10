import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Dimensions,
} from "react-native";

import { snapshotToArray } from "../helpers/snapshot";
import { store } from "../helpers/redux-store";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIndicator } from "react-native-indicators";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

export default class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      gameCode: "",
      backPress: false,
      isLoading: false,
      connectionStatus: "",
    };
  }

  componentDidMount = () => {
    // const { navigation } = this.props;
    // const user = navigation.getParam("user");
    this.setState({ user: store.getState().user });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect")
    );
  };

  join = async () => {
    if (this.state.gameCode === "") {
      alert("Enter the Code !");
      return;
    }

    this.setState({
      connectionStatus: "We are checking the game code...",
      isLoading: true,
    });

    try {
      const gameDetails = await firebase
        .database()
        .ref("gameMap")
        .child(this.state.gameCode)
        .once("value");

      if (gameDetails.val() === null) {
        this.setState({ isLoading: false });
        alert("Game Code is wrong.");
        return;
      }

      this.setState({ connectionStatus: "Checking the game status..." });

      const status = await firebase
        .database()
        .ref("game")
        .child(gameDetails.val().gameID)
        .child("gameStatus")
        .once("value");

      if (status.val().start) {
        this.setState({ isLoading: false });
        alert("Game has already started.\nCannot enter between ongoing game");
        return;
      }

      this.setState({
        connectionStatus: "We are connecting you to the game...",
      });

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
      let playersMap = new Map();
      for (let i in players) {
        playersMap.set(players[i].userKey, players[i]);
      }

      console.log(players);
      console.log("MAP");
      console.log(playersMap);
      console.log(this.state.user.key);

      let playerID;
      if (!playersMap.has(key)) {
        players.push({
          name: this.state.user.name,
          userKey: key,
          ready: false,
          answer: "",
          answered: false,
          point: 0,
          picked: false,
        });
        playerID = await firebase
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
            ready: false,
            answer: "",
            answered: false,
            point: 0,
            picked: false,
            photo: this.state.user.photoURL || "",
          });
      } else {
        playerID = playersMap.get(this.state.user.key).key;
      }

      this.props.navigation.navigate("StartGame", {
        name: this.state.user.name,
        userKey: key,
        admin: admin,
        gameID: gameID,
        players: players,
        playerID,
        gameCode: this.state.gameCode,
      });
    } catch (error) {
      this.setState({ isLoading: false });
      alert(error);
    }
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
            {this.state.connectionStatus}
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
            Join Game
          </Text>
        </View>

        <View style={{ flex: 1, margin: 40 }}>
          {/* TextInput */}

          <TextInput
            placeholder="Enter Game Code"
            placeholderTextColor="#eee"
            value={this.state.gameCode}
            onChangeText={(text) => this.setState({ gameCode: text })}
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#c4c4c4",
              marginVertical: 20,
              paddingLeft: 20,
              height: 50,
              fontSize: 20,
              color: "#eee",
            }}
          />

          {/* Join Button */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <LinearGradient
              colors={["#F0B342", "#F0B342"]}
              // colors={["#7E1A20", "#7E1A20", "#9F2325", "#B5292A", "#C52E2B"]}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 100,
                height: 50,
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={this.join}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "normal", color: "#000" }}
                >
                  Join
                </Text>
              </TouchableOpacity>
            </LinearGradient>
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
          <Text style={{ color: "#EC3D6C", fontSize: 16 }}>
            Donot have a Game Code -{" "}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("CreateGame", {
                user: this.state.user,
              })
            }
          >
            <Text
              style={{ fontWeight: "bold", color: "#EC3D6C", fontSize: 16 }}
            >
              Create Game
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
