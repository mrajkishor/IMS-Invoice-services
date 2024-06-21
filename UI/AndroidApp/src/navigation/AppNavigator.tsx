import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';


// import MainScreen from '../screens/MainScreen';
// Import other screens as needed

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                {/* <Stack.Screen name="Main" component={MainScreen} /> */}
                {/* Add other screens here */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
