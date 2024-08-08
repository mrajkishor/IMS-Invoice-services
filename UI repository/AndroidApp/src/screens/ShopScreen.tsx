import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { TextInput, Button, Card, List, ActivityIndicator, Text, FAB, Appbar, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { fetchShopRequest, updateShopRequest, deleteShopRequest } from '../store/actions/shopActions';
import { fetchInvoicesRequest } from '../store/actions/invoiceActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { myColors } from '../config/theme';

type ShopScreenRouteProp = RouteProp<RootStackParamList, 'Shop'>;

type Props = {
    route: ShopScreenRouteProp;
};

const ShopScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const shop = useSelector((state: RootState) => state.shops.shop);
    const invoicesState = useSelector((state: RootState) => state.invoices);
    const [editMode, setEditMode] = useState(false);
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchShopRequest(shopId));
        dispatch(fetchInvoicesRequest(shopId));
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

    useEffect(() => {
        if (!editMode && shop) {
            setShopName(shop.shopName);
            setAddress(shop.address);
        }
    }, [editMode, shop]);

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

    const renderInvoiceItem = ({ item }: { item: any }) => (
        <Card mode={"elevated"} elevation={0} onPress={() => navigation.navigate('ViewInvoice', { invoice: item })}>
            <Card.Content>
                <Card.Title
                    title={`Invoice ID: ${item.invoiceId}`}
                    subtitle={`Amount: ${item.amount}\nDetails: ${item.details}`}
                    // left={(props) => <MaterialIcons name="description" size={24} color="black" />}
                    right={(props) => <MaterialIcons name="chevron-right" size={24} color="black" />}

                />
            </Card.Content>
        </Card>
    );

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchShopRequest(shopId));
        dispatch(fetchInvoicesRequest(shopId));
        setRefreshing(false);
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="store" />} onPress={() => { }} />
                <Appbar.Content title="My Store" />
            </Appbar.Header>
            <View style={styles.container}>
                <Card mode={"elevated"} elevation={0}>
                    <Card.Title title="Store Details" subtitle="Update your shop name and address" />
                    <Card.Content >
                        <TextInput
                            label="Shop Name"
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
                    {editMode ? 'Save Changes' : 'Update Store'}
                </Button>
                <Button mode="contained" onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
                    Delete
                </Button>
                <Divider />
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
                        style={styles.list}
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
        marginLeft: 10,
        marginRight: 10

    },
    deleteButton: {
        backgroundColor: myColors.colors.errorContainer,
    },
    card: {
        marginBottom: 10,
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
    list: {

    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default ShopScreen;
