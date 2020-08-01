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

export default class UploadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      image: "",
      URL:'',
      array:[],
      name : ''
    };
  }

  componentDidMount = () => {
    this.setState({ user: store.getState().user });
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect")
    );
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
        .ref("bollywood")
        .child(this.state.name)
        .put(blob);

      let URL = await firebase
        .storage()
        .ref("bollywood")
        .child(this.state.name)
        .getDownloadURL();

    let array = this.state.array;
    array.push(this.state.name, URL);
    console.log("HERE");
    console.log(array);

      this.setState({
        array : array,
        URL : URL,
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
            Add Photo
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
              {!this.state.URL ? (
                <Image
                  source={require("../assets/icons8-male-user-96.png")}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              ) : (
                <Image
                  source={{ uri: this.state.URL }}
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

          <TextInput
            placeholder="Enter File Name"
            placeholderTextColor="#eee"
            value={this.state.name}
            onChangeText={(text) => this.setState({ name: text })}
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#c4c4c4",
              marginVertical: 20,
              paddingLeft: 20,
              height: 50,
              fontSize: 20,
              color: "#eee",
            }}
          />
        </View>
      </View>
    );
  }
}
