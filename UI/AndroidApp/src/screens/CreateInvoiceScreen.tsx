import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { TextInput, Button, Appbar, IconButton, Menu, Text, Snackbar, Divider, RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { createInvoiceRequest } from '../store/actions/invoiceActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconProps } from 'react-native-vector-icons/Icon';
import { myColors } from '../config/theme';
import LinearGradient from 'react-native-linear-gradient';


type CreateInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

type Props = {
    route: CreateInvoiceScreenRouteProp;
};

const statusOptions = ['Unpaid', 'Pending', 'Paid', 'Overdue', 'Partially Paid', 'Cancelled', 'Disputed', 'Draft', 'Processing'];

const CreateInvoiceScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
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
    const [isCash, setIsCash] = useState(false);
    const [isUPI, setIsUPI] = useState(false);
    const [isBank, setIsBank] = useState(false);
    const [upiList, setUpiList] = useState(['']);
    const [bankAccountHolderName, setBankAccountHolderName] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');


    // Business Info
    const [businessName, setBusinessName] = useState('');
    const [businessEmail, setBusinessEmail] = useState('');
    const [businessMobile, setBusinessMobile] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessLogo, setBusinessLogo] = useState('');
    const [businessSlogan, setBusinessSlogan] = useState('');

    // Invoice Info
    const [date, setDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [details, setDetails] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');
    const [templateId, setTemplateId] = useState<string | null>("1");
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);

    // Table 
    const [columns, setColumns] = useState(['Description', 'unitPrice', 'QTY', 'Total']);
    const [values, setValues] = useState([['', '', '', '']]);
    const [maxColLimit, setMaxColLimit] = useState(6);
    const [totalableIndex, setTotalableIndex] = useState(3); // Column index to calculate subtotal



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
                    upis: upiList,
                    bank: {
                        accountHolderName: bankAccountHolderName,
                        accountNumber: bankAccountNumber
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
                subTotal,
                tax: {
                    isTaxable: true,
                    amount: tax,
                    percentage: "1%"
                },
                packageDiscount: {
                    amount: discount,
                    percentage: "2%"
                },
                total,
                thankYouNote,
                termsNServicesMessage: {
                    toShow: true,
                    showDefaultMsg: false,
                    customMessage
                }
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
    const addUpiField = () => {
        if (upiList.length < 3) {
            setUpiList([...upiList, '']);
        }
    };

    // Function to add a new column
    const addColumn = () => {
        if (columns.length < maxColLimit) {
            // Add a new column name (you can customize the default name)
            const newColumnName = `Column ${columns.length + 1}`;
            setColumns([...columns, newColumnName]);

            // Add an empty value to each row in the 'values' array
            const updatedValues = values.map(row => [...row, '']);
            setValues(updatedValues);
        } else {
            setErrorMessage(`Cannot add more than ${maxColLimit} columns`);
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

    const deleteColumn = (index: number) => {
        // Remove the column from the columns array
        const updatedColumns = [...columns];
        updatedColumns.splice(index, 1); // Delete the column

        setColumns(updatedColumns); // Update the state with new columns

        // Remove the corresponding value in each row
        const updatedValues = values.map((row) => {
            const updatedRow = [...row];
            updatedRow.splice(index, 1); // Delete the value corresponding to the deleted column
            return updatedRow;
        });

        setValues(updatedValues); // Update the state with new values

        // If the deleted column was the one used for subtotal calculation, adjust the subtotal
        if (index === totalableIndex) {
            setTotalableIndex(0); // Default to first column or another valid column index
        }

        // Recalculate the subtotal after deleting the column
        const subtotalValue = updatedValues.reduce((acc, row) => {
            const cellValue = parseFloat(row[totalableIndex]) || 0;
            return acc + cellValue;
        }, 0);

        setSubTotal(subtotalValue.toString()); // Update the subtotal after column deletion
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
    }, [totalableIndex]);

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
        setTotal(totalValue.toString());
    };

    // Use effect to recalculate total when tax, subtotal, or discount changes
    useEffect(() => {
        updateTotal();
    }, [taxEnabled, taxValue, isTaxPercentage, subTotal, discountEnabled, discountValue, isDiscountPercentage]);


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
                <Appbar.Content title="Create Invoice" />
            </Appbar.Header>
            <ScrollView style={styles.container}>
                {/* Customer Information Section */}
                <Text style={styles.sectionTitle}>Customer Information</Text>
                <TextInput mode="outlined" label="Customer Name" value={customerName} onChangeText={setCustomerName} style={styles.input} />
                <TextInput mode="outlined" label="Customer Phone" value={customerPhone} onChangeText={setCustomerPhone} style={styles.input} />
                <TextInput mode="outlined" label="Customer Email" value={customerEmail} onChangeText={setCustomerEmail} style={styles.input} />
                <TextInput mode="outlined" label="Customer Address" value={customerAddress} onChangeText={setCustomerAddress} style={styles.input} />
                <Divider />
                {/* Invoice Creator Information Section */}
                <Text style={styles.sectionTitle}>Your Information</Text>
                <TextInput mode="outlined" label="Full Name" value={creatorName} onChangeText={setCreatorName} style={styles.input} />
                <TextInput mode="outlined" label="Signature Photo URL" value={signaturePhoto} onChangeText={setSignaturePhoto} style={styles.input} />
                <TextInput mode="outlined" label="Signature in Words" value={signatureInWords} onChangeText={setSignatureInWords} style={styles.input} />
                <TextInput mode="outlined" label="Designation" value={designation} onChangeText={setDesignation} style={styles.input} />
                <Divider />
                {/* Payment Method Section */}
                <Text style={styles.sectionTitle}>Payment Method</Text>
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
                    </>
                )}
                <Divider />
                {/* Business Information Section */}
                <Text style={styles.sectionTitle}>Business Information</Text>
                <TextInput mode="outlined" label="Business Name" value={businessName} onChangeText={setBusinessName} style={styles.input} />
                <TextInput mode="outlined" label="Business Email" value={businessEmail} onChangeText={setBusinessEmail} style={styles.input} />
                <TextInput mode="outlined" label="Business Mobile" value={businessMobile} onChangeText={setBusinessMobile} style={styles.input} />
                <TextInput mode="outlined" label="Business Address" value={businessAddress} onChangeText={setBusinessAddress} style={styles.input} />
                <TextInput mode="outlined" label="Business Logo URL" value={businessLogo} onChangeText={setBusinessLogo} style={styles.input} />
                <TextInput mode="outlined" label="Business Slogan" value={businessSlogan} onChangeText={setBusinessSlogan} style={styles.input} />
                <Divider />
                {/* Invoice Info Section */}
                <Text style={styles.sectionTitle}>Invoice Information</Text>
                <View style={styles.dateContainer}>
                    <TextInput mode="outlined" label="Invoice Date" value={date} onChangeText={setDate} style={[styles.input, styles.dateInput]} />
                    <IconButton icon={() => <MaterialIcons name="today" size={24} color="black" />} onPress={handleSetTodayDate} />
                </View>
                <View style={styles.dateContainer}>
                    <TextInput mode="outlined" label="Due Date" value={dueDate} onChangeText={setDueDate} style={[styles.input, styles.dateInput]} />
                    <IconButton icon={() => <MaterialIcons name="today" size={24} color="black" />} onPress={handleSetTodayDueDate} />
                </View>



                <Divider />
                {/* Payment Status and Template */}
                <View>
                    <Button mode="outlined" onPress={() => setStatusMenuVisible(true)}>
                        Select Status
                    </Button>
                    <Menu
                        visible={statusMenuVisible}
                        onDismiss={() => setStatusMenuVisible(false)}
                        anchor={<Text style={styles.preview} variant="bodyMedium">{status ? `Payment Status: ${status}` : "Please select a payment status"}</Text>}
                    >
                        {statusOptions.map((option) => (
                            <Menu.Item key={option} onPress={() => { setStatus(option); setStatusMenuVisible(false); }} title={option} />
                        ))}
                    </Menu>
                </View>
                <Button mode={"elevated"} onPress={openTemplateSelector} style={styles.button}>
                    Select Template ({templateId})
                </Button>

                <Divider />
                {/* Invoice Table Section */}
                <Text style={styles.sectionTitle}>Invoice Table</Text>

                <TextInput
                    label="Max Column Limit"
                    value={String(maxColLimit)}
                    mode="outlined"
                    disabled={true}
                    style={styles.input}
                />
                <RadioButton.Group
                    onValueChange={(newValue) => {
                        const index = parseInt(newValue);
                        setTotalableIndex(index);
                        const subtotalValue = values.reduce((acc, row) => {
                            const cellValue = parseFloat(row[index]) || 0;
                            return acc + cellValue;
                        }, 0);
                        setSubTotal(subtotalValue.toString());
                    }}
                    value={totalableIndex.toString()}
                >
                    <View style={styles.columnsContainer}>
                        <Text style={styles.radioButtonInfo}>
                            Select a column to calculate the subtotal.
                        </Text>
                        {columns.map((col, index) => (
                            <View key={index} style={styles.columnRow}>
                                <TextInput
                                    label={`Column ${index + 1}`}
                                    value={col}
                                    mode="outlined"
                                    onChangeText={(text) => {
                                        const updatedColumns = [...columns];
                                        updatedColumns[index] = text;
                                        setColumns(updatedColumns);
                                    }}
                                    style={styles.columnInput}
                                />
                                <RadioButton
                                    value={index.toString()}
                                />
                                {columns.length > 1 && (
                                    <IconButton
                                        icon="delete"
                                        onPress={() => deleteColumn(index)}
                                        mode="contained"
                                    />
                                )}
                            </View>
                        ))}
                        {columns.length < maxColLimit && (
                            <Button onPress={addColumn} mode="outlined">
                                Add Column
                            </Button>
                        )}
                    </View>
                </RadioButton.Group>


                <Text style={styles.sectionTitle}>Table Values</Text>
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
                            textColor={myColors.colors.onPrimaryContainer} // Change text color if needed
                            style={styles.transparentButton}
                        >
                            Delete
                        </Button>
                    </View>
                ))}
                <Button onPress={addRow} mode="outlined">
                    Add Row
                </Button>
                <Divider />
                {/* Summary Section */}
                <Text style={styles.sectionTitle}>Summary</Text>
                <TextInput disabled={true} mode="outlined"
                    label="SubTotal" value={subTotal} onChangeText={setSubTotal} keyboardType="numeric" style={styles.input} />

                <Divider />
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

                <Divider />
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


                <TextInput mode="outlined" disabled={true} label="Total" value={total} onChangeText={setTotal} keyboardType="numeric" style={styles.input} />
                <Divider />
                {/* Thank You and Terms Section */}
                <TextInput mode="outlined" label="Thank You Note" value={thankYouNote} onChangeText={setThankYouNote} style={styles.input} />

                <Divider />
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
                                <RadioButton.Item label="Use Default Terms" value="default" />
                                <RadioButton.Item label="Use Custom Terms" value="custom" />
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

                <TouchableOpacity onPress={handleCreateInvoice}>
                    <LinearGradient
                        colors={[...myColors.gradients.primaryGradient]} // Beautiful gradient colors
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Create Invoice</Text>
                    </LinearGradient>
                </TouchableOpacity>




            </ScrollView>
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
        marginBottom: 20
    },
    preview: {
        margin: 10
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: myColors.colors.onPrimaryContainer,
    },
    columnsContainer: {
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: myColors.colors.onPrimaryContainer,
        borderRadius: 5,
        backgroundColor: myColors.colors.surface,
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
        padding: 10,
        borderWidth: 1,
        borderColor: myColors.colors.onPrimaryContainer,
        borderRadius: 5,
        backgroundColor: myColors.colors.primaryContainer,
    },
    transparentButton: {
        backgroundColor: 'transparent', // Removing background
        borderWidth: 0,
        elevation: 0,
        padding: 0,
        marginTop: 10
    },
    radioButtonInfo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: myColors.colors.primaryContainer,
    },
    gradientButton: {
        marginTop: 10,
        marginBottom: 100,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    radioGroup: {
        backgroundColor: myColors.colors.primaryContainer,
    },
    defaultMessageText: {
        fontSize: 16,
        color: myColors.colors.onSurface,
        marginVertical: 10,
        padding: 10,
        backgroundColor: myColors.colors.surfaceVariant,
        borderRadius: 5,
        textAlign: 'center',
    },
});

export default CreateInvoiceScreen;
