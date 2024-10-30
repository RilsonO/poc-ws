import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { client } from '../../hooks/meilisearch';

const index = client.index('cities');

import { style as tw } from 'twrnc';

import ChatInterface from '../../components/ChatInterface.js';
import { useState } from 'react';
import { setBearerToken } from '../../services/api';
import { Auth } from '../../services/auth';

export default function Login() {
  const [userData, setUserData] = useState(null);
  const [search, setSearch] = useState('');
  const [matched, setMatched] = useState([]);

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
    <SafeAreaView
      style={tw(`bg-gray-300 flex-1 items-center justify-center gap-16`)}
    >
      <View style={tw(`bg-gray-300 flex-1 items-center justify-center gap-16`)}>
        <TouchableOpacity
          onPress={() => handleLogin(['isac24@example.net', '123456'])}
          style={tw`w-80 bg-blue-500 p-7 rounded-lg`}
        >
          <Text style={tw`text-white`}>login 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLogin(['ntreutel@example.com', '123456'])}
          style={tw`w-80 bg-blue-500 p-7 rounded-lg`}
        >
          <Text style={tw`text-white`}>login 2</Text>
        </TouchableOpacity>

        <FlatList
          ListHeaderComponent={
            <TextInput
              style={{
                width: '100%',
                height: 40,
                borderColor: '#000',
                borderWidth: 1,
                marginBottom: 16,
                paddingHorizontal: 8,
              }}
              placeholder='Digite o nome da sua cidade'
              value={search}
              onChangeText={async (txt) => {
                setSearch(txt);
                const found = await index.search(txt);
                console.log('Found =>', found);

                setMatched([...found.hits]);
              }}
            />
          }
          data={[]}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      </View>
    </SafeAreaView>
  );
}
