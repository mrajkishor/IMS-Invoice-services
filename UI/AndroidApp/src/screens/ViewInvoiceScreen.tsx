import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Linking, Share, Alert, TextInput } from 'react-native';
import { Text, Card, Divider, Button, SegmentedButtons, Appbar, ActivityIndicator, Portal, Dialog, Paragraph } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';
import { myColors } from '../config/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { INVOICE_PROD_URL } from '../constants/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { fetchShopRequest } from '../store/actions/shopActions';
import { fetchUserRequest } from '../store/actions/userActions';
import { fetchInvoiceByIdRequest } from '../store/actions/invoiceActions';
import CancelledWatermark from '../components/CancelledWatermark';

type TemplateSelectorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TemplateSelector'>;
type ViewInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'ViewInvoice'>;

const ViewInvoiceScreen: React.FC = () => {
    const route = useRoute<ViewInvoiceScreenRouteProp>();
    const { invoice: myInvoices = {} } = route.params || {}, { invoiceId = "" } = myInvoices;
    console.log("route.params", route.params);
    const navigation = useNavigation<TemplateSelectorScreenNavigationProp>();
    const dispatch = useDispatch();

    // Get data from Redux store
    const invoiceState = useSelector((state: RootState) => state.invoices);
    const invoiceByIdState = useSelector((state: RootState) => state.invoices.invoice);
    const shopState = useSelector((state: RootState) => state.shops);
    const userState = useSelector((state: RootState) => state.users);

    const { loading: loadingInvoice, invoice: firstInvoice = {} } = route.params;
    const { loading: loadingShop, shops } = shopState;
    const { loading: loadingUser, user: fetchedUser } = userState;
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [mode, setMode] = useState<"Delete" | "Cancel">("Cancel");

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchInvoiceByIdRequest(invoiceId)); // Fetch updated invoice on screen focus

        }, [dispatch, invoiceId])
    );

    useEffect(() => {
        if (invoiceId) {
            dispatch(fetchInvoiceByIdRequest(invoiceId)); // Ensure initial load fetches correct data
        }
    }, [dispatch, invoiceId]);

    useEffect(() => {
        if (invoiceByIdState?.shopId) {
            dispatch(fetchShopRequest(invoiceByIdState.shopId)); // Fetch the shop details for the invoice
        }
        if (invoiceByIdState?.userId) {
            dispatch(fetchUserRequest(invoiceByIdState.userId)); // Fetch the user details for the invoice creator
        }
    }, [dispatch, invoiceByIdState]);

    const handleOpenLinkInBrowser = async () => {
        const url = `${INVOICE_PROD_URL}/invoice/${invoiceId}`;
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `🧾 *Your Invoice is Ready!*\n\nHello, \n\nThank you for choosing *Chalaan App*.\n\n📄 View your invoice here:\n👉 ${INVOICE_PROD_URL}/invoice/${invoiceId}\n\nWe're committed to delivering the best service to you.\n\nBest regards,\n*Chalaan Support Team*`,
                title: 'Share this link',
            });

            if (result.action === Share.sharedAction) {
                console.log('Shared successfully');
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error: any) {
            console.error('Error sharing content:', error.message);
        }
    };



    const handleDeleteOrCancel = (actionMode: "Delete" | "Cancel") => {
        // Alert.alert(
        //     `Confirm ${mode === "Delete" ? 'Deletion' : 'Cancellation'}`,
        //     `Are you sure you want to ${mode === "Delete" ? 'delete' : 'cancel'} this invoice? This action cannot be undone.`,
        //     [
        //         { text: 'Cancel', style: 'cancel' },
        //         {
        //             text: 'Delete',
        //             onPress: () => {
        //                 dispatch({ type: 'DELETE_INVOICE_REQUEST', payload: invoiceId });
        //                 navigation.goBack(); // Navigate back after deletion
        //             },
        //             style: 'destructive',
        //         },
        //     ],
        //     { cancelable: true }
        // );
        setMode(actionMode);
        setIsDialogVisible(true);
    };
    const confirmAction = () => {
        if (!remarks.trim()) {
            Alert.alert('Remarks Required', 'Please provide remarks before proceeding.');
            return;
        }

        if (mode === "Delete") {
            dispatch({ type: 'DELETE_INVOICE_REQUEST', payload: { invoiceId, remarks: remarks.trim() || null } });
        } else {
            dispatch({ type: 'CANCEL_INVOICE_REQUEST', payload: { invoiceId, remarks } });
        }

        setIsDialogVisible(false);
        // Refresh the page after action


        navigation.goBack();

    };

    const handleEdit = () => {
        // Navigate to the edit screen with the invoice ID
        navigation.navigate('CreateInvoice', { invoice: invoiceByIdState, mode: "edit" });
    };

    if (loadingInvoice || loadingShop || loadingUser) {
        return <ActivityIndicator animating={true} style={styles.loader} />;
    }
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Cancelled':
                return 'cancel'; // Cancelled icon
            case 'Paid':
                return 'check-circle'; // Paid icon
            case 'Draft':
                return 'edit'; // Draft icon
            default:
                return 'info'; // Default fallback icon
        }
    };

    const markAsPaid = () => {
        Alert.alert(
            'Mark as Paid',
            'Are you sure you want to mark this invoice as paid?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        dispatch({
                            type: 'MARK_INVOICE_AS_PAID_REQUEST',
                            payload: { invoiceId: invoiceByIdState.invoiceId },
                        });
                        Alert.alert('Success', 'Invoice marked as Paid.');
                        setTimeout(() => {
                            navigation.goBack();
                        }, 1000);
                    },
                },
            ],
            { cancelable: true }
        );
    };



    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Cancelled':
                return { backgroundColor: 'rgba(97, 97, 97, 0.9)' }; // Soft red
            case 'Paid':
                return { backgroundColor: 'rgba(56, 142, 60, 0.9)' }; // Soft green
            case 'Draft':
                return { backgroundColor: 'rgba(251, 192, 45, 0.9)' }; // Soft yellow
            default:
                return { backgroundColor: 'rgba(211, 47, 47, 0.9)' }; // Grey fallback
        }
    };


    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Invoice Preview" titleStyle={{ fontWeight: 'bold', fontSize: 20 }} />
                {/* <Appbar.Action icon={(props) => <MaterialIcons {...props} name="share" />} onPress={handleShare} /> */}
                {invoiceByIdState.paymentStatus !== 'Draft' && (
                    <Appbar.Action icon={(props) => <MaterialIcons {...props} name="share" />} onPress={handleShare} />
                )}
            </Appbar.Header>

            <View style={{ flex: 1 }}>

                <ScrollView>
                    {/* Invoice Status at the Top */}
                    <View style={styles.statusWrapper}>
                        <View style={[styles.statusContainer, getStatusStyle(invoiceByIdState.paymentStatus)]}>
                            <MaterialIcons
                                name={getStatusIcon(invoiceByIdState.paymentStatus)}
                                size={24}
                                color="#FFFFFF"
                                style={styles.iconStyle}
                            />
                            <Text style={styles.statusText}>
                                {invoiceByIdState.paymentStatus?.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    {invoiceByIdState.paymentStatus === 'Cancelled' &&
                        <CancelledWatermark />
                    }

                    {invoiceByIdState && (
                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Invoice ID:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.invoiceId}</Text>
                                </View>
                                <Divider />

                                <View style={styles.section}>
                                    <Text style={styles.label}>Business Name:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.business?.name}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Business Address:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.business?.address}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Business Contact:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.business?.mobile}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Business Email:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.business?.email}</Text>
                                </View>
                                <Divider />

                                <View style={styles.section}>
                                    <Text style={styles.label}>Customer Name:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.billedTo?.customer?.name}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Customer Address:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.billedTo?.customer?.address}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Customer Phone:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.billedTo?.customer?.phone}</Text>
                                </View>
                                <Divider />

                                <View style={styles.section}>
                                    <Text style={styles.label}>Created By:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.invoiceCreator?.name} ({invoiceByIdState.invoiceCreator?.designation})</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Creator's Signature:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.invoiceCreator?.signatureInWords}</Text>
                                </View>
                                <Divider />

                                <View style={styles.section}>
                                    <Text style={styles.label}>Invoice Table:</Text>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                                        <View>
                                            {/* Table Header */}
                                            <View style={styles.tableRow}>
                                                {invoiceByIdState?.invoiceTable?.columns.map((col, colIndex) => (
                                                    <Text key={`col-${colIndex}`} style={[styles.tableCell, styles.headerCell]}>{col}</Text>
                                                ))}
                                            </View>

                                            {/* Table Rows */}
                                            {invoiceByIdState?.invoiceTable?.value && invoiceByIdState.invoiceTable.value.length > 0 ? (
                                                invoiceByIdState.invoiceTable.value.map((row, rowIndex) => (
                                                    <View key={`row-${rowIndex}`} style={styles.tableRow}>
                                                        {row.map((cell, colIndex) => (
                                                            <Text key={`row-${rowIndex}-col-${colIndex}`} style={styles.tableCell}>{cell}</Text>
                                                        ))}
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={styles.value}>No data available</Text>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>

                                <Divider />

                                <View style={styles.section}>
                                    <Text style={styles.label}>Payment Method:</Text>
                                    {invoiceByIdState.paymentMethod?.isCash && <Text style={styles.value}>Cash</Text>}
                                    {invoiceByIdState.paymentMethod?.isUPI && invoiceByIdState.paymentMethod.Upis?.map((upi, index) => (
                                        <Text key={index} style={styles.value}>UPI: {upi}</Text>
                                    ))}
                                    {invoiceByIdState.paymentMethod?.isBank && (
                                        <>
                                            <Text style={styles.value}>Bank Account Holder: {invoiceByIdState.paymentMethod.bank.accountHolderName}</Text>
                                            <Text style={styles.value}>Account Number: {invoiceByIdState.paymentMethod.bank.accountNumber}</Text>
                                        </>
                                    )}
                                </View>
                                <Divider />

                                <View style={styles.section}>
                                    <Text style={styles.label}>SubTotal:</Text>
                                    <Text style={styles.value}>Rs {invoiceByIdState.subTotal}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Tax:</Text>
                                    <Text style={styles.value}>Rs {invoiceByIdState.tax?.amount} ({invoiceByIdState.tax?.percentage})</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Discount:</Text>
                                    <Text style={styles.value}>Rs {invoiceByIdState.packageDiscount?.amount} ({invoiceByIdState.packageDiscount?.percentage})</Text>
                                </View>
                                {invoiceByIdState?.partialPaymentAmount && (
                                    <View style={styles.section}>
                                        <Text style={styles.label}>Partial Payment Amount (Already Paid):</Text>
                                        <Text style={styles.value}> {invoiceByIdState?.partialPaymentAmount}</Text>
                                    </View>
                                )}
                                <View style={styles.section}>
                                    <Text style={styles.label}>Total:</Text>
                                    <Text style={styles.value}>Rs {invoiceByIdState.total}</Text>
                                </View>
                                <Divider />

                                <View style={styles.section}>
                                    <Text style={styles.label}>Terms & Services:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.termsNServicesMessage?.customMessage}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.label}>Thank You Note:</Text>
                                    <Text style={styles.value}>{invoiceByIdState.thankYouNote}</Text>
                                </View>





                                <View style={styles.buttonContainer}>

                                    {invoiceByIdState.paymentStatus !== 'Cancelled' &&
                                        (<>
                                            {invoiceByIdState.paymentStatus === 'Draft' ? (<Button
                                                mode="contained"
                                                icon="delete"
                                                onPress={() => handleDeleteOrCancel("Delete")}
                                                labelStyle={styles.buttonLabel}
                                                style={styles.deleteButton}
                                            >
                                                Delete
                                            </Button>) : (invoiceByIdState.paymentStatus !== 'Paid' && <Button
                                                mode="contained"
                                                icon="cancel"
                                                onPress={() => handleDeleteOrCancel("Cancel")}
                                                labelStyle={styles.buttonLabel}
                                                style={styles.deleteButton}
                                            >
                                                Cancel
                                            </Button>)}

                                            {invoiceByIdState.paymentStatus === 'Draft' && (
                                                <Button
                                                    mode="contained"
                                                    icon="pencil"
                                                    onPress={handleEdit}
                                                    labelStyle={styles.buttonLabel}
                                                    style={styles.editButton}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </>)
                                    }


                                    {/* Paid Button for Unpaid or Partially Paid Invoices */}
                                    {(invoiceByIdState.paymentStatus === 'Unpaid' || invoiceByIdState.paymentStatus === 'Partially Paid') && (
                                        <Button
                                            mode="contained"
                                            icon="check-circle"
                                            onPress={markAsPaid}
                                            labelStyle={styles.buttonLabel}
                                            style={styles.paidButton}
                                        >
                                            Paid
                                        </Button>
                                    )}

                                </View>


                            </Card.Content>
                        </Card>
                    )}
                </ScrollView>
            </View>

            <Portal>
                <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
                    <Dialog.Title>{`Confirm ${mode}`}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{`Please provide remarks for the ${mode.toLowerCase()} action:`}</Paragraph>
                        <Text style={styles.label}>Remarks</Text>
                        <TextInput
                            value={remarks}
                            onChangeText={setRemarks}
                            multiline
                            style={styles.input}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setIsDialogVisible(false)}>Close</Button>
                        <Button onPress={confirmAction}>Proceed to {mode}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    editButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: '#4CAF50', // Green for edit
        borderRadius: 8,
    },
    deleteButton: {
        flex: 1,
        marginRight: 8,
        backgroundColor: '#D32F2F', // Red for delete
        borderRadius: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text for contrast
    },
    card: {
        margin: 16,
        padding: 16,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: '#ffffff',
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 8,
    },

    section: {
        marginVertical: 12,
    },
    label: {
        fontWeight: '600',
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#222',
        marginBottom: 8,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
    },
    tableCell: {
        width: 120, // Adjust the width for each cell
        textAlign: 'center',
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#555',
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 15,
        backgroundColor: '#eeeeee',
        paddingVertical: 8,
        textAlign: 'center',
        color: '#333',
    },
    divider: {
        marginVertical: 12,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
    },
    header: {
        marginBottom: 16,
    },
    statusWrapper: {
        marginBottom: -30,
        padding: 10,
        // backgroundColor: 'white',
        borderTopLeftRadius: 12, // Top-left corner rounded
        borderTopRightRadius: 12, // Top-right corner rounded
        borderBottomLeftRadius: 0, // Bottom-left corner square
        borderBottomRightRadius: 0, // Bottom-right corner square
        marginHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 12, // Top-left corner rounded
        borderTopRightRadius: 12, // Top-right corner rounded
        borderBottomLeftRadius: 0, // Bottom-left corner square
        borderBottomRightRadius: 0, // Bottom-right corner square
        paddingVertical: 12,
        paddingHorizontal: 24,
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    statusText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginLeft: 8, // Adds space between icon and text
    },
    iconStyle: {
        marginRight: 8,
    },

    paidButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: '#388E3C', // Green for "Paid" button
        borderRadius: 8,
    },

});

export default ViewInvoiceScreen;
