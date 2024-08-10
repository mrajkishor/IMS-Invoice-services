import React from 'react';
import { View, StyleSheet, ScrollView, GestureResponderEvent, Share, Linking } from 'react-native';
import { Text, Card, Divider, Button, SegmentedButtons, Appbar } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';
import { myColors } from '../config/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type ViewInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'ViewInvoice'>;

const ViewInvoiceScreen: React.FC = () => {
    const route = useRoute<ViewInvoiceScreenRouteProp>();
    const { invoice } = route.params;

    const handleOpenLinkInBrowser = async () => {
        const url = `https://invoguru.com/invoice/${invoice.invoiceId}`;
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `Find your invoice at \n https://invoguru.com/invoice/${invoice.invoiceId} \n\n Thanks for chosing InvoGuru. \n We are looking for to deliver the best service for you. \n Thanks and regards, \n InvoGuru Support Team`,
                // url: `https://invoguru.com/invoice/${invoice.invoiceId}`, // Optional, you can share just the message or both
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
    }

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />

                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="details" />} onPress={() => { }} />

                <Appbar.Content title="Share Invoice" />
            </Appbar.Header>
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Title title="Invoice Details" subtitle="Choose templates to preview..." />
                    <Card.Content>
                        <View style={styles.section}>
                            <Text style={styles.label}>Invoice ID:</Text>
                            <Text style={styles.value}>{invoice.invoiceId}</Text>
                        </View>
                        <Divider />
                        <View style={styles.section}>
                            <Text style={styles.label}>Shop ID:</Text>
                            <Text style={styles.value}>{invoice.shopId}</Text>
                        </View>
                        <Divider />
                        <View style={styles.section}>
                            <Text style={styles.label}>User ID:</Text>
                            <Text style={styles.value}>{invoice.userId}</Text>
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
                            <Text style={styles.label}>Date:</Text>
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
                            <Text style={styles.value}>${invoice.amount}</Text>
                        </View>
                        <Divider />
                        <View style={styles.footer}>
                            {/* <Button icon="share" mode="outlined" onPress={() => console.log('Share Invoice')}>
                            Share Invoice
                        </Button> */}
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
});

export default ViewInvoiceScreen;
