import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { BottomNavigation, List, Card } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logoutRequest } from '../store/actions/authActions';
import { RootStackParamList } from '../navigationTypes';

const ProfileSettingRoute = () => <Text style={styles.scene}>Profile Setting</Text>;

const ShopListRoute: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const shops = [
        { id: '1', name: 'Shop 1', owner: 'Owner 1', address: 'Address 1' },
        { id: '2', name: 'Shop 2', owner: 'Owner 2', address: 'Address 2' },
        // Add more shops here
    ];

    const renderShopItem = ({ item }: { item: any }) => (
        <Card style={styles.card} onPress={() => navigation.navigate('Shop', { shopId: item.id })}>
            <Card.Content>
                <List.Item
                    title={item.name}
                    description={`Owner: ${item.owner}\nAddress: ${item.address}`}
                    left={(props) => <List.Icon {...props} icon="store" />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                />
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={shops}
                renderItem={renderShopItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const MainScreen: React.FC = () => {
    const dispatch = useDispatch();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'shops', title: 'Shops', icon: 'store' },
        { key: 'profile', title: 'Profile', icon: 'account' },
    ]);

    const handleLogout = () => {
        dispatch(logoutRequest());
    };

    const renderScene = BottomNavigation.SceneMap({
        profile: ProfileSettingRoute,
        shops: ShopListRoute, // Use the ShopListRoute here
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            style={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 10,
    },
});

export default MainScreen;
