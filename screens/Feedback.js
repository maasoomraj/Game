import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Dimensions,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIndicator } from "react-native-indicators";

import * as firebase from "firebase/app";
require("firebase/auth");
require("firebase/database");

export default class Terms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: "",
      question: "",
      isLoading: false,
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("GameSelect")
    );
  };

  submit = async () => {
    if (this.state.feedback || this.state.question) {
      try {
        this.setState({ isLoading: true });
        if (this.state.feedback) {
          const key = await firebase.database().ref("feedback").push().key;
          await firebase
            .database()
            .ref("feedback")
            .child(key)
            .set({ feedback: this.state.feedback });
        }
        if (this.state.question) {
          const key = await firebase.database().ref("questions").push().key;
          await firebase
            .database()
            .ref("questions")
            .child(key)
            .set({ question: this.state.question });
        }

        this.setState({ isLoading: false });
        alert("Thank you for your feedback and suggestion");
        this.props.navigation.navigate("GameSelect");
      } catch (error) {
        this.setState({ isLoading: false });
        alert("Please try again");
      }
    } else {
      alert("Please give your feedback or suggestions");
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
            Sending your feedback...
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
            Feedback
          </Text>
        </View>

        <ScrollView style={styles.textView}>
          <Text style={styles.text}>
            How did you like the app ? Your feedback is the most valuable to us.
            Kindly suggest any improvement/feature to make this service better
            for you and your gang.
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write your feedback"
            textAlignVertical="top"
            multiline={true}
            value={this.state.feedback}
            onChangeText={(text) => this.setState({ feedback: text })}
          />
          <Text style={styles.text}>
            How did you find the questions ? Kindly suggest more questions to
            make the game more interesting .
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Suggest some questions"
            textAlignVertical="top"
            multiline={true}
            value={this.state.question}
            onChangeText={(text) => this.setState({ question: text })}
          />
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            <TouchableOpacity style={styles.button} onPress={this.submit}>
              <Text style={{ fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textView: { minHeight: 60, marginHorizontal: 20 },
  text: { fontSize: 16, color: "#eee" },
  button: {
    width: 100,
    height: 50,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: "#000",
    backgroundColor: "#F0B342",
  },
  textInput: {
    margin: 20,
    height: 100,
    borderWidth: 0.5,
    borderColor: "#000",
    borderColor: "#eee",
    color: "#eee",
    padding: 10,
  },
});
