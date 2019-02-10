import React, { useReducer, createContext } from "react";

const token_p = localStorage.getItem("TOKEN_JWT");
const user_p = localStorage.getItem("USER");

// Initialize base state
const initialState = {
  token: token_p || null,
  isAuth: Boolean(token_p),
  user: user_p ? JSON.parse(user_p) : null
};

// Create a new context
export const authContext = createContext();

// Save token and user on localStorage
function AuthUser(state, { token: newToken, user }) {
  localStorage.setItem("TOKEN_JWT", newToken);
  localStorage.setItem("USER", JSON.stringify(user));
  return { ...state, token: newToken, user, isAuth: true };
}

function removeSession(state, action) {
  localStorage.removeItem("TOKEN_JWT");
  localStorage.removeItem("USER");
  return { token: null, isAuth: false, use: null, pair: [], channels: [] };
}

function updateUser(state, { type, ...data }) {
  const alterUser = { ...state.user, ...data };
  localStorage.setItem("USER", JSON.stringify(alterUser));
  return { ...state, user: alterUser };
}

// Define Reducer for state management about auth
function reducer(state, action) {
  switch (action.type) {
    case "SET_TOKEN":
      return AuthUser(state, action);
    case "UPDATE_USER":
      return updateUser(state, action);
    case "REMOVE_TOKEN":
      return removeSession(state, action);
    default:
      return state;
  }
}

export function AuthProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <authContext.Provider value={{ state, dispatch }}>
      {props.children}
    </authContext.Provider>
  );
}

export const AuthConsumer = authContext.Consumer;
