import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from '../screens/main/MessagesScreen';
import ChatScreen from '../screens/main/ChatScreen';

const Stack = createStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}