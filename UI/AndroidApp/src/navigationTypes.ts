import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Shop: { shopId: string };
    Invoice: { invoiceId: string };
    CreateShop: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Login'
>;

export type MainScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Main'
>;


export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type MainScreenRouteProp = RouteProp<RootStackParamList, 'Main'>;
