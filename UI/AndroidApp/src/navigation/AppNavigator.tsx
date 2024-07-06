import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import ShopScreen from '../screens/ShopScreen';
import CreateShopScreen from '../screens/CreateShopScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import ViewInvoiceScreen from '../screens/ViewInvoiceScreen';
import { RootStackParamList } from '../navigationTypes';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Shop" component={ShopScreen} />
                <Stack.Screen name="CreateShop" component={CreateShopScreen} />
                <Stack.Screen name="Invoice" component={InvoiceScreen} />
                <Stack.Screen name="ViewInvoice" component={ViewInvoiceScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
