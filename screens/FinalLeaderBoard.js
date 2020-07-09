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

export default class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchEnded: false,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const players = navigation.getParam("players");
    const gameID = navigation.getParam("gameID");
    const playerID = navigation.getParam("playerID");
    const admin = navigation.getParam("admin");

    this.setState(
      {
        admin,
        players,
        user: store.getState().user,
        gameID,
        playerID,
      },
      () => {
        this.changesMade();
      }
    );

    setTimeout(() => {
      this.props.navigation.navigate("GameSelect");
    }, 5000);
  };

  changesMade = async () => {
    try {
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
            players: players,
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  playerDisplay = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this.submit(item)}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            margin: 10,
            borderColor: "#000",
            borderWidth: 0.4,
            minHeight: 50,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>
              {item.name} - {item.point}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
            backgroundColor: "#F08383",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "500", padding: 20 }}>
            Final LeaderBoard
          </Text>
        </View>
        <FlatList
          data={this.state.players}
          renderItem={({ item }, index) => this.playerDisplay(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
