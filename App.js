import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import "firebase/auth";
import "firebase/database";
import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import ShoppingListScreen from "./screens/ListaCompras";
import LoginScreen from "./screens/Login";
import Toast from "react-native-toast-message";
import { UserProvider } from "./contexts";

initializeApp(firebaseConfig);

export default function App() {
  const [screen, setScreen] = useState("Login");

  const changeScreen = (newScreen) => {
    setScreen(newScreen);
  };

  const renderScreen = () => {
    switch (screen) {
      case "Login":
        return <LoginScreen changeScreen={changeScreen} />;
      case "ShoppingList":
        return <ShoppingListScreen changeScreen={changeScreen} />;

      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <UserProvider>
        {renderScreen()}
        <StatusBar style="auto" />
        <Toast />
      </UserProvider>
    </React.Fragment>
  );
}
