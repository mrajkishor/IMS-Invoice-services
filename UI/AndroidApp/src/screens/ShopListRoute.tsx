import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableWithoutFeedback, Image } from 'react-native';
import { BottomNavigation, List, Card, ActivityIndicator, FAB, Button, Surface, Appbar, Tooltip } from 'react-native-paper';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../store/actions/authActions';
import { fetchShopsRequest } from '../store/actions/shopActions';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import ProfileScreen from './ProfileScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { myColors } from '../config/theme';
import { EventRegister } from 'react-native-event-listeners';



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



    useEffect(() => {
        const listener = EventRegister.addEventListener('refreshShopList', () => {
            // Trigger fetch or state update
            dispatch(fetchShopsRequest(user.userId));
        });

        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);


    // Use `useFocusEffect` to trigger a refresh when the screen is focused. 
    // Why its called here?
    // To navigate back to the MainScreen after creating a shop, you need to trigger the fetchShopsRequest to reload the shop list. 
    // One common way to achieve this is by using the useFocusEffect or useIsFocused hook from React Navigation, which ensures that every time the screen is navigated to, a refresh happens.
    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated && user?.userId) {
                dispatch(fetchShopsRequest(user.userId));  // Re-fetch the shops when the screen is focused
            }
        }, [dispatch, isAuthenticated, user?.userId])
    );



    // Handle refreshing the list when the user pulls down
    const handleRefresh = () => {
        setRefreshing(true);
        if (user?.userId) {
            dispatch(fetchShopsRequest(user.userId));  // Re-fetch the shops
        }
        setRefreshing(false);
    };

    // const renderShopItem = ({ item }: { item: any }) => (
    //     <TouchableWithoutFeedback onPress={() => navigation.navigate('Shop', { shopId: item.shopId })}>
    //         <Card mode={'elevated'} elevation={0} style={styles.card} >
    //             <Card.Content>
    //                 <Card.Title
    //                     title={item.shopName}
    //                     subtitle={`Address: ${item.address}`}
    //                     right={(props) => <MaterialIcons  {...props} name="chevron-right" />}
    //                 />
    //             </Card.Content>
    //         </Card>
    //     </TouchableWithoutFeedback>
    // );

    const renderShopItem = ({ item }: { item: any }) => (
        <Card mode="elevated" elevation={3} style={styles.shopCard}>
            {item.logo ? (
                <Card.Cover source={{ uri: item.logo }} style={styles.shopCoverImage} />
            ) : (
                <View style={styles.placeholderContainer}>
                    <MaterialIcons name="image-not-supported" size={50} color="gray" />
                    <Text style={styles.placeholderText}>No Logo</Text>
                </View>
            )}
            <Card.Content style={styles.shopCardContent}>
                <View style={styles.shopInfoContainer}>
                    {/* Shop Icon */}
                    {/* <MaterialIcons name="store" size={40} style={styles.shopIcon} /> */}

                    <Image source={require('../assets/images/MainScreen/shopTiny.png')} style={styles.shopIcon} />
                    {/* Shop Details */}
                    <View style={styles.shopDetailsContainer}>
                        <Text style={styles.shopName}>{item.shopName}</Text>
                        {/* <View style={styles.ownerContainer}>
                            <MaterialIcons name="person" size={16} style={styles.icon} />
                            <Text style={styles.ownerName}>{item.ownerName}</Text>
                        </View> */}
                        <View style={styles.addressContainer}>
                            <MaterialIcons name="location-on" size={16} style={styles.icon} />
                            <Text style={styles.address}>{item.address}</Text>
                        </View>
                    </View>
                </View>
            </Card.Content>

            {/* View Shop Button */}
            <Card.Actions style={styles.shopActions}>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('Shop', { shopId: item.shopId })}
                >
                    View Shop
                </Button>
            </Card.Actions>
        </Card>
    );


    if (loading && !refreshing) {
        return <ActivityIndicator animating={true} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }
    const renderFooter = () => (
        <View style={styles.footerContainer}>
            <MaterialIcons name="emoji-emotions" size={32} style={styles.smileyIcon} />
            <Text style={styles.insetText}>
                "Simplify sales, share invoices, smile more!"
            </Text>
        </View>
    );

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
                    <>
                        <FlatList
                            data={[...shops].reverse()}
                            renderItem={renderShopItem}
                            keyExtractor={(item) => item.shopId}
                            refreshing={refreshing}  // Refreshing state
                            onRefresh={handleRefresh}  // Pull-to-refresh handler
                            ListFooterComponent={renderFooter} // Add footer text

                        />

                    </>
                )}

            </View>

        </>
    );
};

const styles = StyleSheet.create({
    placeholderContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    placeholderText: {
        marginTop: 10,
        fontSize: 14,
        color: 'gray',
    },

    shopCard: {
        margin: 10,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    shopCoverImage: {
        height: 150,
        width: '100%',
        borderRadius: 0,
    },
    shopCardContent: {
        padding: 10,
    },
    shopInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopIcon: {
        color: 'tomato',
        marginRight: 10,
    },
    shopDetailsContainer: {
        flex: 1,
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ownerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: 'gray',
        marginRight: 5,
    },
    ownerName: {
        fontSize: 14,
        color: 'gray',
    },
    address: {
        fontSize: 14,
        color: 'gray',
    },
    shopActions: {
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
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
    footerContainer: {
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff', // White background
        padding: 50,
    },
    insetText: {
        fontSize: 24, // Large font size for visibility
        fontWeight: '600', // Slightly lighter font weight for subtlety
        color: '#eaeaea', // Softer gray for the text color
        textAlign: 'center',
        textShadowColor: '#f5f5f5', // Softer lighter shadow for top-left
        textShadowOffset: { width: -1, height: -1 }, // Slight offset for subtle effect
        textShadowRadius: 2, // Reduced blur for crispness
        shadowColor: '#ccc', // Softer darker shadow for bottom-right
        shadowOffset: { width: 1, height: 1 }, // Slight offset for a clean inset effect
        shadowOpacity: 0.8, // Reduced opacity for softer shadow
        shadowRadius: 2, // Reduced blur for cleaner look
    },
    smileyIcon: {
        color: '#eaeaea', // Yellow color for the smiley
        marginBottom: 10, // Space between the icon and text
    },
});

export default ShopListRoute;