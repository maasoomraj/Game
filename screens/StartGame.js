import React, { Component } from "react";
import {
  View,
  Text,
  BackHandler,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";

import { snapshotToArray } from "../helpers/snapshot";
import { store } from "../helpers/redux-store";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

export default class StartGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      userKey: "",
      admin: "",
      gameID: "",
      players: [],
      ready: false,
      playersLoaded: false,
      start: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const name = navigation.getParam("name");
    const userKey = navigation.getParam("userKey");
    const admin = navigation.getParam("admin");
    const gameID = navigation.getParam("gameID");
    const playerID = navigation.getParam("playerID");
    const players = navigation.getParam("players") || [];
    const gameCode = navigation.getParam("gameCode");
    let playersMap = new Map();
    for (let i in players) {
      playersMap.set(players[i].userKey, players[i]);
    }

    console.log(admin);
    console.log(userKey);

    this.setState(
      {
        name,
        userKey,
        admin,
        gameID,
        players,
        playerID,
        playersMap,
        playersLoaded: true,
        gameCode,
        user: store.getState().user,
      },
      () => {
        this.receive();
        this.update();
        this.startGame();
      }
    );

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect")
    );
  }

  startGame = async () => {
    await firebase
      .database()
      .ref("game")
      .child(this.state.gameID)
      .child("gameStatus")
      .on("child_changed", (snapshot) => {
        this.setState({ start: snapshot.val() });
        // console.log("CHANged");
        // console.log(snapshot.val());
      });
  };

  // async componentWillUnmount() {
  //   try {
  //     await firebase.database().ref(`users`).child(this.state.userKey).remove();
  //   } catch (error) {
  //     alert("ERROR 3 " + error);
  //   }
  // }

  receive = async () => {
    try {
      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("players")
        .on("child_added", (snapshot) => {
          if (!this.state.playersMap.has(snapshot.val().userKey)) {
            let newPlayersMap = this.state.playersMap;
            newPlayersMap.set(snapshot.val().userKey, snapshot.val());
            this.setState({
              players: [...this.state.players, snapshot.val()],
              playersMap: newPlayersMap,
            });
          }
        });
    } catch (error) {
      alert("ERROR 1 " + error);
    }
  };

  update = async () => {
    try {
      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("players")
        .on("child_changed", (snapshot) => {
          let playersList = this.state.players;
          for (let i in playersList) {
            if (playersList[i].userKey === snapshot.val().userKey) {
              playersList[i].ready = snapshot.val().ready;
            }
          }
          this.setState({ players: playersList });
        });
    } catch (error) {
      alert("ERROR 2 " + error);
    }
  };

  toggleReady = async () => {
    try {
      if (this.state.ready) {
        await firebase
          .database()
          .ref("game")
          .child(this.state.gameID)
          .child("players")
          .child(this.state.playerID)
          .update(
            {
              ready: false,
            },
            () => {
              this.setState({ ready: false });
            }
          );
      } else {
        await firebase
          .database()
          .ref("game")
          .child(this.state.gameID)
          .child("players")
          .child(this.state.playerID)
          .update(
            {
              ready: true,
            },
            () => {
              this.setState({ ready: true });
            }
          );
      }
    } catch (error) {
      alert("ERROR 3 " + error);
    }
  };

  start = async () => {
    let status = true;
    for (let i in this.state.players) {
      if (this.state.players[i].ready === false) {
        status = false;
        break;
      }
    }

    if (!status) {
      alert("All Players are not ready.");
      return;
    }
    try {
      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("gameStatus")
        .update({ start: true });
    } catch (error) {
      alert("ERROR 2 " + error);
    }
  };

  playerDisplay = (item, index) => {
    return (
      <View
        style={{
          width: 120,
          height: 100,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Image
          source={require("../assets/icons8-male-user-96.png")}
          style={{ width: 90, height: 90 }}
        />
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Text>{item.name}</Text>

          {item.ready ? (
            <Text
              style={{
                color: "#6AC955",
                borderColor: "#000",
                borderWidth: 0.1,
                fontWeight: "bold",
                marginHorizontal: 10,
              }}
            >
              ✓
            </Text>
          ) : (
            <Text></Text>
          )}
        </View>
      </View>
    );
  };

  render() {
    return (
      this.state.playersLoaded && (
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
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              Game Code - "{this.state.gameCode}"
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: "500", fontStyle: "italic" }}
            >
              Share with your friends.
            </Text>
          </View>

          <View style={{ flex: 1, margin: 20 }}>
            <FlatList
              data={this.state.players}
              renderItem={({ item }, index) => this.playerDisplay(item, index)}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              contentContainerStyle={{ alignItems: "center" }}
            />

            {/* // */}
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                onPress={
                  this.state.userKey === this.state.admin
                    ? this.start
                    : this.toggleReady
                }
                style={{
                  borderRadius: 20,
                  width: 100,
                  height: 50,
                  backgroundColor: "#F0B342",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                {this.state.userKey === this.state.admin ? (
                  <Text style={{ fontSize: 18, fontWeight: "700" }}>Start</Text>
                ) : (
                  <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    {this.state.ready ? "Cancel" : "Ready"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {/* // */}
            {this.state.start
              ? this.props.navigation.navigate("GameScreen", {
                  admin: this.state.admin,
                  gameID: this.state.gameID,
                  players: this.state.players,
                  playerID: this.state.playerID,
                })
              : null}
          </View>
        </View>
      )
    );
  }
}
