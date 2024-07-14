import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { createInvoiceRequest } from '../store/actions/invoiceActions';

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
        <View style={styles.container}>
            <TextInput
                label="Details"
                value={details}
                onChangeText={setDetails}
                style={styles.input}
            />
            <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleCreateInvoice} style={styles.button}>
                Create Invoice
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
});

export default CreateInvoiceScreen;
