import React, { Component } from "react";
import {
  View,
  Text,
  BackHandler,
  TextInput,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";

import { store } from "../helpers/redux-store";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

let backPressed = 0;

export default class ChooseAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picked: false,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const players = navigation.getParam("players");
    const gameID = navigation.getParam("gameID");
    const playerID = navigation.getParam("playerID");
    const admin = navigation.getParam("admin");

    let shuffledPlayers = players.sort(() => Math.random() - 0.5);

    this.setState(
      {
        admin,
        players,
        shuffledPlayers,
        user: store.getState().user,
        gameID,
        playerID,
      },
      () => {
        this.changesMade();
        this.allPicked();
      }
    );

    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );
  };

  handleBackButton() {
    if (backPressed > 0) {
      this.props.navigation.navigate("GameSelect");
      backPressed = 0;
    } else {
      backPressed++;
      ToastAndroid.show("Press Again To Exit the Game", ToastAndroid.SHORT);
      setTimeout(() => {
        backPressed = 0;
      }, 2000);
      return true;
    }
  }

  allPicked = () => {
    let numberOfPicked = 0;
    for (let i in this.state.players) {
      if (this.state.players[i].picked === true) {
        numberOfPicked += 1;
      }
    }
    if (numberOfPicked === this.state.players.length) {
      this.props.navigation.navigate("LeaderBoard", {
        players: this.state.players,
        gameID: this.state.gameID,
        playerID: this.state.playerID,
        admin: this.state.admin,
      });
    }
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
          this.setState(
            {
              players: players,
            },
            () => this.allPicked()
          );
        });
    } catch (error) {
      alert(error);
    }
  };

  playerDisplay = (item, index) => {
    if (item.userKey !== this.state.user.key) {
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
              backgroundColor: "#C27AC0",
              borderRadius: 30,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  paddingHorizontal: 10,
                }}
              >
                {item.answer}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  submit = async (item) => {
    try {
      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("players")
        .child(this.state.playerID)
        .update({ picked: true });

      const player = await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("players")
        .orderByChild("userKey")
        .equalTo(item.userKey)
        .once("value");

      let keys;
      for (var k in player.val()) {
        keys = k;
      }

      console.log(player.val()[keys].point);

      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("players")
        .child(keys)
        .update({ point: player.val()[keys].point + 1 });

      this.setState({ picked: true });
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return this.state.picked ? (
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          backgroundColor: "#130B21",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#EC3D6C",
            paddingHorizontal: 10,
          }}
        >
          Wait for other players to choose their answer
        </Text>
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
            minHeight: 100,
            borderBottomWidth: 0.5,
            borderColor: "#EC3D6C",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#EC3D6C",
              paddingHorizontal: 10,
            }}
          >
            Pick an answer -
          </Text>
        </View>
        <FlatList
          data={this.state.shuffledPlayers}
          renderItem={({ item }, index) => this.playerDisplay(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
