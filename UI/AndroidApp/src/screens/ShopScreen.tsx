import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { fetchShopRequest, updateShopRequest, deleteShopRequest } from '../store/actions/shopActions';

type ShopScreenRouteProp = RouteProp<RootStackParamList, 'Shop'>;

type Props = {
    route: ShopScreenRouteProp;
};

const ShopScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();
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
});

export default ShopScreen;
