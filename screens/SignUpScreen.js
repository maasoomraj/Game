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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  signUp = async () => {
    let name = this.state.name;
    if (
      this.state.email &&
      this.state.password &&
      this.state.name &&
      this.state.confirmPassword
    ) {
      if (!(this.state.password === this.state.confirmPassword)) {
        alert("Password doesnot matches.");
        return;
      }

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
            Please wait..we are signing you up..
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
            value={this.state.name}
            onChangeText={(text) => this.setState({ name: text })}
            placeholder="Enter Name"
            placeholderTextColor="#eee"
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
            value={this.state.email}
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ email: text })}
            placeholder="Enter email address"
            placeholderTextColor="#eee"
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
            placeholderTextColor="#eee"
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
            value={this.state.confirmPassword}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            placeholder="Confrim your password"
            placeholderTextColor="#eee"
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
              onPress={this.signUp}
            >
              <Text style={{ fontWeight: "bold" }}>Sign Up</Text>
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
            Already have an account -{" "}
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            <Text style={{ color: "#eee", fontSize: 16, fontWeight: "bold" }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
