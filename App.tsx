import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast, { BaseToast, ToastConfig } from "react-native-toast-message";

import ScreenLogin from './src/screens/screenLogin';
import ScreenProducts from './src/screens/screenProducts';
import ScreenDetailsProduct from './src/screens/screenDetailsProduct';
import { getToken, removeToken } from './src/services/serviceStorage';
import api from './src/api/axiosConfig';
import ScreenSearchProducts from './src/screens/screenSearchProducts';

const toastConfig: ToastConfig = {
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#c43232", backgroundColor: "#ffffff" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#c43232",
      }}
      text2Style={{
        fontSize: 14,
        color: "#555",
      }}
    />
  ),
};

type Screens = {
  Products: undefined;
  ScreenSearchProducts: undefined;
  DetailsProducts: {
    productId: number;
  }
}

export type ProductDetailsProps = NativeStackNavigationProp<Screens>;

const Stack = createNativeStackNavigator();

export default function App() {

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken();
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setInitialLoading(false);
    };

    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    delete api.defaults.headers.common['Authorization'];
    setAuthenticated(false);
  };

  if (initialLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {authenticated ? (
            <Stack.Group>
              <Stack.Screen name="Products">
                {(props) => <ScreenProducts {...props} toLogout={handleLogout} />}
              </Stack.Screen>

              <Stack.Screen name="ScreenSearchProducts">
                {(props) => <ScreenSearchProducts {...props} toLogout={handleLogout} />}
              </Stack.Screen>

              <Stack.Screen name="DetailsProducts">
                {(props) => <ScreenDetailsProduct {...props} />}
              </Stack.Screen>
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="Login" options={{ title: "Entrar" }}>
                {(props) => <ScreenLogin {...props} toLoginSuccess={() => setAuthenticated(true)} />}
              </Stack.Screen>
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});