import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { BottomNavigation, List, Card, ActivityIndicator, FAB, Button, Surface, Appbar } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../store/actions/authActions';
import { fetchShopsRequest } from '../store/actions/shopActions';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import ProfileScreen from './ProfileScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { myColors } from '../config/theme';


const ShopListRoute: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { loading, shops, error } = useSelector((state: RootState) => state.shops);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user?.userId) {
            dispatch(fetchShopsRequest(user.userId));
        }
        console.log('Shops:', shops);
    }, [dispatch, isAuthenticated, user?.userId]);

    const handleRefresh = () => {
        setRefreshing(true);
        if (user?.userId) {
            dispatch(fetchShopsRequest(user.userId));
        }
        setRefreshing(false);
    };

    const renderShopItem = ({ item }: { item: any }) => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Shop', { shopId: item.shopId })}>
            <Card mode={'elevated'} elevation={0} style={styles.card} >
                <Card.Content>
                    <Card.Title
                        title={item.shopName}
                        subtitle={`Address : ${item.address}`}
                        // left={(props) => <MaterialIcons  {...props} name="store" />}
                        right={(props) => <MaterialIcons  {...props} name="chevron-right" />}
                    />
                </Card.Content>
            </Card>
        </TouchableWithoutFeedback>
    );

    if (loading && !refreshing) {
        return <ActivityIndicator animating={true} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <>
            <Appbar.Header>

                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="store" />} onPress={() => { }} />

                <Appbar.Content title="My Shop Catalogue" />
            </Appbar.Header>
            <View style={styles.container}>
                {shops?.length === 0 ? <>
                    <View style={styles.noRecordsWrapper}>
                        <Text style={styles.noRecordsWrapperTitle}>No Shops Found!</Text>
                        <MaterialIcons name="store" size={50} style={styles.noRecordsWrapperIcon} />
                    </View>
                </> : <FlatList
                    data={shops}
                    renderItem={renderShopItem}
                    keyExtractor={(item) => item.shopId}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />}

            </View>
        </>

    );
};

const MainScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {
            key: 'shops',
            title: 'Shops',
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
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('CreateShop')}
            />
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
