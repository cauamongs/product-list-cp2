import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUser } from "../../contexts";
import Toast from "react-native-toast-message";

const LoginScreen = ({ changeScreen }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const { updateUser } = useUser();

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(({ user }) => {
        updateUser(user);
        changeScreen("ShoppingList");
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: `Credenciais inválidas!`,
        });
        throw err;
      });
  };

  const handleRegister = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(({ user }) => {
        updateUser(user);
        changeScreen("ShoppingList");
      })
      .catch(() => {
        console.error("Erro ao registrar usuário:");
      });
  };

  const handleUpdateEmail = (value) => {
    setUser((valorAnterior) => ({ ...valorAnterior, email: value }));
  };

  const handleUpdatePassword = (value) => {
    setUser((valorAnterior) => ({ ...valorAnterior, password: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login ou registre-se</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={handleUpdateEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={user.password}
        onChangeText={handleUpdatePassword}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Login" onPress={handleLogin} />
        </View>
        <View style={styles.button}>
          <Button title="Registrar" onPress={handleRegister} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
    gap: "10px",
  },
  button: {
    flex: 1,
  },
});

export default LoginScreen;
