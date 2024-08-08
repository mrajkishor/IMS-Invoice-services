import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Appbar, IconButton } from 'react-native-paper';
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
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [date, setDate] = useState('');
    const [dueDate, setDueDate] = useState('');
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
                invoiceNumber,
                customerName,
                customerAddress,
                date,
                dueDate,
                details,
                amount,
            };
            dispatch(createInvoiceRequest(payload));
            navigation.goBack();
        }
    };

    const handleSetTodayDate = () => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
        setDate(formattedDate);
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Action icon={(props) => <MaterialIcons {...props} name="create" />} onPress={() => { }} />
                <Appbar.Content title="Create Invoice" />
            </Appbar.Header>
            <View style={styles.container}>
                <TextInput
                    label="Customer Name"
                    value={customerName}
                    mode="outlined"
                    onChangeText={setCustomerName}
                    style={styles.input}
                />
                <TextInput
                    label="Customer Address"
                    value={customerAddress}
                    mode="outlined"
                    onChangeText={setCustomerAddress}
                    style={styles.input}
                />
                <View style={styles.dateContainer}>
                    <TextInput
                        label="Date"
                        value={date}
                        mode="outlined"
                        onChangeText={setDate}
                        style={[styles.input, styles.dateInput]}
                    />

                    <IconButton
                        icon={(props) => <MaterialIcons name="today" size={24} color="black" />}
                        size={20}
                        onPress={handleSetTodayDate}
                    />
                </View>
                <TextInput
                    label="Due Date"
                    value={dueDate}
                    mode="outlined"
                    onChangeText={setDueDate}
                    style={styles.input}
                />
                <TextInput
                    label="Item or Service Description"
                    value={details}
                    mode="outlined"
                    onChangeText={setDetails}
                    style={styles.input}
                />
                <TextInput
                    label="Amount"
                    value={amount}
                    mode="outlined"
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <Button mode={"elevated"} onPress={handleCreateInvoice} style={styles.button}>
                    Create Invoice
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
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateInput: {
        flex: 1,
    },
    todayButton: {
        marginLeft: 10
    },
    button: {
        marginTop: 10,
    },
});

export default CreateInvoiceScreen;
