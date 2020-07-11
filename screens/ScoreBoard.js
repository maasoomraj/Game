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

export default class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchEnded: false,
      maxValue: 0,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const players = navigation.getParam("players");
    const gameID = navigation.getParam("gameID");
    const playerID = navigation.getParam("playerID");
    const admin = navigation.getParam("admin");
    console.log("LEADERBOARD");
    console.log(store.getState().user);
    console.log("admin");
    console.log(admin);

    this.setState(
      {
        admin,
        players,
        user: store.getState().user,
        gameID,
        playerID,
      },
      () => {
        this.getCounter();
        this.changesMade();
        this.makeChanges();
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

  getCounter = async () => {
    try {
      const gameStatus = await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("gameStatus")
        .once("value");

      console.log(gameStatus.val());
      console.log(gameStatus.val().counter);
      console.log(gameStatus.val().rounds);
      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("gameStatus")
        .update({ counter: gameStatus.val().counter + 1 });
      if (gameStatus.val().counter + 1 === gameStatus.val().rounds) {
        console.log("FINAL");
        setTimeout(() => {
          this.props.navigation.navigate("FinalLeaderBoard", {
            admin: this.state.admin,
            gameID: this.state.gameID,
            players: this.state.players,
            playerID: this.state.playerID,
          });
        }, 5000);
      } else {
        console.log("CONTINUE ROUNDS");
        setTimeout(() => {
          this.props.navigation.navigate("GameScreen", {
            admin: this.state.admin,
            gameID: this.state.gameID,
            players: this.state.players,
            playerID: this.state.playerID,
          });
        }, 5000);
      }
    } catch (error) {
      alert(error);
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
          this.setState({
            players: players,
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  makeChanges = async () => {
    try {
      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("players")
        .child(this.state.playerID)
        .update({
          picked: false,
          answer: "",
          answered: false,
        });
    } catch (error) {
      alert(error);
    }
  };

  maxValue = 0;

  playerDisplay = (item, index) => {
    let winner = 0;
    let image = 0;
    if (index === 0) {
      winner = 1;
      this.maxValue = item.point;
    }

    if (index) {
      if (item.point === this.maxValue) {
        winner = 1;
      }
    }

    console.log(winner + " " + index);
    return (
      // <TouchableOpacity onPress={() => this.submit(item)}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          margin: 10,
          borderColor: "#000",
          borderWidth: 0.4,
          minHeight: 50,
          backgroundColor: "#ADD8E6",
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
        <View
          style={{
            flex: 1,
            marginLeft: 25,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
          <Text style={{ fontSize: 14, fontStyle: "italic" }}>
            {" "}
            - {item.point} points
          </Text>
        </View>
        {winner ? (
          <View
            style={{
              width: 50,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <Image
              source={require("../assets/winner.png")}
              style={{ width: 40, height: 40 }}
            />
          </View>
        ) : null}
      </View>
      // </TouchableOpacity>
    );
  };

  compare(a, b) {
    if (a.point < b.point) return 1;
    if (b.point < a.point) return -1;

    return 0;
  }

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
            LeaderBoard
          </Text>
        </View>
        {this.state.players && this.state.players.length > 1 && (
          <FlatList
            data={this.state.players.sort(this.compare)}
            renderItem={({ item, index }) => this.playerDisplay(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

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
            Please Wait...we are processing !
          </Text>
        </View>
      </View>
    );
  }
}
