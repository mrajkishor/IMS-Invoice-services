import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Appbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { createShopRequest } from '../store/actions/shopActions';
import { useNavigation } from '@react-navigation/native';
import { MainScreenNavigationProp } from 'navigationTypes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="create" />} onPress={() => { }} />
                <Appbar.Content title="Create Shop" />
            </Appbar.Header>
            <View style={styles.container}>
                <TextInput
                    label="Shop Name"
                    mode={"outlined"}
                    value={shopName}
                    onChangeText={setShopName}
                    style={styles.input}
                />
                <TextInput
                    mode={"outlined"}
                    label="Shop Address"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                />
                <Button mode={'elevated'} onPress={handleCreateShop} style={styles.button}>
                    Create new Shop
                </Button>
            </View>
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
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
