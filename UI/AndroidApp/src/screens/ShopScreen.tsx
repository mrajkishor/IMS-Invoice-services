import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, Card, List, ActivityIndicator, Text, FAB, Appbar, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { fetchShopRequest, updateShopRequest, deleteShopRequest } from '../store/actions/shopActions';
import { fetchInvoicesRequest } from '../store/actions/invoiceActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { myColors } from '../config/theme';

type ShopScreenRouteProp = RouteProp<RootStackParamList, 'Shop'>;

type Props = {
    route: ShopScreenRouteProp;
};

const BusinessUpdateScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const shop = useSelector((state: RootState) => state.shops.shop);
    const [editMode, setEditMode] = useState(false);
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        dispatch(fetchShopRequest(shopId));
    }, [dispatch, shopId]);

    useEffect(() => {
        if (shop) {
            setShopName(shop.shopName);
            setAddress(shop.address);
        }
    }, [shop]);

    const handleUpdate = () => {
        if (editMode) {
            dispatch(updateShopRequest(shopId, { shopName, ownerId: shop.ownerId, address }));
        }
        setEditMode(!editMode);
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this shop?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        dispatch(deleteShopRequest(shopId));
                        navigation.goBack();
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <Card mode={"elevated"} elevation={0}>
                <Card.Title title="Business Details" subtitle="Update your Business name and address" />
                <Card.Content>
                    <TextInput
                        label="Business Name"
                        value={shopName}
                        onChangeText={setShopName}
                        disabled={!editMode}
                    />
                    <TextInput
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        disabled={!editMode}
                    />
                </Card.Content>
            </Card>
            <Button mode="elevated" onPress={handleUpdate} style={styles.button}>
                {editMode ? 'Save Changes' : 'Update Business'}
            </Button>
            <Button mode="contained" onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
                Delete
            </Button>
        </View>
    );
};

const InvoiceListScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const invoicesState = useSelector((state: RootState) => state.invoices);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchInvoicesRequest(shopId));
    }, [dispatch, shopId]);

    const renderInvoiceItem = ({ item }: { item: any }) => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('ViewInvoice', { invoice: item })}>
            <Card mode={"elevated"} elevation={0}>
                <Card.Content>
                    <Card.Title
                        title={`Invoice ID: ${item.invoiceId}`}
                        subtitle={`Amount: ${item.amount}\nDetails: ${item.details}`}
                        right={() => <MaterialIcons name="chevron-right" size={24} color="black" />}
                    />
                </Card.Content>
            </Card>
        </TouchableWithoutFeedback>
    );

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchInvoicesRequest(shopId));
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {invoicesState.loading ? (
                <ActivityIndicator animating={true} style={styles.loader} />
            ) : invoicesState.error ? (
                <Text style={styles.error}>{invoicesState.error}</Text>
            ) : invoicesState?.invoices?.length === 0 ? (
                <Text style={styles.alert}>No Invoice Found!</Text>
            ) : (
                <FlatList
                    data={invoicesState.invoices}
                    renderItem={renderInvoiceItem}
                    keyExtractor={(item) => item.invoiceId}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('CreateInvoice', { shopId })}
            />
        </View>
    );
};

const ShopScreen: React.FC<Props> = ({ route }) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'invoices', title: 'Invoices' },
        { key: 'business', title: 'Business Update' }
    ]);

    const renderScene = SceneMap({
        invoices: () => <InvoiceListScreen route={route} />,
        business: () => <BusinessUpdateScreen route={route} />
    });
    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={styles.tabBar}
        />
    );
    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="store" />} onPress={() => { }} />
                <Appbar.Content title="My Business" />
            </Appbar.Header>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: 100 }}
                style={styles.tabView}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    button: {
        marginTop: 5,
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: myColors.colors.errorContainer,
    },
    loader: {
        marginTop: 20,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    alert: {
        color: myColors.colors.backdrop,
        textAlign: 'center',
        margin: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    tabView: {
        flex: 1,
        backgroundColor: myColors.colors.onPrimary
    },
    tabBar: {
        backgroundColor: myColors.colors.inversePrimary
    }
});

export default ShopScreen;
