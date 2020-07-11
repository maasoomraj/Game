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
  Image,
} from "react-native";

import { store } from "../helpers/redux-store";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

let backPressed = 0;

export default class AnswerState extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const players = navigation.getParam("players");
    const gameID = navigation.getParam("gameID");
    const playersAnswered = navigation.getParam("playersAnswered");
    const playerID = navigation.getParam("playerID");
    const admin = navigation.getParam("admin");

    console.log(store.getState().user);
    console.log("admin");
    console.log(admin);

    this.setState(
      {
        admin,
        players,
        user: store.getState().user,
        gameID,
        playersAnswered,
        playerID,
      },
      () => {
        this.changesMade();
        this.allAnswered();
      }
    );

    console.log(playersAnswered);

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

  changesMade = async () => {
    try {
      console.log(this.state.gameID);
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
              playersAnswered: this.state.playersAnswered + 1,
            },
            () => this.allAnswered()
          );
        });
    } catch (error) {
      alert(error);
    }
  };

  allAnswered = () => {
    let numberOfAnswers = 0;
    for (let i in this.state.players) {
      if (this.state.players[i].answered === true) {
        numberOfAnswers += 1;
      }
    }

    console.log(this.state.user.name);
    console.log(numberOfAnswers);
    if (numberOfAnswers === this.state.players.length) {
      this.props.navigation.navigate("ChooseAnswer", {
        players: this.state.players,
        gameID: this.state.gameID,
        playerID: this.state.playerID,
        admin: this.state.admin,
      });
    }
  };

  playerDisplay = (item, index) => {
    let image = 0;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          margin: 10,
          borderColor: "#000",
          borderWidth: 0.4,
          height: 50,
          backgroundColor: "#C27AC0",
          borderRadius: 30,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
          }}
        >
          {item.userKey === this.state.user.key && this.state.user.photoURL
            ? (image = 1 && (
                <Image
                  source={{ uri: this.state.user.photoURL }}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                  }}
                />
              ))
            : null}

          {item.userKey === this.state.user.key && !this.state.user.photoURL
            ? (image = 1 && (
                <Image
                  source={require("../assets/icons8-male-user-96.png")}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                  }}
                />
              ))
            : null}

          {!item.photo && !image
            ? (image = 1 && (
                <Image
                  source={require("../assets/icons8-male-user-96.png")}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                  }}
                />
              ))
            : null}
          {item.photo && !image
            ? (image = 1 && (
                <Image
                  source={{ uri: item.photo }}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                  }}
                />
              ))
            : null}
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ paddingLeft: 30, fontWeight: "bold", fontSize: 20 }}>
            {item.name}
          </Text>
        </View>
        <View
          style={{
            width: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {item.answered ? "✓" : "⨯"}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    return (
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
            Waiting for others to write the answer
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
