import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  BackHandler,
} from "react-native";
import { MaterialIndicator } from "react-native-indicators";

import * as firebase from "firebase/app";
require("firebase/auth");
require("firebase/database");

let backPressed = 0;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );
  };

  handleBackButton() {
    if (backPressed > 0) {
      BackHandler.exitApp();
      backPressed = 0;
    } else {
      backPressed++;
      ToastAndroid.show("Press Again To Exit", ToastAndroid.SHORT);
      setTimeout(() => {
        backPressed = 0;
      }, 2000);
      return true;
    }
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
            Please wait..we are logging you in...
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
        <View style={{ flex: 1, marginVertical: 40 }}>
          <TextInput
            value={this.state.email}
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ email: text })}
            placeholder="Enter email address"
            placeholderTextColor="#EC3D6C"
            style={{
              color: "#000",
              fontSize: 18,
              height: 50,
              borderRadius: 10,
              marginHorizontal: 20,
              paddingHorizontal: 15,
              marginBottom: 20,
              borderBottomWidth: 0.5,
              borderColor: "#EC3D6C",
              color: "#EC3D6C",
            }}
          />
          <TextInput
            secureTextEntry
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
            placeholder="Enter your password"
            placeholderTextColor="#EC3D6C"
            style={{
              color: "#000",
              fontSize: 18,
              height: 50,
              borderRadius: 10,
              marginHorizontal: 20,
              paddingHorizontal: 15,
              marginBottom: 20,
              borderBottomWidth: 0.5,
              borderColor: "#EC3D6C",
              color: "#EC3D6C",
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
                backgroundColor: "#F0B342",
              }}
              onPress={this.login}
            >
              <Text style={{ fontWeight: "bold" }}>Login</Text>
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
          <Text style={{ color: "#eee", fontSize: 16 }}>
            Create an account -{" "}
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignUpScreen")}
          >
            <Text style={{ fontWeight: "bold", color: "#eee", fontSize: 16 }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
