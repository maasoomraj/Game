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
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { store, SET_USER } from "../helpers/redux-store";
// import prepareBlob from "../helpers/ImageHelpers";

import * as firebase from "firebase/app";
import("firebase/database");
import("firebase/auth");
import("firebase/storage");

export default class EditDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      changeUsername: false,
      username: "",
      isLoading: false,
      image: "",
    };
  }

  componentDidMount = () => {
    // console.log(store.getState().user);
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
            photoURL: user.photoURL,
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

  chooseImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    this.pickImage();
    //
  };

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri, isLoading: true });
        this.uploadImage(result.uri);
      }
    } catch (error) {
      alert("Problem Loading Page");
    }
  };

  prepareBlob = async (imageUri) => {
    let blob = await new Promise((resolve, reject) => {
      // new request
      const xml = new XMLHttpRequest();

      // On success, resolve it
      xml.onload = function () {
        resolve(xml.response);
      };

      // On error, throw error
      xml.onerror = function (error) {
        // console.log(error);
        reject(new TypeError("Image Upload Failed"));
      };

      // set the response type
      xml.responseType = "blob";
      // get the blob
      xml.open("GET", imageUri, true);
      // send the blob
      xml.send();
    });
    return blob;
  };

  uploadImage = async (uri) => {
    try {
      const blob = await this.prepareBlob(uri);
      const snapshot = await firebase
        .storage()
        .ref("images")
        .child(this.state.user.key)
        .put(blob);

      let URL = await firebase
        .storage()
        .ref("images")
        .child(this.state.user.key)
        .getDownloadURL();

      const user = await firebase.auth().currentUser;
      await user.updateProfile({
        photoURL: URL,
      });

      store.dispatch(
        SET_USER({
          name: user.providerData[0].displayName,
          key: user.uid,
          email: user.providerData[0].email,
          photoURL: user.photoURL,
        })
      );
      this.setState({
        user: store.getState().user,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      alert("Please try again");
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
            Saving your changes...
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
        {/* Edit Deatils */}

        <View style={{ flex: 1, marginTop: 20 }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                width: 100,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!this.state.user.photoURL ? (
                <Image
                  source={require("../assets/icons8-male-user-96.png")}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              ) : (
                <Image
                  source={{ uri: this.state.user.photoURL }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              )}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "#aaa",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={this.chooseImage}
              >
                <Image
                  source={require("../assets/edit1.png")}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {this.state.changeUsername ? (
            <View
              style={{ minHeight: 30, flexDirection: "row", marginTop: 50 }}
            >
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
            <View
              style={{ minHeight: 30, flexDirection: "row", marginTop: 50 }}
            >
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
                    fontSize: 24,
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

          {/* Password */}
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 250,
                minHeight: 50,
                marginTop: 40,
                backgroundColor: "#F0B342",
                borderRadius: 30,
              }}
              onPress={() => this.props.navigation.navigate("ChangePassword")}
            >

              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  fontFamily: "sans-serif-light",
                  letterSpacing: 0.2,
                  color: "#000",
                }}
              >
                Change Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
