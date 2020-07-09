import { createStore } from "redux";

const SET_USER = (user) => {
  return {
    type: "SET_USER",
    details: user,
  };
};

const reducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case "SET_USER": {
      return { ...state, user: action.details };
    }
  }
};
let store = createStore(reducer);

export { store, SET_USER };
