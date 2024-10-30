import { StyleSheet, Text, View } from 'react-native';
import 'react-native-url-polyfill/auto';

import Login from './src/screens/Login';

export default function App() {
  return <Login />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
