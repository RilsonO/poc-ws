import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';

import { style as tw } from 'twrnc';

import ChatInterface from '../../components/ChatInterface.js';
import { useState } from 'react';
import { setBearerToken } from '../../services/api';
import { Auth } from '../../services/auth';

export default function Login() {
  const [userData, setUserData] = useState(null);

  async function handleLogin(userCredentials) {
    try {
      const response = await Auth.login(...userCredentials);

      if (response.status == 200) {
        const data = response.data;
        setBearerToken(data.access_token);
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return userData ? (
    <ChatInterface user={userData} />
  ) : (
    <View style={tw(`bg-gray-300 flex-1 items-center justify-center gap-16`)}>
      <TouchableOpacity
        onPress={() => handleLogin(['amacejkovic@example.com', '123456'])}
        style={tw`w-80 bg-blue-500 p-7 rounded-lg`}
      >
        <Text style={tw`text-white`}>login 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleLogin(['akassulke@example.org', '123456'])}
        style={tw`w-80 bg-blue-500 p-7 rounded-lg`}
      >
        <Text style={tw`text-white`}>login 2</Text>
      </TouchableOpacity>
    </View>
  );
}
