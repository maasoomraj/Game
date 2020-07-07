import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import * as firebase from "firebase/app";
require("firebase/auth");
require("firebase/database");

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  login = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);

        if (response) {
          this.props.navigation.navigate("LoadingScreen");
        }
      } catch (error) {
        this.setState({ isLoading: false });
        if (error.code == "auth/invalid-email") {
          alert("Enter valid email-address");
          return;
        }
        if (error.code == "auth/user-not-found") {
          alert("User doesnot exists. SignUp first");
          return;
        }
        if (
          error.message ==
          "The password is invalid or the user does not have a password."
        ) {
          alert("Password is wrong");
          return;
        }
        alert("Problem in signing user. Please try again.");
      }
    } else {
      alert("Enter email id and password");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <View style={{ flex: 1, marginVertical: 40 }}>
          <TextInput
            value={this.state.email}
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ email: text })}
            placeholder="Enter email address"
            style={{
              color: "#000",
              fontSize: 18,
              height: 50,
              borderRadius: 10,
              marginHorizontal: 20,
              paddingHorizontal: 15,
              marginBottom: 20,
              borderWidth: 0.2,
              borderColor: "#c4c4c4",
            }}
          />
          <TextInput
            secureTextEntry
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
            placeholder="Enter your password"
            style={{
              color: "#000",
              fontSize: 18,
              height: 50,
              borderRadius: 10,
              marginHorizontal: 20,
              paddingHorizontal: 15,
              marginBottom: 20,
              borderWidth: 0.2,
              borderColor: "#c4c4c4",
            }}
          />
          <View
            style={{
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: 100,
                height: 50,
                borderRadius: 13,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0.3,
                borderColor: "#000",
              }}
              onPress={this.login}
            >
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: 50,
            marginBottom: 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text>Create an account - </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignUpScreen")}
          >
            <Text style={{ fontWeight: "bold" }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
