import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider, Button, SegmentedButtons, Appbar } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';
import { myColors } from '../config/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type ViewInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'ViewInvoice'>;

const ViewInvoiceScreen: React.FC = () => {
    const route = useRoute<ViewInvoiceScreenRouteProp>();
    const { invoice } = route.params;

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
                            <Text style={styles.value}>{invoice.date}</Text>
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
                                        icon: 'newspaper-variant-multiple-outline',
                                        value: 'templates',
                                        label: 'Templates',
                                    },
                                    {
                                        icon: 'share',
                                        value: 'share',
                                        label: 'Share',
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
