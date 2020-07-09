import React, { Component } from "react";
import { View, Text, StatusBar, YellowBox } from "react-native";
import { MaterialIndicator } from "react-native-indicators";

import * as firebase from "firebase/app";
import("firebase/database");
import("firebase/auth");

import { SET_USER, store } from "../helpers/redux-store";

export default class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  componentDidMount = () => {
    YellowBox.ignoreWarnings(["Setting a timer"]);

    this.checkIfLoggedIn();
  };

  checkIfLoggedIn = async () => {
    this.unsubscribe = await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.dispatch(
          SET_USER({
            name: user.providerData[0].displayName,
            key: user.uid,
            email: user.providerData[0].email,
          })
        );
        this.props.navigation.navigate("GameSelect", {
          user: {
            name: user.providerData[0].displayName,
            key: user.uid,
            email: user.providerData[0].email,
          },
        });
      } else {
        this.props.navigation.navigate("SignUpScreen");
      }
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#130B21",
          paddingTop: StatusBar.currentHeight,
        }}
      >
        <View style={{ flex: 1 }}>
          <MaterialIndicator color={"#2e424d"} size={50} color={"#EC3D6C"} />
        </View>
      </View>
    );
  }
}
