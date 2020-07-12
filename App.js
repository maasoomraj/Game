import React from "react";

import { createAppContainer, createSwitchNavigator } from "react-navigation";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config";

import StartGame from "./screens/StartGame";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoadingScreen from "./screens/LoadingScreen";
import GameSelect from "./screens/GameSelect";
import JoinGame from "./screens/JoinGame";
import CreateGame from "./screens/CreateGame";
import GameScreen from "./screens/GameScreen";
import AnswerState from "./screens/AnswerState";
import ChooseAnswer from "./screens/ChooseAnswer";
import LeaderBoard from "./screens/LeaderBoard";
import DeveloperInfo from "./screens/DeveloperInfo";
import EditDetails from "./screens/EditDetails";
import ChangePassword from "./screens/ChangePassword";
import ScoreBoard from "./screens/ScoreBoard";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import Terms from "./screens/Terms";
import Help from "./screens/Help";
import Feedback from "./screens/Feedback";

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
  StartGame,
  GameSelect,
  JoinGame,
  CreateGame,
  GameScreen,
  AnswerState,
  ChooseAnswer,
  LeaderBoard,
  DeveloperInfo,
  EditDetails,
  ChangePassword,
  ScoreBoard,
  PrivacyPolicy,
  Terms,
  Help,
  Feedback,
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default App;
