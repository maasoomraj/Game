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
      name: "",
      email: "",
      password: "",
      isLoading: false,
    };
  }

  signUp = async () => {
    let name = this.state.name;
    if (this.state.email && this.state.password && this.state.name) {
      this.setState({ isLoading: true });
      try {
        let response = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );

        if (response) {
          console.log(name);
          await firebase
            .auth()
            .currentUser.updateProfile({ displayName: name });
          this.props.navigation.navigate("LoadingScreen");
        }
      } catch (error) {
        this.setState({ isLoading: false });
        console.log(error);
        if (error.code == "auth/email-already-in-use") {
          alert("User already exists. Try logging in");
          return;
        }
        if (error.message == "Password should be at least 6 characters") {
          alert("Password must be atleast 6 characters long");
          return;
        }
        if (error.code == "auth/invalid-email") {
          alert("Enter a valid email address");
          return;
        }
        // alert("Problem in signing user. Please try again.");
        alert(error);
      }
    } else {
      alert("Enter details to signup");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <View style={{ flex: 1, marginVertical: 40 }}>
          <TextInput
            value={this.state.name}
            onChangeText={(text) => this.setState({ name: text })}
            placeholder="Enter Name"
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
              onPress={this.signUp}
            >
              <Text>Sign Up</Text>
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
          <Text>Already have an account - </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            <Text style={{ fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
