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



const ShopListRoute: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { loading, shops, error } = useSelector((state: RootState) => state.shops);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch the list of shops when the component is mounted or user ID changes
    useEffect(() => {
        if (isAuthenticated && user?.userId) {
            dispatch(fetchShopsRequest(user.userId));
        }
    }, [dispatch, isAuthenticated, user?.userId]);



    // Handle refreshing the list when the user pulls down
    const handleRefresh = () => {
        setRefreshing(true);
        if (user?.userId) {
            dispatch(fetchShopsRequest(user.userId));  // Re-fetch the shops
        }
        setRefreshing(false);
    };

    const renderShopItem = ({ item }: { item: any }) => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Shop', { shopId: item.shopId })}>
            <Card mode={'elevated'} elevation={0} style={styles.card} >
                <Card.Content>
                    <Card.Title
                        title={item.shopName}
                        subtitle={`Address: ${item.address}`}
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
                <Appbar.Content title="My Catalogue" />
            </Appbar.Header>
            <View style={styles.container}>
                {shops?.length === 0 ? (
                    <View style={styles.noRecordsWrapper}>
                        <Text style={styles.noRecordsWrapperTitle}>No Business Found!</Text>
                        <MaterialIcons name="store" size={50} style={styles.noRecordsWrapperIcon} />
                    </View>
                ) : (
                    <FlatList
                        data={shops}
                        renderItem={renderShopItem}
                        keyExtractor={(item) => item.shopId}
                        refreshing={refreshing}  // Refreshing state
                        onRefresh={handleRefresh}  // Pull-to-refresh handler
                    />
                )}
            </View>
        </>
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

export default ShopListRoute;