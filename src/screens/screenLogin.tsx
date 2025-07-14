import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet  } from "react-native";
import { performLogin } from "../services/serviceAuthentication";
import { saveToken } from "../services/serviceStorage";

interface LoginProps {
  toLoginSuccess: () => void;
}

export default function ScreenLogin({ toLoginSuccess }: LoginProps) {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


const handleLogin = async () => {
  setLoading(true);
  setErrorMessage('');
  try {
    const response = await performLogin({ user: userName, password: userPassword });
    await saveToken(response.token);
    toLoginSuccess();
  } catch (error: any) {
    setErrorMessage(error.message || "Erro inesperado. Tente novamente.");
  } finally {
    setLoading(false);
  }
};

return (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>

    <TextInput
      style={styles.input}
      placeholder="Nome de Usuário"
      value={userName}
      onChangeText={setUserName}
      autoCapitalize="none"
    />

    <TextInput
      style={styles.input}
      placeholder="Senha"
      value={userPassword}
      onChangeText={setUserPassword}
      secureTextEntry
    />

    {loading ? (
      <ActivityIndicator size="large" />
    ) : (
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={!userName || !userPassword}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    )}

    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
title: {
  fontSize: 24,
  marginBottom: 20,
},
input: {
  width: '100%',
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  marginBottom: 10,
},
button: {
  width: '100%',
  padding: 15,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
  backgroundColor: '#ccc',
},
buttonText: {
  fontSize: 16,
},
error: {
  marginTop: 15,
  color: 'red',
  textAlign: 'center',
},
});