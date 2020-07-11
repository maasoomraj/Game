import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  BackHandler,
  ToastAndroid,
  Image,
} from "react-native";

import * as firebase from "firebase/app";
require("firebase/auth");
require("firebase/database");

import { store } from "../helpers/redux-store";
import { LinearGradient } from "expo-linear-gradient";

import GradientClickable from "../helpers/components/GradientClickable";
let backPressed = 0;

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
    };
  }

  componentDidMount = () => {
    // const { navigation } = this.props;
    // const user = navigation.getParam("user");
    this.setState({ user: store.getState().user });

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

  logout = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("LoadingScreen");
    } catch (error) {
      alert("Unable to Logout right now.");
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          backgroundColor: "#130B21",
        }}
      >
        <View
          style={{
            margin: 20,
            justifyContent: "center",
            alignItems: "center",
            height: 160,
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: "bold", color: "#EC3D6C" }}>
            Twisty Tale
          </Text>
          {!this.state.user.photoURL ? (
            <Image
              source={require("../assets/icons8-male-user-96.png")}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
                marginVertical: 10,
              }}
            />
          ) : (
            <Image
              source={{ uri: this.state.user.photoURL }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
                marginVertical: 10,
              }}
            />
          )}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              fontStyle: "italic",
              color: "#eee",
            }}
          >
            Hello {this.state.user.name}
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {/* Edit Details */}
          <GradientClickable
            props={this.props}
            nav={"EditDetails"}
            colors={["#0E1111", "#222A2A", "#343637", "#394249", "#3F484A"]}
            headerText={"Edit Details"}
            subText={"Change your username or password"}
          />

          {/* CREATE GAME */}
          <GradientClickable
            props={this.props}
            nav={"CreateGame"}
            // colors={["#EB8139", "#EFAB40", "#F6DE66"]}
            colors={["#7E1A20", "#7E1A20", "#9F2325", "#B5292A", "#C52E2B"]}
            headerText={"Create Game"}
            subText={"Create new game and share your code"}
          />

          {/* JOIN GAME */}
          <GradientClickable
            props={this.props}
            nav={"JoinGame"}
            // colors={["#D6322D", "#E9716C", "#EA9197"]}
            // colors={["#21153A", "#231539"]}
            colors={["#04062D", "#040D47", "#081869", "#0B2591", "#0D38A4"]}
            headerText={"Join Game"}
            subText={"Join to play with your friends"}
          />

          {/* Developer Info */}
          <GradientClickable
            props={this.props}
            nav={"DeveloperInfo"}
            colors={["#051D3C", "#241D3C", "#431D3C", "#631D3C", "#811E3C"]}
            headerText={"Developer Info"}
            subText={"App Developer details"}
          />

          {/* LOGOUT */}
          <LinearGradient
            // colors={["#4A9629", "#65B657", "#A8D983"]}
            colors={["#101032", "#154254", "#276463", "#388474", "#52A584"]}
            // colors={colors}
            style={{
              borderRadius: 13,
              height: 100,
              marginVertical: 5,
              borderColor: "#000",
              borderWidth: 0.8,
              marginHorizontal: 5,
            }}
          >
            <TouchableOpacity
              onPress={this.logout}
              // style={{
              //   justifyContent: "center",
              //   alignItems: "center",
              // }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: 24,
                  paddingTop: 10,
                  paddingBottom: 5,
                  paddingHorizontal: 15,
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
        {/* <Text style={{ color: "#000" }}>{this.state.user.name}</Text> */}
      </View>
    );
  }
}
