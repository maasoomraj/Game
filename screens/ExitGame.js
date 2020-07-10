import React, { Component } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Dimensions,
} from "react-native";

export default class ExitGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      exit: "",
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const from = navigation.getParam("from");
    const exit = navigation.getParam("exit");

    this.setState({ from, exit });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate(from)
    );
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
            position: "absolute",
            top:
              Dimensions.get("window").height / 2 -
              Dimensions.get("window").height / 8,
            left:
              Dimensions.get("window").width / 2 -
              Dimensions.get("window").width / 3,
            height: Dimensions.get("window").height / 4,
            width: (Dimensions.get("window").width * 2) / 3,
            borderColor: "#eee",
            borderWidth: 0.5,
          }}
        >
          <View
            style={{
              flex: 2,
              backgroundColor: "#09376B",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#eee",
                fontSize: 18,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              {" "}
              Do you want to exit the game ?
            </Text>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",
              backgroundColor: "#0E509D",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: (Dimensions.get("window").width * 2) / 9,
                height: 40,
                backgroundColor: "#09376B",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: (Dimensions.get("window").width * 2) / 27,
                marginRight: (Dimensions.get("window").width * 2) / 27,
                borderRadius: 10,
              }}
              onPress={() => this.props.navigation.navigate(this.state.exit)}
            >
              <Text style={{ color: "#eee", fontSize: 18 }}>Exit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: (Dimensions.get("window").width * 2) / 9,
                height: 40,
                backgroundColor: "#09376B",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={() => this.props.navigation.navigate(this.state.from)}
            >
              <Text style={{ color: "#eee", fontSize: 18 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

// let backPressed = 0;

// BackHandler.addEventListener(
//   "hardwareBackPress",
//   this.handleBackButton.bind(this)
// );

// handleBackButton() {
//   if (backPressed > 0) {
//     this.props.navigation.navigate("GameSelect");
//     backPressed = 0;
//   } else {
//     backPressed++;
//     ToastAndroid.show("Press Again To Exit the Game", ToastAndroid.SHORT);
//     setTimeout(() => {
//       backPressed = 0;
//     }, 2000);
//     return true;
//   }
// }
