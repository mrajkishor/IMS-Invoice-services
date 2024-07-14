import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { TextInput, Button, Card, List, ActivityIndicator, Text, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { fetchShopRequest, updateShopRequest, deleteShopRequest } from '../store/actions/shopActions';
import { fetchInvoicesRequest } from '../store/actions/invoiceActions';

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
        <Card style={styles.card} onPress={() => navigation.navigate('ViewInvoice', { invoice: item })}>
            <Card.Content>
                <List.Item
                    title={`Invoice ID: ${item.invoiceId}`}
                    description={`Amount: ${item.amount}\nDetails: ${item.details}`}
                    left={(props) => <List.Icon {...props} icon="file-document" />}
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
        <View style={styles.container}>
            <Card>
                <Card.Title title="Shop Details" />
                <Card.Content>
                    <TextInput
                        label="Shop Name"
                        value={shopName}
                        onChangeText={setShopName}
                        disabled={!editMode}
                        style={styles.input}
                    />
                    <TextInput
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        disabled={!editMode}
                        style={styles.input}
                    />
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                {editMode ? 'Save' : 'Update'}
            </Button>
            <Button mode="contained" onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
                Delete
            </Button>
            {invoicesState.loading ? (
                <ActivityIndicator animating={true} style={styles.loader} />
            ) : invoicesState.error ? (
                <Text style={styles.error}>{invoicesState.error}</Text>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
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
    list: {
        marginTop: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 80,
    },
});

export default ShopScreen;
