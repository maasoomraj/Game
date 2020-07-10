import React, { Component } from "react";
import { View, Text, StatusBar, Image, BackHandler } from "react-native";

export default class DeveloperInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect")
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#130B21",
          paddingTop: StatusBar.currentHeight,
        }}
      >
        {/* Developer Info */}
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
            Developer Info
          </Text>
        </View>
        {/* Developer Details */}
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
              color: "#EC3D6C",
              fontSize: 20,
              fontFamily: "sans-serif-medium",
              fontWeight: "500",
              letterSpacing: 0.2,
              textAlign: "justify",
            }}
          >
            Hi ! I am Masoom Raj, a Sophomore, pursuing BTech in Computer
            Science Engineering from Indian Institute of Technology Jodhpur.
          </Text>
          <Text
            style={{
              color: "#eee",
              fontSize: 20,
              fontFamily: "sans-serif-medium",
              fontWeight: "500",
              letterSpacing: 0.2,
              textAlign: "justify",
              paddingTop: 30,
            }}
          >
            In case of bugs, crash or any feedback, please contact me.
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          ></View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/linkedin.png")}
              color="eee"
              style={{ width: 40, height: 40 }}
            />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/facebook.png")}
              color="eee"
              style={{ width: 40, height: 40 }}
            />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/instagram.png")}
              color="eee"
              style={{ width: 40, height: 40 }}
            />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          ></View>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              color: "#EC3D6C",
              fontSize: 23,
              fontWeight: "bold",
              letterSpacing: 0.2,
            }}
          >
            Hope you like the app !
          </Text>
        </View>
      </View>
    );
  }
}
