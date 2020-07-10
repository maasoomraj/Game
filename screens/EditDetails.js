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

import { store, SET_USER } from "../helpers/redux-store";

import * as firebase from "firebase/app";
import("firebase/database");
import("firebase/auth");

export default class EditDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      changeUsername: false,
      username: "",
      isLoading: false,
    };
  }

  componentDidMount = () => {
    this.setState({ user: store.getState().user });
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect")
    );
  };

  change = async () => {
    if (this.state.username) {
      this.setState({ isLoading: true });
      try {
        const user = await firebase.auth().currentUser;

        await user.updateProfile({ displayName: this.state.username });

        store.dispatch(
          SET_USER({
            name: user.providerData[0].displayName,
            key: user.uid,
            email: user.providerData[0].email,
          })
        );
        this.setState({
          changeUsername: false,
          username: "",
          user: store.getState().user,
          isLoading: false,
        });
      } catch (error) {
        this.setState({ isLoading: false });
        alert("Please try again");
      }
    } else {
      alert("Enter username");
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
            Saving your changes
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
        {/* Edit Deatils */}
        <View
          style={{
            margin: 20,
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
        {/* Edit Deatils */}

        <View style={{ flex: 1, marginTop: 20 }}>
          <View style={{ height: 50 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "400",
                letterSpacing: 0.2,
                color: "#84B168",
                paddingHorizontal: 30,
              }}
            >
              Username :
            </Text>
          </View>
          {this.state.changeUsername ? (
            <View style={{ minHeight: 50, flexDirection: "row" }}>
              {/* TextInput */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingHorizontal: 20,
                }}
              >
                <TextInput
                  value={this.state.username}
                  onChangeText={(text) => this.setState({ username: text })}
                  placeholder="Enter new username"
                  placeholderTextColor="#eee"
                  style={{
                    fontSize: 18,
                    fontWeight: "300",
                    color: "#EC3D6C",
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#EC3D6C",
                    paddingHorizontal: 20,
                  }}
                />
              </View>

              {/* Correct Button */}
              <View
                style={{
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={this.change}>
                  <Image
                    source={require("../assets/correct.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <View
                style={{
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ changeUsername: false })}
                >
                  <Image
                    source={require("../assets/cancel.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ minHeight: 50, flexDirection: "row" }}>
              {/* Display Name */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    letterSpacing: 0.2,
                    color: "#F0B342",
                  }}
                >
                  {this.state.user.name}
                </Text>
              </View>

              {/* Change Username Button */}
              <View
                style={{
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ changeUsername: true })}
                >
                  <Image
                    source={require("../assets/edit.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
