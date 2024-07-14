import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { BottomNavigation, List, Card, ActivityIndicator, FAB, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../store/actions/authActions';
import { fetchShopsRequest } from '../store/actions/shopActions';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import ProfileScreen from './ProfileScreen';


const ShopListRoute: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { loading, shops, error } = useSelector((state: RootState) => state.shops);
    const { user } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchShopsRequest(user.userId));
        }
    }, [dispatch, user?.userId]);

    const handleRefresh = () => {
        setRefreshing(true);
        if (user?.userId) {
            dispatch(fetchShopsRequest(user.userId));
        }
        setRefreshing(false);
    };

    const renderShopItem = ({ item }: { item: any }) => (
        <Card style={styles.card} onPress={() => navigation.navigate('Shop', { shopId: item.shopId })}>
            <Card.Content>
                <List.Item
                    title={item.shopName}
                    description={`Address: ${item.address}`}
                    left={(props) => <List.Icon {...props} icon="store" />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                />
            </Card.Content>
        </Card>
    );

    if (loading && !refreshing) {
        return <ActivityIndicator animating={true} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={shops}
                renderItem={renderShopItem}
                keyExtractor={(item) => item.shopId}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </View>
    );
};

const MainScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'shops', title: 'Shops', icon: 'store' },
        { key: 'profile', title: 'Profile', icon: 'account' },
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
                onPress={() => navigation.navigate('CreateShop')} // Navigate to the CreateShop screen
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
});

export default MainScreen;
