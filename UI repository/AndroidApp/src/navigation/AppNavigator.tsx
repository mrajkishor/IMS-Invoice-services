import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import ShopScreen from '../screens/ShopScreen';
import CreateShopScreen from '../screens/CreateShopScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import ViewInvoiceScreen from '../screens/ViewInvoiceScreen';
import CreateInvoiceScreen from '../screens/CreateInvoiceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { RootStackParamList } from '../navigationTypes';

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions: StackNavigationOptions = {
    headerShown: false,
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Shop" component={ShopScreen} />
                <Stack.Screen name="CreateShop" component={CreateShopScreen} />
                <Stack.Screen name="Invoice" component={InvoiceScreen} />
                <Stack.Screen name="ViewInvoice" component={ViewInvoiceScreen} />
                <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
