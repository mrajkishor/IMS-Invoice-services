import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Appbar, IconButton, Menu, Text, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { createInvoiceRequest } from '../store/actions/invoiceActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconProps } from 'react-native-vector-icons/Icon';

type CreateInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

type Props = {
    route: CreateInvoiceScreenRouteProp;
};

const statusOptions = ['Unpaid', 'Pending', 'Paid', 'Overdue', 'Partially Paid', 'Cancelled', 'Disputed', 'Draft', 'Processing'];

const CreateInvoiceScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [date, setDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [details, setDetails] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');
    const [templateId, setTemplateId] = useState<string | null>("1");
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const user = useSelector((state: RootState) => state.auth.user);

    const validateFields = () => {
        if (!customerName || customerName.length > 50) {
            setErrorMessage('Customer Name is required and should be a maximum of 50 characters long.');
            setShowSnackbar(true);
            return false;
        }
        if (!customerAddress || customerAddress.length > 100) {
            setErrorMessage('Customer Address is required and should be a maximum of 100 characters long.');
            setShowSnackbar(true);
            return false;
        }
        const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        if (!date || !dateRegex.test(date)) {
            setErrorMessage('Date is required and should be in the format YYYY-MM-DD HH:MM.');
            setShowSnackbar(true);
            return false;
        }
        if (!dueDate || !dateRegex.test(dueDate)) {
            setErrorMessage('Due Date is required and should be in the format YYYY-MM-DD HH:MM.');
            setShowSnackbar(true);
            return false;
        }
        if (new Date(dueDate) < new Date(date)) {
            setErrorMessage('Due Date should be the same or after the Invoice Date.');
            setShowSnackbar(true);
            return false;
        }
        if (!details || details.length > 300) {
            setErrorMessage('Item or Service Description is required and should be a maximum of 300 characters long.');
            setShowSnackbar(true);
            return false;
        }
        if (!amount || isNaN(Number(amount))) {
            setErrorMessage('Amount is required and should be a valid number.');
            setShowSnackbar(true);
            return false;
        }
        if (!status) {
            setErrorMessage('Please select a payment status.');
            setShowSnackbar(true);
            return false;
        }
        return true;
    };

    const handleCreateInvoice = () => {
        if (validateFields() && user?.userId) {
            const payload = {
                shopId,
                userId: user.userId,
                customerName,
                customerAddress,
                invoiceDate: date,
                dueDate,
                details,
                amount,
                status,
                templateId
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

    const handleSetTodayDueDate = () => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
        setDueDate(formattedDate);
    };

    const openTemplateSelector = () => {
        navigation.navigate('TemplateSelector', {
            templateId,
            onSelect: (selectedTemplateId: string) => {
                setTemplateId(selectedTemplateId);
            },
        });
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Action icon={(props: React.JSX.IntrinsicAttributes & React.JSX.IntrinsicClassAttributes<MaterialIcons> & Readonly<IconProps>) => <MaterialIcons {...props} name="create" />} onPress={() => { }} />
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
                        icon={() => <MaterialIcons name="today" size={24} color="black" />}
                        size={20}
                        onPress={handleSetTodayDate}
                    />
                </View>
                <View style={styles.dateContainer}>
                    <TextInput
                        label="Due Date"
                        value={dueDate}
                        mode="outlined"
                        onChangeText={setDueDate}
                        style={[styles.input, styles.dateInput]}
                    />
                    <IconButton
                        icon={() => <MaterialIcons name="today" size={24} color="black" />}
                        size={20}
                        onPress={handleSetTodayDueDate}
                    />
                </View>
                <TextInput
                    label="Item or Service Description"
                    value={details}
                    mode="outlined"
                    onChangeText={setDetails}
                    style={styles.input}
                    maxLength={300}
                />
                <TextInput
                    label="Amount"
                    value={amount}
                    mode="outlined"
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <View>
                    <Button mode="outlined" onPress={() => setStatusMenuVisible(true)}>
                        Select Status
                    </Button>
                    <Menu
                        visible={statusMenuVisible}
                        onDismiss={() => setStatusMenuVisible(false)}
                        anchor={
                            <Text style={styles.preview} variant="bodyMedium">
                                {status ? `Payment Status : ${status}` : "Please select a payment status"}
                            </Text>
                        }
                    >
                        {statusOptions.map((option) => (
                            <Menu.Item
                                key={option}
                                onPress={() => {
                                    setStatus(option);
                                    setStatusMenuVisible(false);
                                }}
                                title={option}
                            />
                        ))}
                    </Menu>
                </View>
                <Button mode={"elevated"} onPress={openTemplateSelector} style={styles.button}>
                    Select Template ({templateId})
                </Button>
                <Button mode={"contained"} onPress={handleCreateInvoice} style={styles.button}>
                    Create Invoice
                </Button>

            </View>
            <Snackbar
                visible={showSnackbar}
                onDismiss={() => setShowSnackbar(false)}
                duration={3000}
                action={{
                    label: 'Dismiss',
                    onPress: () => {
                        setShowSnackbar(false);
                    },
                }}>
                {errorMessage}
            </Snackbar>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30
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
    button: {
        marginTop: 10,
    },
    preview: {
        margin: 10
    }
});

export default CreateInvoiceScreen;
