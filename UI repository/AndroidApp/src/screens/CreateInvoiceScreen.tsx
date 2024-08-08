import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Appbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { createInvoiceRequest } from '../store/actions/invoiceActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type CreateInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

type Props = {
    route: CreateInvoiceScreenRouteProp;
};

const CreateInvoiceScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const [details, setDetails] = useState('');
    const [amount, setAmount] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleCreateInvoice = () => {
        if (user?.userId) {
            const payload = {
                shopId,
                userId: user.userId,
                details,
                amount,
            };
            dispatch(createInvoiceRequest(payload));
            navigation.goBack();
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="create" />} onPress={() => { }} />
                <Appbar.Content title="Create Invoice" />
            </Appbar.Header>
            <View style={styles.container}>
                <TextInput
                    label="Item or Service name"
                    value={details}
                    mode={"outlined"}
                    onChangeText={setDetails}
                    style={styles.input}
                />
                <TextInput
                    label="Amount"
                    value={amount}
                    mode={"outlined"}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <Button mode={'elevated'} onPress={handleCreateInvoice} style={styles.button}>
                    Create new Invoice
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

export default CreateInvoiceScreen;
