import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Share } from 'react-native';
import { Text, Card, Divider, Button, SegmentedButtons, Appbar, ActivityIndicator } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';
import { myColors } from '../config/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { INVOICE_PROD_URL } from '../constants/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchShopRequest } from '../store/actions/shopActions';
import { fetchUserRequest } from '../store/actions/userActions';

type TemplateSelectorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TemplateSelector'>;
type TemplateSelectorScreenRouteProp = RouteProp<RootStackParamList, 'TemplateSelector'>;
type ViewInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'ViewInvoice'>;

const ViewInvoiceScreen: React.FC = () => {
    const route = useRoute<ViewInvoiceScreenRouteProp>();
    const { invoice } = route.params;
    const navigation = useNavigation<TemplateSelectorScreenNavigationProp>();
    const dispatch = useDispatch();
    const { loading: loadingShops, shops, error: errorStateShops } = useSelector((state: RootState) => state?.shops);
    const { loading: loadingUsers, user: fetchedUser, error: errorStateUsers } = useSelector((state: RootState) => state?.users);

    useEffect(() => {
        // Fetch the shop and user details
        dispatch(fetchShopRequest(invoice.shopId));
        dispatch(fetchUserRequest(invoice.userId));
    }, [dispatch, invoice.shopId, invoice.userId]);

    const handleOpenLinkInBrowser = async () => {
        const url = `${INVOICE_PROD_URL}/invoice/${invoice.invoiceId}`;
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `🧾 *Your Invoice is Ready!*\n\nHello, \n\nThank you for choosing *InvoGuru*.\n\n📄 View your invoice here:\n👉 ${INVOICE_PROD_URL}/invoice/${invoice.invoiceId}\n\nWe're committed to delivering the best service to you.\n\nBest regards,\n*InvoGuru Support Team*`,
                title: 'Share this link',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type of:', result.activityType);
                } else {
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error: any) {
            console.error('Error sharing content:', error.message);
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="details" />} onPress={() => { }} />
                <Appbar.Content title="Share Invoice" />
            </Appbar.Header>
            <ScrollView>
                {loadingShops && loadingUsers ? (
                    <ActivityIndicator animating={true} style={styles.loader} />
                ) : (
                    <Card style={styles.card}>
                        <Card.Title title="Invoice Details" subtitle="Choose templates to preview..." />
                        <Card.Content>
                            <View style={styles.section}>
                                <Text style={styles.label}>Invoice ID:</Text>
                                <Text style={styles.value}>{invoice.invoiceId}</Text>
                            </View>
                            <Divider />

                            <View style={styles.section}>
                                <Text style={styles.label}>Owner's Name:</Text>
                                <Text style={styles.value}>{shops[0]?.shopName}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.label}>Owner's Address:</Text>
                                <Text style={styles.value}>{shops[0]?.address}</Text>
                            </View>
                            <Divider />
                            <View style={styles.section}>
                                <Text style={styles.label}>Owner's Contact:</Text>
                                <Text style={styles.value}>
                                    {fetchedUser?.email ? fetchedUser?.email : fetchedUser?.mobile}
                                </Text>
                            </View>
                            <Divider />
                            <View style={styles.section}>
                                <Text style={styles.label}>Customer Name:</Text>
                                <Text style={styles.value}>{invoice.customerName}</Text>
                            </View>
                            <Divider />
                            <View style={styles.section}>
                                <Text style={styles.label}>Customer Address:</Text>
                                <Text style={styles.value}>{invoice.customerAddress}</Text>
                            </View>
                            <Divider />
                            <View style={styles.section}>
                                <Text style={styles.label}>Invoicing Date:</Text>
                                <Text style={styles.value}>{invoice.invoiceDate}</Text>
                            </View>
                            <Divider />
                            <View style={styles.section}>
                                <Text style={styles.label}>Due Date:</Text>
                                <Text style={styles.value}>{invoice.dueDate}</Text>
                            </View>
                            <Divider />
                            <View style={styles.section}>
                                <Text style={styles.label}>Details:</Text>
                                <Text style={styles.value}>{invoice.details}</Text>
                            </View>
                            <Divider />
                            <View style={styles.section}>
                                <Text style={styles.label}>Amount:</Text>
                                <Text style={styles.value}>Rs {invoice.amount}</Text>
                            </View>
                            <Divider />
                            <View style={styles.footer}>
                                <SegmentedButtons
                                    value={"value"}
                                    onValueChange={() => { }}
                                    buttons={[
                                        {
                                            icon: 'eye',
                                            value: 'preview',
                                            label: 'Preview',
                                            onPress: handleOpenLinkInBrowser
                                        },
                                        {
                                            icon: 'share',
                                            value: 'share',
                                            label: 'Share',
                                            onPress: handleShare
                                        }]}
                                />
                            </View>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 10,
        elevation: 0,
    },
    section: {
        marginVertical: 8,
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    footer: {
        marginTop: 16,
        alignItems: 'center',
    },
    loader: {
        marginTop: 20,
    },
});

export default ViewInvoiceScreen;
