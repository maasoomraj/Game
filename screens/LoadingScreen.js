import React, { Component } from "react";
import { View, Text, StatusBar, YellowBox } from "react-native";
import { MaterialIndicator } from "react-native-indicators";

import * as firebase from "firebase/app";
import("firebase/database");
import("firebase/auth");

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

  //   setUser = async (user) => {
  //     const userFromDB = await firebase
  //       .database()
  //       .ref("users")
  //       .child(user.uid)
  //       .once("value");
  //     this.setState({ user: userFromDB.val() });
  //     console.log(userFromDB);
  //   };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MaterialIndicator color={"#2e424d"} />
        </View>
      </View>
    );
  }
}
