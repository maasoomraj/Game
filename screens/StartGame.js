import React, { Component } from "react";
import {
  View,
  Text,
  BackHandler,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";

import { snapshotToArray } from "../helpers/snapshot";

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

    this.setState(
      {
        name,
        userKey,
        admin,
        gameID,
        players,
        playerID,
      },
      () => {
        this.receive();
        this.update();
        this.orderPlayers();
      }
    );

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect")
    );
  }

  // async componentWillUnmount() {
  //   try {
  //     await firebase.database().ref(`users`).child(this.state.userKey).remove();
  //   } catch (error) {
  //     alert("ERROR 3 " + error);
  //   }
  // }

  orderPlayers = () => {
    let array = [];
    let playersMap = new Map();
    for (let i in this.state.players) {
      if (!playersMap.has(this.state.players[i].userKey)) {
        array.push(this.state.players[i]);
        playersMap.set(this.state.players[i].userKey, 1);
      }
    }

    console.log("players ");
    console.log(playersMap);
    this.setState({ players: array });
  };

  receive = async () => {
    try {
      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("players")
        .on("child_added", (snapshot) => {
          this.setState({ players: [...this.state.players, snapshot.val()] });
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

  // sendMessage = async () => {
  //   try {
  //     const key = await firebase.database().ref("messages").push().key;
  //     await firebase
  //       .database()
  //       .ref("messages")
  //       .child(key)
  //       .set(
  //         {
  //           message: this.state.myMessage,
  //           name: this.state.name,
  //           userKey: this.state.userKey,
  //         },
  //         () => this.setState({ myMessage: "" })
  //       );
  //   } catch (error) {
  //     alert("ERROR 2 " + error);
  //   }
  // };

  // messageDisplay = (item, index) => {
  //   return item.userKey === this.state.userKey ? (
  //     <View
  //       style={{
  //         borderWidth: 0.4,
  //         borderColor: "#c4c4c4",
  //         minHeight: 50,
  //         paddingHorizontal: 20,
  //         paddingVertical: 10,
  //         marginLeft: 120,
  //         backgroundColor: "#C7F6B6",
  //         marginBottom: 20,
  //       }}
  //     >
  //       <Text style={{ color: "#000", fontSize: 14 }}>{item.message}</Text>
  //     </View>
  //   ) : (
  //     <View>
  //       <Text style={{ marginBottom: 3, fontSize: 12, fontWeight: "500" }}>
  //         {item.name}
  //       </Text>
  //       <View
  //         style={{
  //           borderWidth: 0.4,
  //           borderColor: "#c4c4c4",
  //           minHeight: 50,
  //           paddingHorizontal: 20,
  //           paddingVertical: 10,
  //           marginRight: 120,
  //           marginBottom: 20,
  //           backgroundColor: "#ADD8E6",
  //         }}
  //       >
  //         <Text style={{ color: "#000", fontSize: 14 }}>{item.message}</Text>
  //       </View>
  //     </View>
  //   );
  // };

  playerDisplay = (item, index) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text>{item.name}</Text>
        {item.ready ? (
          <Text
            style={{
              color: "#6AC955",
              borderColor: "#000",
              borderWidth: 0.1,
              fontWeight: "bold",
            }}
          >
            ✓
          </Text>
        ) : null}
      </View>
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
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {" "}
            Let's Chat !
          </Text>
        </View>

        <View style={{ flex: 1, margin: 20 }}>
          <FlatList
            data={this.state.players}
            renderItem={({ item }, index) => this.playerDisplay(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={this.toggleReady}
              style={{
                borderRadius: 20,
                width: 100,
                height: 50,
                backgroundColor: "#F0B342",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                {this.state.ready ? "Cancel" : "Ready"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View
          style={{
            margin: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            value={this.state.myMessage}
            onChangeText={(text) => this.setState({ myMessage: text })}
            style={{
              height: 50,
              width: Dimensions.get("window").width - 80,
              borderColor: "#c4c4c4",
              borderWidth: 0.5,
              borderRadius: 15,
              paddingHorizontal: 10,
            }}
          />
          <TouchableOpacity
            style={{
              width: 45,
              height: 45,
              borderRadius: 25,
              backgroundColor: "#377C1C",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
            onPress={this.sendMessage}
          >
            <Text style={{ fontSize: 20 }}>→</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}
