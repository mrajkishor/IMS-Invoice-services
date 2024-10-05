import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { BottomNavigation, List, Card, ActivityIndicator, FAB, Button, Surface, Appbar, Tooltip } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../store/actions/authActions';
import { fetchShopsRequest } from '../store/actions/shopActions';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import ProfileScreen from './ProfileScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { myColors } from '../config/theme';
import ShopListRoute from './ShopListRoute';




const MainScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {
            key: 'shops',
            title: 'Business',
            focusedIcon: 'store',
            unfocusedIcon: 'store-outline'
        },
        {
            key: 'profile',
            title: 'Profile',
            focusedIcon: 'account-circle',
            unfocusedIcon: 'account-circle-outline'
        },
    ]);

    const handleLogout = () => {
        dispatch(logoutRequest());
    };

    const renderScene = BottomNavigation.SceneMap({
        profile: ProfileScreen,
        shops: ShopListRoute,
    });

    return (
        <View style={styles.container}>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                style={styles.container}
            />
            {index === 0 && <Tooltip title="Create Business">
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => navigation.navigate('CreateShop')}
                />
            </Tooltip>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    surface: {
        zIndex: 1000,
        paddingBottom: 2,
        backgroundColor: "white"
    },
    shopListHeader: {
        fontSize: 20,
        fontWeight: "600",
        // textAlign: 'center',
        padding: 10,
        backgroundColor: myColors.colors.background,
    },
    card: {
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 80,
    },
    noRecordsWrapper: {
        flex: 1,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
    noRecordsWrapperTitle: {
        fontSize: 18,
        marginBottom: 10, // Add some space between the text and icon
    },
    noRecordsWrapperIcon: {
        color: 'gray', // Optional: customize the icon color
    },


});

export default MainScreen;
