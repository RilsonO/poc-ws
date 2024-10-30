// src/components/ChatInterface.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { style as tw } from 'twrnc';
import useEcho from '../hooks/echo';
import { api } from '../services/api';
import { Auth } from '../services/auth';

const ChatInterface = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userData, setUserData] = useState(user);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [isFriendTypingTimer, setIsFriendTypingTimer] = useState(null);

  const echo = useEcho();

  const handleSend = async () => {
    if (inputText.trim()) {
      setInputText('');
      const options = {
        method: 'POST',
        url: `/api/messages/${userData.id === 19 ? 20 : 19}`,
        data: {
          /**I logged in with user 1 and 7.
           * then you configure this to be dynamic
           * (giving the user the power to choose who they want to chat with)
           * */
          user_id: userData.id === 19 ? 20 : 19, // receiver
          from: userData.id,
          message: inputText,
        },
      };

      try {
        const response = await api.request(options);
        console.log('response: ', response.status);

        if (response.status === 201) {
          const data = response.data;
          console.log('response', data);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: data?.id,
              from: userData.id,
              message: data?.text,
            },
          ]);
        }
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    }
  };

  const sendTypingEvent = () => {
    echo.private(`chat.${userData.id === 19 ? 20 : 19}`).whisper('typing', {
      userID: user.id,
    });
  };

  function subscribeToChatChannel() {
    if (echo) {
      echo
        .private(`chat.${user?.id}`)
        .listen('MessageSent', (e) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: e.message?.id,
              message: e.message?.text,
              from: e.message?.sender_id,
            },
          ]);
        })
        .listenForWhisper('typing', (response) => {
          console.log('[listenForWhisper] typing response => ', response);
          const friendId = userData.id === 19 ? 20 : 19;
          setIsFriendTyping(response.userID === friendId);

          if (isFriendTypingTimer) {
            clearTimeout(isFriendTypingTimer);
          }

          const timer = setTimeout(() => {
            setIsFriendTyping(false);
          }, 1000);

          setIsFriendTypingTimer(timer);
        });
    }
  }

  async function getMessages() {
    try {
      const teste = user.id === 19 ? 20 : 19;

      const response = await Auth.messages(teste);

      if (response.status == 200) {
        const data = response.data.map((message) => {
          return {
            id: message.id,
            message: message.text,
            from: message.sender.id,
          };
        });
        setMessages((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (echo) {
      console.log('user', userData.id);
      subscribeToChatChannel();
    }
    return () => {
      if (echo && user) {
        echo.leaveChannel(`chat.${user?.id}`);
        clearTimeout(isFriendTypingTimer);
      }
    };
  }, [echo, user]);

  useEffect(() => {
    if (userData) {
      getMessages();
    }
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={tw(
        `flex flex-row  my-2`,
        item.from == userData.id ? `justify-end` : 'justify-start'
      )}
    >
      <View
        style={tw(
          `rounded-lg p-6 max-w-3/4`,
          item.from == userData.id ? 'bg-[#1EBEA5]' : 'bg-[#8696a0]'
        )}
      >
        <Text style={tw`text-white`}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0b141a]`}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          String(item.id + index + new Date().getTime())
        }
        contentContainerStyle={tw`p-4`}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={tw`p-4 border border-gray-700 gap-2`}>
          <View style={tw`bg-blue-500 p-6 rounded-lg`}>
            <Text style={tw`text-white`}>{userData?.name}</Text>
          </View>
        </View>
        <View style={tw`flex flex-row p-4 border-t border-gray-700 gap-2`}>
          <TextInput
            style={tw`flex-1 bg-gray-800 text-white p-6 rounded-lg`}
            value={inputText}
            onChangeText={(txt) => {
              sendTypingEvent();
              setInputText(txt);
            }}
            placeholder='Type a message...'
            placeholderTextColor='gray'
          />
          <TouchableOpacity
            onPress={handleSend}
            style={tw`bg-blue-500 p-6 rounded-lg`}
          >
            <Text style={tw`text-white`}>Send</Text>
          </TouchableOpacity>
        </View>
        {isFriendTyping && (
          <Text style={tw`text-white ml-6 my-2`}>friend is typing...</Text>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatInterface;
