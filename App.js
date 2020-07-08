import React from "react";

import { createAppContainer, createSwitchNavigator } from "react-navigation";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config";

import WelcomeScreen from "./screens/WelcomeScreen";
import StartGame from "./screens/StartGame";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoadingScreen from "./screens/LoadingScreen";
import GameSelect from "./screens/GameSelect";
import JoinGame from "./screens/JoinGame";
import CreateGame from "./screens/CreateGame";
import GameScreen from "./screens/GameScreen";

class App extends React.Component {
  constructor() {
    super();

    this.firebaseInitialise();
  }

  firebaseInitialise = () => {
    firebase.initializeApp(firebaseConfig);
  };

  render() {
    return <AppContainer />;
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen,
  LoginScreen,
  SignUpScreen,
  WelcomeScreen,
  StartGame,
  GameSelect,
  JoinGame,
  CreateGame,
  GameScreen,
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default App;
