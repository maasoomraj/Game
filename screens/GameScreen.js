import React, { Component } from "react";
import { View, Text, BackHandler } from "react-native";

export default class GameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        <Text>YES</Text>;
      }

      //   this.props.navigation.navigate("GameSelect")
    );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> GameScreen </Text>
      </View>
    );
  }
}
