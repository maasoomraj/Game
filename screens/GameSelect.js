import React, { Component } from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";

import * as firebase from "firebase/app";
require("firebase/auth");
require("firebase/database");

import { store } from "../helpers/redux-store";

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
    };
  }

  componentDidMount = () => {
    // const { navigation } = this.props;
    // const user = navigation.getParam("user");
    this.setState({ user: store.getState().user });
  };

  logout = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("LoadingScreen");
    } catch (error) {
      alert("Unable to Logout right now.");
    }
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
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Game</Text>
          <Text
            style={{ fontSize: 14, fontWeight: "500", fontStyle: "italic" }}
          >
            {this.state.user.name}
          </Text>
        </View>

        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("JoinGame", {
                user: this.state.user,
              })
            }
            style={{
              borderRadius: 13,
              width: 170,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              borderColor: "#000",
              borderWidth: 0.2,
            }}
          >
            <Text style={{ fontWeight: "normal", color: "#000", fontSize: 20 }}>
              Join Game
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("CreateGame", {
                user: this.state.user,
              })
            }
            style={{
              borderRadius: 13,
              width: 170,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              borderColor: "#000",
              borderWidth: 0.2,
            }}
          >
            <Text style={{ fontWeight: "normal", color: "#000", fontSize: 20 }}>
              Create Game
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.logout}
            style={{
              borderRadius: 13,
              width: 170,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#000",
              borderWidth: 0.2,
            }}
          >
            <Text style={{ fontWeight: "normal", color: "#000", fontSize: 20 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={{ color: "#000" }}>{this.state.user.name}</Text> */}
      </View>
    );
  }
}
