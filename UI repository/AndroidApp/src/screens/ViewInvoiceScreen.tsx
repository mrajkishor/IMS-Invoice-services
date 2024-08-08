import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider, Button } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';

type ViewInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'ViewInvoice'>;

const ViewInvoiceScreen: React.FC = () => {
    const route = useRoute<ViewInvoiceScreenRouteProp>();
    const { invoice } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Invoice" />
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
                        <Button icon="share" mode="contained" onPress={() => console.log('Share Invoice')}>
                            Share Invoice
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    card: {
        marginVertical: 8,
        padding: 16,
        borderRadius: 10,
        elevation: 1,
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
