import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { createShopRequest } from '../store/actions/shopActions';
import { useNavigation } from '@react-navigation/native';
import { MainScreenNavigationProp } from 'navigationTypes';

const CreateShopScreen: React.FC = () => {
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<MainScreenNavigationProp>();

    const handleCreateShop = () => {
        if (user?.userId) {
            const payload = {
                shopName,
                ownerId: user.userId,
                address,
            };
            dispatch(createShopRequest(payload));
            navigation.navigate('Main');

        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Shop Name"
                value={shopName}
                onChangeText={setShopName}
                style={styles.input}
            />
            <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleCreateShop} style={styles.button}>
                Create Shop
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});

export default CreateShopScreen;
