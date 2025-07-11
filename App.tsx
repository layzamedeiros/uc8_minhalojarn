import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ScreenLogin from './src/screens/screenLogin';
import ScreenProducts from './src/screens/screenProducts';
import { getToken, removeToken } from './src/services/serviceStorage';
import api from './src/api/axiosConfig';

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

  if (authenticated) {
    return <ScreenProducts toLogout={handleLogout} />;
  } else {
    return <ScreenLogin toLoginSuccess={() => setAuthenticated(true)} />;
  }
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
