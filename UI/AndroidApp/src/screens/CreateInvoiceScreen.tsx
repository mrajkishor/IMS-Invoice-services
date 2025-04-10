import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Appbar, IconButton, Menu, Text, Snackbar, Divider, RadioButton, Portal, Dialog, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { createInvoiceRequest, updateInvoiceRequest } from '../store/actions/invoiceActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconProps } from 'react-native-vector-icons/Icon';
import { myColors } from '../config/theme';
import LinearGradient from 'react-native-linear-gradient';
import { fetchShopRequest } from '../store/actions/shopActions';
import { fetchUserRequest } from '../store/actions/userActions';
import TemplateSelector from '../components/TemplateSelector';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { fetchInvoicesRequest } from '../store/actions/invoiceActions';


type CreateInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

type Props = {
    route: CreateInvoiceScreenRouteProp;
};

const statusOptions = [
    'Draft',
    // 'Processing',
    'Unpaid',
    // 'Partially Paid',
    // 'Overdue',
    'Paid',
    // 'Disputed',
    // 'Cancelled',
];


const isCreateMode = (params: any): params is { shopId: string; mode: 'create' } => params.mode === 'create';
const isEditMode = (params: any): params is { invoice: any; mode: 'edit' } => params.mode === 'edit';




const CreateInvoiceScreen: React.FC<Props> = ({ route }) => {
    const dispatch = useDispatch();

    let shopId: string;
    let invoice: any | undefined;
    let mode: 'create' | 'edit' = 'create';

    if (route.params.mode === "create") {
        ({ shopId, mode } = route.params);
    } else if (route.params.mode === "edit") {
        ({ invoice, mode } = route.params);
        shopId = invoice?.shopId;
    }

    // Customer Info
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');


    // Invoice Creator Info
    const [creatorName, setCreatorName] = useState('');
    const [signaturePhoto, setSignaturePhoto] = useState('');
    const [signatureInWords, setSignatureInWords] = useState('');
    const [designation, setDesignation] = useState('');

    // Payment Method Info
    const [isCash, setIsCash] = useState(true);
    const [isUPI, setIsUPI] = useState(false);
    const [isBank, setIsBank] = useState(false);
    const [upiList, setUpiList] = useState(['']);
    const [bankAccountHolderName, setBankAccountHolderName] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);



    // Business Info
    const [businessName, setBusinessName] = useState<string | null>(null);
    const [businessEmail, setBusinessEmail] = useState<string | null>(null);
    const [businessMobile, setBusinessMobile] = useState<string | null>(null);
    const [businessAddress, setBusinessAddress] = useState<string | null>(null);
    const [businessLogo, setBusinessLogo] = useState<string | null>(null);
    const [businessSlogan, setBusinessSlogan] = useState<string | null>(null);

    const authState = useSelector((state: RootState) => state.auth);
    const userState = useSelector((state: RootState) => state.users);
    const { user } = authState;
    const { user: fetchedUser } = userState;

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchUserRequest(user.userId));
        }
    }, [dispatch, user?.userId]);

    useEffect(() => {
        if (fetchedUser) {
            setCreatorName(fetchedUser.fullName || '');
            setSignatureInWords(fetchedUser.signatureInWords || '');
            setDesignation(fetchedUser.designation || '');
            if (fetchedUser.signaturePhoto) {
                setSignaturePhoto(fetchedUser.signaturePhoto);
            }
        }
    }, [fetchedUser]);

    const shop = useSelector((state: RootState) => state.shops.shop);

    useEffect(() => {
        if (shopId) {
            dispatch(fetchShopRequest(shopId)); // Fetch the shop details
        }
    }, [dispatch, shopId]);



    const getFormattedDate = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (shop) {
            setBusinessName(shop.shopName);
            setBusinessEmail(shop.email);
            setBusinessMobile(shop.mobile);
            setBusinessAddress(shop.address);
            setBusinessLogo(shop.logo);
            setBusinessSlogan(shop.slogan);
        }
    }, [shop]);

    // Invoice Info
    const [date, setDate] = useState(getFormattedDate());
    const [dueDate, setDueDate] = useState(getFormattedDate());
    const [status, setStatus] = useState('Draft');
    const [partialPaymentAmount, setPartialPaymentAmount] = useState('');
    const [templateId, setTemplateId] = useState<string | null>("1");
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDueDatePickerVisible, setDueDatePickerVisibility] = useState(false);

    // Table 
    const [columns, setColumns] = useState(['Description', 'unitPrice', 'QTY', 'Total']);
    const [values, setValues] = useState([['', '', '', '']]);
    const [maxColLimit, setMaxColLimit] = useState(6);
    const totalableIndex = columns.length - 1; // Always set the last column as 'Total'



    // Summary Info
    const [subTotal, setSubTotal] = useState('');
    const [taxEnabled, setTaxEnabled] = useState(false);
    const [isTaxPercentage, setIsTaxPercentage] = useState(true);
    const [taxValue, setTaxValue] = useState('');
    const [discountEnabled, setDiscountEnabled] = useState(false);
    const [isDiscountPercentage, setIsDiscountPercentage] = useState(true);
    const [discountValue, setDiscountValue] = useState('');
    const [total, setTotal] = useState('');

    // Terms & Services Info
    const [useDefaultTerms, setUseDefaultTerms] = useState(true);
    const [termsEnabled, setTermsEnabled] = useState(false);
    const [useCustomMessage, setUseCustomMessage] = useState(false);
    const [customTermsMessage, setCustomTermsMessage] = useState("Please send payment within 30 days of receiving this invoice. There will be 10% interest charge per month on late invoice.");
    const defaultMessage = "Please send payment within {##}time{##} days of receiving this invoice";
    const [termsDays, setTermsDays] = useState('30');

    const [thankYouNote, setThankYouNote] = useState('Thank you for choosing us!');
    const [customMessage, setCustomMessage] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [bankIfscCode, setBankIfscCode] = useState('');
    const [bankBranchName, setBankBranchName] = useState('');


    // for international bank transfer
    const [isInternational, setIsInternational] = useState(false);
    const [swiftCode, setSwiftCode] = useState('');
    const [bankCountry, setBankCountry] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');



    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    // const user = useSelector((state: RootState) => state.auth.user);


    const handleTemplateSelect = (selectedTemplateId: string) => {
        setTemplateId(selectedTemplateId);
    };



    useEffect(() => {
        if (route.params.mode === 'edit' && invoice) {
            // Populate state variables with existing invoice data
            setCustomerName(invoice?.billedTo?.customer?.name || '');
            setCustomerPhone(invoice?.billedTo?.customer?.phone || '');
            setCustomerEmail(invoice?.billedTo?.customer?.email || '');
            setCustomerAddress(invoice?.billedTo?.customer?.address || '');

            setDate(invoice?.invoiceDateTimeStamp || '');
            setDueDate(invoice?.dueDateTimeStamp || '');
            setStatus(invoice?.paymentStatus || '');

            setCreatorName(invoice?.invoiceCreator?.name || '');
            setSignaturePhoto(invoice?.invoiceCreator?.signaturePhoto || '');
            setSignatureInWords(invoice?.invoiceCreator?.signatureInWords || '');
            setDesignation(invoice?.invoiceCreator?.designation || '');

            setIsCash(invoice?.paymentMethod?.isCash || false);
            setIsUPI(invoice?.paymentMethod?.isUPI || false);
            setIsBank(invoice?.paymentMethod?.isBank || false);
            setUpiList(invoice?.paymentMethod?.Upis || ['']);
            setBankAccountHolderName(invoice?.paymentMethod?.bank?.accountHolderName || '');
            setBankAccountNumber(invoice?.paymentMethod?.bank?.accountNumber || '');

            setBusinessName(invoice?.business?.name || '');
            setBusinessEmail(invoice?.business?.email || '');
            setBusinessMobile(invoice?.business?.mobile || '');
            setBusinessAddress(invoice?.business?.address || '');
            setBusinessLogo(invoice?.business?.logo || '');
            setBusinessSlogan(invoice?.business?.slogan || '');

            setColumns(invoice?.invoiceTable?.columns || ['Description', 'Unit Price', 'QTY', 'Total']);
            setValues(invoice?.invoiceTable?.value || [['', '', '', '']]);
            // setTotalableIndex(invoice?.invoiceTable?.totalableIndex || 3);

            setSubTotal(invoice?.subTotal || '');
            setTaxEnabled(invoice?.tax?.isTaxable || false);
            setIsTaxPercentage(invoice?.tax?.percentage?.endsWith('%') || true);
            setTaxValue(invoice?.tax?.amount || '');

            setDiscountEnabled(invoice?.packageDiscount?.amount !== '');
            setIsDiscountPercentage(invoice?.packageDiscount?.percentage?.endsWith('%') || true);
            setDiscountValue(invoice?.packageDiscount?.amount || '');

            setTotal(invoice?.total || '');
            setThankYouNote(invoice?.thankYouNote || 'Thank you for choosing us!');
            setTermsEnabled(invoice?.termsNServicesMessage?.toShow || false);
            setUseDefaultTerms(invoice?.termsNServicesMessage?.showDefaultMsg || true);
            setCustomMessage(invoice?.termsNServicesMessage?.customMessage || '');
        }
    }, [mode, invoice]);



    const validateFields = () => {
        if (!customerName || customerName.length > 50) {
            setErrorMessage('Customer Name is required and should be a maximum of 50 characters long.');
            setShowSnackbar(true);
            return false;
        }

        // Flexible validation for phone numbers allowing all country codes
        const phoneRegex = /^[+\d][\d\s()-]{5,20}$/; // Supports digits, spaces, parentheses, dashes, and "+", between 6-20 characters
        if (!customerPhone || !phoneRegex.test(customerPhone)) {
            setErrorMessage('Customer Phone must be a valid phone number (e.g., +123456789 or 123-456-789).');
            setShowSnackbar(true);
            return false;
        }

        if (!customerAddress || customerAddress.length > 100) {
            setErrorMessage('Customer Address is required and should be a maximum of 100 characters long.');
            setShowSnackbar(true);
            return false;
        }
        // const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!date || !dateRegex.test(date)) {
            // setErrorMessage('Date is required and should be in the format YYYY-MM-DD HH:MM.');
            setErrorMessage('Date is required and should be in the format YYYY-MM-DD.');
            setShowSnackbar(true);
            return false;
        }
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


        if (!status) {
            setErrorMessage('Please select a payment status.');
            setShowSnackbar(true);
            return false;
        }


        // if (isBank) {
        //     if (!bankAccountHolderName) {
        //         setErrorMessage('Bank Account Holder Name is required.');
        //         setShowSnackbar(true);
        //         return false;
        //     }
        //     if (!bankAccountNumber) {
        //         setErrorMessage('Bank Account Number is required.');
        //         setShowSnackbar(true);
        //         return false;
        //     }
        //     if (!bankIfscCode) {
        //         setErrorMessage('IFSC Code is required.');
        //         setShowSnackbar(true);
        //         return false;
        //     }
        //     if (!bankBranchName) {
        //         setErrorMessage('Bank Branch Name is required.');
        //         setShowSnackbar(true);
        //         return false;
        //     }

        //     if (isInternational) {
        //         if (!swiftCode) {
        //             setErrorMessage('SWIFT Code is required for international payments.');
        //             setShowSnackbar(true);
        //             return false;
        //         }
        //         if (!bankCountry) {
        //             setErrorMessage('Bank Country is required for international payments.');
        //             setShowSnackbar(true);
        //             return false;
        //         }
        //         if (!recipientAddress) {
        //             setErrorMessage('Recipient Address is required for international payments.');
        //             setShowSnackbar(true);
        //             return false;
        //         }
        //     }
        // }





        return true;
    };

    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmDate = (selectedDate: Date) => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        setDate(formattedDate);
        hideDatePicker();
    };

    const showDueDatePicker = () => {
        setDueDatePickerVisibility(true);
    };

    const hideDueDatePicker = () => {
        setDueDatePickerVisibility(false);
    };


    const handleConfirmDueDate = (selectedDate: Date) => {
        const formattedDueDate = selectedDate.toISOString().split('T')[0];
        if (new Date(formattedDueDate) < new Date(date)) {
            setErrorMessage('Due date must be later than the invoice date.');
            setShowSnackbar(true);
        } else {
            setDueDate(formattedDueDate);
            setErrorMessage('');
        }
        hideDueDatePicker();
    };


    const handleCreateOrUpdateInvoice = () => {

        if (validateFields() && user?.userId) {
            const payload = {
                userId: user.userId,
                shopId,
                billedTo: {
                    customer: {
                        name: customerName,
                        phone: customerPhone,
                        email: customerEmail,
                        address: customerAddress
                    }
                },
                invoiceCreator: {
                    name: creatorName,
                    signaturePhoto,
                    signatureInWords,
                    designation
                },
                paymentMethod: {
                    isCash,
                    isUPI,
                    isBank,
                    UpisMaxLimit: 3,
                    Upis: upiList.filter((upi) => upi !== ''), // Filtering out empty UPIs
                    bank: {
                        accountHolderName: bankAccountHolderName,
                        accountNumber: bankAccountNumber,
                        ifscCode: bankIfscCode,
                        branchName: bankBranchName,
                        swiftCode: isInternational ? swiftCode : undefined,
                        country: isInternational ? bankCountry : undefined,
                        recipientAddress: isInternational ? recipientAddress : undefined
                    }
                },
                business: {
                    name: businessName,
                    email: businessEmail,
                    mobile: businessMobile,
                    address: businessAddress,
                    logo: businessLogo,
                    slogan: businessSlogan
                },
                invoiceDateTimeStamp: date,
                dueDateTimeStamp: dueDate,
                paymentStatus: status,
                invoiceTemplateId: templateId,
                invoiceTable: {
                    maxColLimit,
                    columns,
                    value: values,
                    totalableIndex
                },
                subTotal,
                tax: {
                    isTaxable: taxEnabled,
                    amount: taxValue,
                    percentage: isTaxPercentage ? taxValue + "%" : "0%"
                },
                packageDiscount: {
                    amount: discountValue,
                    percentage: isDiscountPercentage ? discountValue + "%" : "0%"
                },
                partialPaymentAmount,
                total,
                thankYouNote,
                termsNServicesMessage: {
                    toShow: termsEnabled,
                    showDefaultMsg: useDefaultTerms,
                    defaultMessage,
                    customMessage
                }
            };
            // mode === 'edit' ?
            //     dispatch(updateInvoiceRequest(invoice.invoiceId, payload)) :
            //     dispatch(createInvoiceRequest(payload));
            if (mode === 'edit') {
                dispatch(updateInvoiceRequest(invoice?.invoiceId, payload));
                setShowSnackbar(true);
                setErrorMessage("Invoice successfully updated!");
            } else {
                dispatch(createInvoiceRequest(payload));
                setShowSnackbar(true);
                setErrorMessage("Invoice successfully created!");
            }

            // Refetch the list after successful creation or update
            // if (mode === 'create') {
            //     setTimeout(() => {
            //         dispatch(fetchInvoicesRequest(shopId));
            //     }, 500); // Adjust the delay as necessary
            // }
            // navigation.goBack();
            // Optionally clear fields after successful creation

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
    const addUpiField = () => {
        if (upiList.length < 3) {
            setUpiList([...upiList, '']);
        }
    };

    // Function to add a new column
    const addColumn = () => {
        if (columns.length < maxColLimit - 1) { // Reserve the last column for 'Total'
            const newColumnName = `Column ${columns.length}`;
            const updatedColumns = [...columns];
            updatedColumns.splice(columns.length - 1, 0, newColumnName); // Add before 'Total'
            setColumns(updatedColumns);

            const updatedValues = values.map((row) => {
                const updatedRow = [...row];
                updatedRow.splice(row.length - 1, 0, ''); // Add an empty cell before 'Total'
                return updatedRow;
            });
            setValues(updatedValues);
        } else {
            setErrorMessage(`Cannot add more than ${maxColLimit - 1} columns`);
            setShowSnackbar(true);
        }
    };



    const addRow = () => {
        setValues((prevValues) => {
            const newRow = Array(columns.length).fill(''); // Create a new row based on current column length
            return [...prevValues, newRow]; // Add the new row to the previous values safely
        });
    };

    const updateSubTotal = () => {
        const subtotalValue = values.reduce((acc, row) => {
            const cellValue = parseFloat(row[totalableIndex]) || 0;
            return acc + cellValue;
        }, 0);
        setSubTotal(subtotalValue.toString());
    };

    // Disable delete functionality for the 'Total' column
    const deleteColumn = (index: number) => {
        if (columns[index] === 'Total') {
            setErrorMessage('The "Total" column cannot be deleted.');
            setShowSnackbar(true);
            return;
        }
        const updatedColumns = [...columns];
        updatedColumns.splice(index, 1);
        setColumns(updatedColumns);

        const updatedValues = values.map((row) => {
            const updatedRow = [...row];
            updatedRow.splice(index, 1);
            return updatedRow;
        });
        setValues(updatedValues);
    };



    const deleteRow = (index: number) => {
        // Remove the row at the specified index
        const updatedValues = [...values];
        updatedValues.splice(index, 1); // Delete the row

        setValues(updatedValues); // Update the state with new values

        // Recalculate the subtotal after deleting the row
        const subtotalValue = updatedValues.reduce((acc, row) => {
            const cellValue = parseFloat(row[totalableIndex]) || 0;
            return acc + cellValue;
        }, 0);

        setSubTotal(subtotalValue.toString()); // Update the subtotal after row deletion
    };


    // Calling updateSubTotal whenever totalableIndex changes
    useEffect(() => {
        updateSubTotal();
    }, [values]);

    // Function to calculate total (subtotal + tax - discount)
    const updateTotal = () => {
        const subtotalValue = parseFloat(subTotal) || 0;

        // Tax Calculation
        let taxAmount = 0;
        if (taxEnabled && taxValue) {
            taxAmount = isTaxPercentage
                ? (subtotalValue * parseFloat(taxValue)) / 100
                : parseFloat(taxValue);
        }

        // Discount Calculation
        let discountAmount = 0;
        if (discountEnabled && discountValue) {
            discountAmount = isDiscountPercentage
                ? (subtotalValue * parseFloat(discountValue)) / 100
                : parseFloat(discountValue);
        }

        // Calculate total (subtotal + tax - discount)
        const totalValue = subtotalValue + taxAmount - discountAmount;

        if (status === 'Partially Paid' && partialPaymentAmount) {
            const remainingBalance = totalValue - parseFloat(partialPaymentAmount);
            if (remainingBalance < 0) {
                setErrorMessage('Partial payment cannot exceed the total amount.');
                setShowSnackbar(true);
            } else {
                setTotal(remainingBalance.toString());
            }
        } else {
            setTotal(totalValue.toString());
        }

    };

    // Use effect to recalculate total when tax, subtotal, or discount changes
    useEffect(() => {
        updateTotal();
    }, [taxEnabled, taxValue, isTaxPercentage, subTotal, discountEnabled, discountValue, partialPaymentAmount, isDiscountPercentage]);


    // Function to replace placeholders in the default message
    const getProcessedDefaultMessage = () => {
        const days = Math.round((new Date(dueDate).getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));
        {
            days === 0
                ? "Payment is due immediately upon receiving this invoice."
                : `Please send payment within ${days} days of receiving this invoice.`
        }
        return defaultMessage.replace('{##}time{##}', days.toString());
    };

    useEffect(() => {
        if (useDefaultTerms) {
            const days = Math.round((new Date(dueDate).getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));
            const updatedMessage = days === 0
                ? "Payment is due immediately upon receiving this invoice."
                : `Please send payment within ${days} days of receiving this invoice.`;
            setCustomMessage(updatedMessage); // Update the default message dynamically
        }
    }, [dueDate, date, useDefaultTerms]);

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Action icon={(props) => <MaterialIcons {...props} name="create" />} onPress={() => { }} />
                <Appbar.Content title={`${mode === "edit" ? "Edit" : "Create"} Invoice`} />
            </Appbar.Header>
            <ScrollView style={styles.container}>
                {/* Customer Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Information</Text>
                    <TextInput mode="outlined" label="Customer Name*" value={customerName} onChangeText={setCustomerName} style={styles.input} />
                    <TextInput mode="outlined" label="Customer Phone*" value={customerPhone} onChangeText={setCustomerPhone} style={styles.input} />
                    <TextInput mode="outlined" label="Customer Email" value={customerEmail} onChangeText={setCustomerEmail} style={styles.input} />
                    <TextInput mode="outlined" label="Customer Address*" value={customerAddress} onChangeText={setCustomerAddress} style={styles.input} />
                </View>
                {/* <Divider /> */}
                {/* Invoice Creator Information Section */}
                {/* <Text style={styles.sectionTitle}>Your Information</Text>

                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Full Name:</Text>
                    <Text>{creatorName || fetchedUser?.fullName || "Not Provided"}</Text>
                </View>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Signature Photo:</Text>
                    {signaturePhoto || fetchedUser?.signaturePhoto ? (
                        <Image
                            source={{ uri: signaturePhoto || fetchedUser?.signaturePhoto }}
                            style={styles.imagePreview}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text>Not Provided</Text>
                    )}
                </View>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Signature In Words:</Text>
                    <Text>{signatureInWords || fetchedUser?.signatureInWords || "Not Provided"}</Text>
                </View>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Designation:</Text>
                    <Text>{designation || fetchedUser?.designation || "Not Provided"}</Text>
                </View>

                <Button style={styles.updateInfoLink}
                    mode="outlined"
                    onPress={() => navigation.navigate('Profile')}>
                    Update Your Information
                </Button>

                <Divider /> */}
                {/* Payment Method Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method*</Text>
                    <View style={styles.switchRow}>
                        <Text>Cash Payment</Text>
                        <Switch value={isCash} onValueChange={setIsCash} />
                    </View>
                    <View style={styles.switchRow}>
                        <Text>UPI Payment</Text>
                        <Switch value={isUPI} onValueChange={setIsUPI} />
                    </View>
                    {isUPI && (
                        <>
                            {upiList.map((upi, index) => (
                                <TextInput
                                    key={index}
                                    label={`UPI ${index + 1}`}
                                    value={upi}
                                    onChangeText={(text) => {
                                        const updatedUpis = [...upiList];
                                        updatedUpis[index] = text;
                                        setUpiList(updatedUpis);
                                    }}
                                    style={styles.input}
                                />
                            ))}
                            {upiList.length < 3 && <Button onPress={addUpiField}>Add UPI</Button>}
                        </>
                    )}
                    <View style={styles.switchRow}>
                        <Text>Bank Payment</Text>
                        <Switch value={isBank} onValueChange={setIsBank} />
                    </View>
                    {isBank && (
                        <>
                            <TextInput mode="outlined" label="Account Holder Name" value={bankAccountHolderName} onChangeText={setBankAccountHolderName} style={styles.input} />
                            <TextInput mode="outlined" label="Account Number" value={bankAccountNumber} onChangeText={setBankAccountNumber} style={styles.input} />
                            <TextInput
                                mode="outlined"
                                label="IFSC Code"
                                value={bankIfscCode}
                                onChangeText={setBankIfscCode}
                                style={styles.input}
                            />
                            <TextInput
                                mode="outlined"
                                label="Bank Branch Name"
                                value={bankBranchName}
                                onChangeText={setBankBranchName}
                                style={styles.input}
                            />


                            <Divider />

                            <View style={styles.switchRow}>
                                <Text>International Payment</Text>
                                <Switch value={isInternational} onValueChange={setIsInternational} />
                            </View>

                            {isInternational && (
                                <>
                                    <TextInput
                                        mode="outlined"
                                        label="SWIFT Code"
                                        value={swiftCode}
                                        onChangeText={setSwiftCode}
                                        style={styles.input}
                                    />
                                    <TextInput
                                        mode="outlined"
                                        label="Bank Country"
                                        value={bankCountry}
                                        onChangeText={setBankCountry}
                                        style={styles.input}
                                    />
                                    <TextInput
                                        mode="outlined"
                                        label="Recipient Address"
                                        value={recipientAddress}
                                        onChangeText={setRecipientAddress}
                                        style={styles.input}
                                    />
                                </>
                            )}


                        </>
                    )}
                </View>
                {/* <Divider /> */}
                {/* Business Information Section (Read-Only) */}
                {/* <Text style={styles.sectionTitle}>Business Information</Text>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Business Name:</Text>
                    <Text>{businessName || "Not Provided"}</Text>
                </View>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Business Email:</Text>
                    <Text>{businessEmail || "Not Provided"}</Text>
                </View>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Business Mobile:</Text>
                    <Text>{businessMobile || "Not Provided"}</Text>
                </View>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Business Address:</Text>
                    <Text>{businessAddress || "Not Provided"}</Text>
                </View>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Business Logo:</Text>
                    {businessLogo ? (
                        <Image
                            source={{ uri: businessLogo }}
                            style={styles.imagePreview}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text>Not Provided</Text>
                    )}
                </View>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.readOnlyLabel}>Business Slogan:</Text>
                    <Text>{businessSlogan || "Not Provided"}</Text>
                </View>

                <Button style={styles.updateInfoLink}
                    mode="outlined"
                    onPress={() => navigation.navigate('Shop', { shopId, initialTab: 'business' })}>
                    Update Business Information
                </Button>



                <Divider /> */}
                {/* Invoice Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Invoice Information</Text>
                    <View style={styles.dateContainer}>
                        <TextInput mode="outlined" label="Invoice Date*" value={date} onChangeText={setDate} style={[styles.input, styles.dateInput]} />
                        <IconButton icon={() => <MaterialIcons name="today" size={24} color="black" />} onPress={showDatePicker} />
                    </View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={hideDatePicker}
                    />
                    <View style={styles.dateContainer}>
                        <TextInput mode="outlined" label="Due Date*" value={dueDate} onChangeText={setDueDate} style={[styles.input, styles.dateInput]} />
                        <IconButton icon={() => <MaterialIcons name="today" size={24} color="black" />} onPress={showDueDatePicker} />
                    </View>
                    <DateTimePickerModal
                        isVisible={isDueDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDueDate}
                        onCancel={hideDueDatePicker}
                    />

                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                            <Dialog.Title>Invoice Status Information</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>
                                    <Text style={{ fontWeight: 'bold' }}>Draft:</Text> The invoice is still being prepared and has not yet been issued. You will be able to edit any time the invoice details until it is issued.
                                </Paragraph>
                                {/* <Paragraph>
                                    <Text style={{ fontWeight: 'bold' }}>Processing:</Text> The invoice is currently being processed, such as being reviewed or approved.
                                </Paragraph> */}
                                <Paragraph>
                                    <Text style={{ fontWeight: 'bold' }}>Unpaid:</Text> The invoice has been issued but the payment has not yet been received.
                                </Paragraph>
                                {/* <Paragraph> I will try to activate it later if i see user increasing .. else close this case here
                                    <Text style={{ fontWeight: 'bold' }}>Partially Paid:</Text> A partial payment has been received, but the full amount is still outstanding.
                                </Paragraph> */}
                                <Paragraph>
                                    <Text style={{ fontWeight: 'bold' }}>Overdue:</Text> The payment due date has passed and the invoice has not been paid. The status will be set automatically from unpaid to overdue based on the due date. You can change to paid once the payment is received.
                                </Paragraph>
                                <Paragraph>
                                    <Text style={{ fontWeight: 'bold' }}>Paid:</Text> The payment for the invoice has been received in full.
                                </Paragraph>
                                {/* <Paragraph> park as of now, need to discuss later. Dispute is generally raised from customer side. Once dispute is raised that has to resolved from shop keeper side with statuses (pending review -> resolved -> escalated). Once resolved the status of invoice status will be paid
                                <Text style={{ fontWeight: 'bold' }}>Disputed:</Text> There is a disagreement or issue with the invoice that needs to be resolved.
                            </Paragraph> */}
                                {/* <Paragraph>
                                    <Text style={{ fontWeight: 'bold' }}>Cancelled:</Text> The invoice has been cancelled and no payment is expected.
                                </Paragraph> */}

                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Close</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>



                    {/* <Divider /> */}
                    {/* Payment Status and Template */}
                    <View>
                        <Menu
                            visible={statusMenuVisible}
                            onDismiss={() => setStatusMenuVisible(false)}
                            anchor={<Text style={styles.preview} variant="bodyMedium">{status ? `Payment Status: ${status}` : "Please select a payment status*"}</Text>}
                        >
                            {statusOptions.map((option) => (
                                <Menu.Item key={option} onPress={() => { setStatus(option); setStatusMenuVisible(false); }} title={option} />
                            ))}
                        </Menu>
                        <View style={{
                            display: `flex`,
                            flexDirection: `row`,
                        }}>
                            <IconButton style={{
                                margin: 10
                            }} icon="information-outline" size={24} onPress={showDialog} />

                            <Button style={{
                                margin: 10,
                                flex: 1,
                            }} mode="outlined" onPress={() => setStatusMenuVisible(true)}>
                                Select Status
                            </Button>

                        </View>



                    </View>

                    {/* <Divider /> */}
                    {/* <Text style={styles.preview} variant="bodyMedium">{"Select any invoice template."}</Text> */}
                    {/* Template selection */}
                    {/* <Button mode={"elevated"} onPress={openTemplateSelector} style={styles.button}>
                    Select Template ({templateId})
                </Button> */}

                    <TemplateSelector />



                </View>
                {/* <Divider /> */}
                {/* Invoice Table Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Item Attributes</Text>
                    {/* 
                    <TextInput
                        label="Max Column Limit"
                        value={String(maxColLimit)}
                        mode="outlined"
                        disabled={true}
                        style={styles.input}
                    /> */}
                    <View style={styles.columnsContainer}>
                        {columns.map((col, index) => (
                            <View key={index} style={styles.columnRow}>
                                <TextInput
                                    label={`Column ${index + 1}`}
                                    value={col}
                                    mode="outlined"
                                    editable={col !== 'Total'} // Disable editing for 'Total'
                                    onChangeText={(text) => {
                                        const updatedColumns = [...columns];
                                        updatedColumns[index] = text;
                                        setColumns(updatedColumns);
                                    }}
                                    style={styles.columnInput}
                                />
                                {col !== 'Total' && (
                                    <IconButton
                                        icon="delete"
                                        onPress={() => deleteColumn(index)}
                                    />
                                )}
                            </View>
                        ))}
                        {columns.length < maxColLimit && (
                            <Button onPress={addColumn} mode="outlined">
                                Add New Attribute
                            </Button>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Add Items</Text>
                    {values.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.rowContainer}>
                            {columns.map((col, colIndex) => (
                                <TextInput
                                    key={colIndex}
                                    label={col}
                                    value={row[colIndex]}
                                    mode="outlined"
                                    onChangeText={(text) => {
                                        const updatedValues = [...values];
                                        updatedValues[rowIndex][colIndex] = text;
                                        setValues(updatedValues);
                                        if (colIndex === totalableIndex) {
                                            updateSubTotal();
                                        }
                                    }}
                                    style={styles.columnInput}
                                />
                            ))}
                            {/* Add delete button for row */}
                            <Button
                                mode="text" // This will remove the default background of the button
                                onPress={() => deleteRow(rowIndex)}
                                textColor={myColors.colors.onSecondary} // Change text color if needed
                                style={styles.transparentButton}
                            >
                                Delete
                            </Button>
                        </View>
                    ))}
                    <Button onPress={addRow} mode="outlined">
                        Add New Item
                    </Button>
                </View>
                {/* <Divider /> */}
                {/* Summary Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <TextInput disabled={true} mode="outlined"
                        label="SubTotal" value={subTotal} onChangeText={setSubTotal} keyboardType="numeric" style={styles.input} />

                    {/* <Divider /> */}
                    {/* Tax Section */}
                    <View style={styles.switchRow}>
                        <Text>Enable Tax</Text>
                        <Switch value={taxEnabled} onValueChange={setTaxEnabled} />
                    </View>

                    {taxEnabled && (
                        <>
                            <RadioButton.Group
                                onValueChange={(newValue) => setIsTaxPercentage(newValue === 'percentage')}
                                value={isTaxPercentage ? 'percentage' : 'amount'}
                            >
                                <View>
                                    <RadioButton.Item label="Percentage" value="percentage" />
                                    <RadioButton.Item label="Amount" value="amount" />
                                </View>
                            </RadioButton.Group>

                            <TextInput mode="outlined"
                                label={isTaxPercentage ? "Tax Percentage" : "Tax Amount"}
                                value={taxValue}
                                onChangeText={setTaxValue}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </>
                    )}

                    {/* <Divider /> */}
                    {/* Discount Section */}
                    <View style={styles.switchRow}>
                        <Text>Enable Discount</Text>
                        <Switch value={discountEnabled} onValueChange={setDiscountEnabled} />
                    </View>

                    {discountEnabled && (
                        <>
                            <RadioButton.Group
                                onValueChange={(newValue) => setIsDiscountPercentage(newValue === 'percentage')}
                                value={isDiscountPercentage ? 'percentage' : 'amount'}
                            >
                                <View>
                                    <RadioButton.Item label="Percentage" value="percentage" />
                                    <RadioButton.Item label="Amount" value="amount" />
                                </View>
                            </RadioButton.Group>

                            <TextInput mode="outlined"
                                label={isDiscountPercentage ? "Discount Percentage" : "Discount Amount"}
                                value={discountValue}
                                onChangeText={setDiscountValue}
                                keyboardType="numeric"
                                style={styles.input}
                            />

                        </>
                    )}

                    {status === 'Partially Paid' && (
                        <>
                            {/* <Text style={styles.label}>Partial Payment Amount</Text> */}
                            <TextInput
                                mode="outlined"
                                label={`Partial Payment Amount`}
                                value={partialPaymentAmount}
                                onChangeText={setPartialPaymentAmount}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </>
                    )}
                    <TextInput mode="outlined" disabled={true} label="Total" value={total} onChangeText={setTotal} keyboardType="numeric" style={styles.input} />
                    {/* <Divider /> */}
                    {/* Thank You and Terms Section */}
                    <TextInput mode="outlined" label="Thank You Note" value={thankYouNote} onChangeText={setThankYouNote} style={styles.input} />

                    {/* <Divider /> */}
                    {/* Terms and Services Section */}
                    <View style={styles.switchRow}>
                        <Text>Enable Terms and Services</Text>
                        <Switch value={termsEnabled} onValueChange={setTermsEnabled} />
                    </View>

                    {termsEnabled && (
                        <>
                            <RadioButton.Group
                                onValueChange={(newValue) => setUseDefaultTerms(newValue === 'default')}
                                value={useDefaultTerms ? 'default' : 'custom'}
                            >
                                <View style={styles.radioGroup}>
                                    <RadioButton.Item labelStyle={styles.radioGroupItem} label="Use Default Terms" value="default" />
                                    <RadioButton.Item labelStyle={styles.radioGroupItem} label="Use Custom Terms" value="custom" />
                                </View>
                            </RadioButton.Group>

                            {useDefaultTerms ? (
                                <Text style={styles.defaultMessageText}>
                                    {customMessage}
                                </Text>
                            ) : (
                                <TextInput mode="outlined"
                                    label="Custom Terms"
                                    value={customMessage}
                                    onChangeText={setCustomMessage}
                                    multiline
                                    style={styles.input}
                                />
                            )}
                        </>
                    )}

                </View>






                <View style={styles.spacer} />
            </ScrollView>
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.floatingBtn}
                onPress={handleCreateOrUpdateInvoice}
            >
                <LinearGradient
                    colors={[myColors.gradients.primaryGradient[0], myColors.gradients.primaryGradient[1], myColors.gradients.primaryGradient[0]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.buttonText}>
                        {mode === "edit" ? "Update Invoice" : "Create Invoice"}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

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
    floatingBtn: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 50,
        elevation: 10, // Add shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
    },
    gradientButton: {
        paddingVertical: 15,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        textTransform: 'uppercase',
    },
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: myColors.colors.background,
    },
    spacer: {
        height: 70, // Add space equivalent to the height of the button
    },
    input: {
        marginBottom: 10,
        backgroundColor: myColors.colors.surface,
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
        marginBottom: 20
    },
    preview: {
        margin: 10
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    section: {
        borderWidth: 1,
        borderColor: myColors.colors.onSecondary,
        borderRadius: 8,
        marginBottom: 20,
        marginTop: 20,
        position: 'relative',
        padding: 20,
        backgroundColor: myColors.colors.background,
    },
    sectionTitle: {
        position: 'absolute',
        top: -12,
        left: 20,
        backgroundColor: myColors.colors.background,
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: myColors.colors.onSecondary,
    },
    columnsContainer: {
        // marginBottom: 10,
        // marginTop: 10,
        // padding: 10,
        // borderWidth: 1,
        // borderColor: myColors.colors.onSecondary,
        // borderRadius: 5,
        // backgroundColor: myColors.colors.surface,
    },
    columnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    columnInput: {
        flex: 1,
    },
    rowContainer: {
        marginBottom: 10,
    },
    transparentButton: {
        backgroundColor: 'transparent', // Removing background
        borderWidth: 0,
        elevation: 0,
        padding: 0,
        marginTop: 10,
    },
    radioButtonInfo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: myColors.colors.onPrimary,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    radioGroup: {
        backgroundColor: myColors.colors.primaryContainer,
        borderRadius: 5,
    },
    radioGroupItem: {
        color: myColors.colors.onPrimary,
    },
    defaultMessageText: {
        fontSize: 16,
        color: myColors.colors.onSurface,
        marginVertical: 10,
        padding: 10,
        backgroundColor: myColors.colors.secondaryContainer,
        borderRadius: 5,
        textAlign: 'center',
    },
    readOnlyContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: myColors.colors.background,
        borderRadius: 5,
        borderColor: myColors.colors.surfaceVariant,
        borderWidth: 1,
    },
    readOnlyLabel: {
        fontWeight: 'bold',
        color: myColors.colors.onSecondary,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginTop: 10,
    },
    updateInfoLink: {
        marginBottom: 10
    },
});

export default CreateInvoiceScreen;
