import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  BackHandler,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { MaterialIndicator } from "react-native-indicators";
import { store } from "../helpers/redux-store";

import * as firebase from "firebase/app";
import("firebase/database");
import("firebase/auth");
import("firebase/storage");

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      password: "",
      newPassword1: "",
      newPassword2: "",
      isLoading: false,
    };
  }

  componentDidMount = () => {
    this.setState({ user: store.getState().user });
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("EditDetails")
    );
  };

  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };

  changePassword = (currentPassword, newPassword, newPass2) => {
    if (!(currentPassword && newPass2, newPassword)) {
      alert("Enter all the fields.");
      return;
    }
    if (newPassword !== newPass2) {
      alert("Password doesnot matches.");
      return;
    }

    this.setState({ isLoading: true });
    this.reauthenticate(currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            alert("Password updated!");
            this.props.navigation.navigate("EditDetails");
          })
          .catch((error) => {
            this.setState({ isLoading: false });

            alert(error.message);
          });
      })
      .catch((error) => {
        this.setState({ isLoading: false });

        alert(error.message);
      });
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
            Updating your details..
          </Text>
        </View>
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: "#130B21",
          paddingTop: StatusBar.currentHeight,
        }}
      >
        <View
          style={{
            margin: 10,
            justifyContent: "center",
            alignItems: "center",
            height: 140,
            borderBottomWidth: 0.5,
            borderColor: "#EC3D6C",
          }}
        >
          <Text style={{ fontSize: 50, fontWeight: "bold", color: "#EC3D6C" }}>
            Edit Details
          </Text>
        </View>

        <View style={{ flex: 1, marginVertical: 40 }}>
          <TextInput
            secureTextEntry
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
            placeholder="Enter current password"
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
            value={this.state.newPassword1}
            onChangeText={(text) => this.setState({ newPassword1: text })}
            placeholder="Enter new password"
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
            value={this.state.newPassword2}
            onChangeText={(text) => this.setState({ newPassword2: text })}
            placeholder="Confirm new password"
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
              onPress={() =>
                this.changePassword(
                  this.state.password,
                  this.state.newPassword1,
                  this.state.newPassword2
                )
              }
            >
              <Text style={{ fontWeight: "bold" }}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
