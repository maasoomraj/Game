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
import { MaterialIndicator } from "react-native-indicators";

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
      isLoading: false,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const players = navigation.getParam("players");
    const gameID = navigation.getParam("gameID");
    const playerID = navigation.getParam("playerID");
    const admin = navigation.getParam("admin");
    // console.log("LEADERBOARD");
    // console.log(store.getState().user);
    // console.log("admin");
    // console.log(admin);

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
        // this.makeChanges();
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

      await firebase
        .database()
        .ref("game")
        .child(this.state.gameID)
        .child("gameStatus")
        .update({ counter: gameStatus.val().counter + 1 });
      if (gameStatus.val().counter + 1 === gameStatus.val().rounds) {
        setTimeout(() => {
          this.props.navigation.navigate("LeaderBoard", {
            admin: this.state.admin,
            gameID: this.state.gameID,
            players: this.state.players,
            playerID: this.state.playerID,
          });
        }, 7000);
      } else {
        setTimeout(async () => {
          try {
            this.setState({ isLoading: true });
            await firebase
              .database()
              .ref("game")
              .child(this.state.gameID)
              .child("players")
              .child(this.state.playerID)
              .update(
                {
                  score: 0,
                  picked: false,
                  answer: "",
                  answered: false,
                },
                () => {
                  this.props.navigation.navigate("GameScreen", {
                    admin: this.state.admin,
                    gameID: this.state.gameID,
                    players: this.state.players,
                    playerID: this.state.playerID,
                  });
                }
              );
          } catch (error) {
            alert("Problem Loading Page");
          }
        }, 7000);
      }
    } catch (error) {
      alert("Problem Loading Page");
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
      alert("Problem Loading Page");
    }
  };

  //   makeChanges = async () => {
  //     try {
  //       await firebase
  //         .database()
  //         .ref("game")
  //         .child(this.state.gameID)
  //         .child("players")
  //         .child(this.state.playerID)
  //         .update({
  //           picked: false,
  //           answer: "",
  //           answered: false,
  //         });
  //     } catch (error) {
  //       alert(error);
  //     }
  //   };

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
          minHeight: 50,
          backgroundColor: "#EFB8BD",
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
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {item.name} + {item.score}
          </Text>
          <Text style={{ fontSize: 16, fontStyle: "italic" }}>
            {"  "}= {item.point} points
          </Text>
        </View>
      </View>
    );
  };

  compare(a, b) {
    if (a.point < b.point) return 1;
    if (b.point < a.point) return -1;

    return 0;
  }

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
            We are making new question for you ..
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
            ScoreBoard
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
            You will directed to new question ...
          </Text>
        </View>
      </View>
    );
  }
}
