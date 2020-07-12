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

export default class Help extends Component {
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
            How To Play
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View style={{ minHeight: 60, marginHorizontal: 20 }}>
            <Text style={{ fontSize: 18, color: "#EC3D6C" }}>
              TeleGang is made to play in a group of minimum 3 players.
            </Text>
          </View>

          {/* About Game */}
          <View style={styles.headingView}>
            <Text style={styles.heading}>About Game</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>
              TeleGang is a real-time game developed for distant friends to
              catch up and answer questions about your group. You need to either
              create/join a game. All members of the group get the same question
              and each one of you answer. You need to wait until every one
              writes his/her answer. Then answers are revealed to you in a
              shuffled order, you need to select the answer which you like and
              give them a point. After everyone gave points, scoreboard is
              released. The game continues for the number of rounds it was set
              to.{"\n"}
              {"\n"}
              Do not leave an ongoing game, you will ruin the game as you cannot
              enter the game once it has started.
            </Text>
            <Text style={[styles.text, { color: "#F0B342", fontSize: 12 }]}>
              Keep your app updated to enjoy new questions
            </Text>
          </View>

          {/* Create Game */}
          <View style={styles.headingView}>
            <Text style={styles.heading}>Create Game</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>
              Main screen of the app has an option to Create Game. You need to
              select the number of rounds you want to play. You get an
              auto-generated game code.{"\n"}
              {"\n"}
              You need to share this code with others to let them join the game.
              When minimum 3 players join the game and are ready to play, you
              can start the game.
            </Text>
          </View>

          {/* Join Game */}
          <View style={styles.headingView}>
            <Text style={styles.heading}>Join Game</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>
              If your friend has already created the game, he will share you a
              game code. Main screen of the app has an option to Join Game. You
              need to enter the game code to join the game.Once you are ready to
              play, you can click on ready and you should see a green tick
              adjacent to your name.{"\n"}
              {"\n"}
              The game can only be started by creator of the game.
              {"\n"}
              {"\n"}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    color: "#F0B342",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  headingView: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  textView: { minHeight: 60, marginHorizontal: 20 },
  text: { fontSize: 16, color: "#eee" },
});
