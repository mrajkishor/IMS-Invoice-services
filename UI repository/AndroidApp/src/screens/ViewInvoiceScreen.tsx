import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, FAB } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import the icon set you want to use
import { RootStackParamList } from '../navigationTypes';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

type ViewInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'ViewInvoice'>;

const ViewInvoiceScreen: React.FC = () => {
    const route = useRoute<ViewInvoiceScreenRouteProp>();
    const { invoice } = route.params;

    useEffect(() => {
        console.log('Invoice Details:', invoice);
    }, [invoice]);

    const handleShare = async () => {
        try {
            const pdfPath = await createPdf(invoice);
            console.log('PDF Path:', pdfPath);
            Share.open({
                url: `file://${pdfPath}`,
                type: 'application/pdf',
                title: 'Share Invoice'
            });
        } catch (error) {
            console.error('Error sharing invoice:', error);
        }
    };

    const createPdf = async (invoice: any) => {
        const { dirs } = RNFetchBlob.fs;
        const pdfPath = `${dirs.DocumentDir}/invoice_${invoice.invoiceId}.pdf`;

        // Generate PDF content here
        const pdfContent = `
            <h1>Invoice</h1>
            <p>Invoice ID: ${invoice.invoiceId}</p>
            <p>Shop ID: ${invoice.shopId}</p>
            <p>User ID: ${invoice.userId}</p>
            <p>Details: ${invoice.details}</p>
            <p>Amount: ${invoice.amount}</p>
        `;

        await RNFetchBlob.fs.writeFile(pdfPath, pdfContent, 'utf8');
        return pdfPath;
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title title="Invoice Details" />
                <Card.Content>
                    <Text>Invoice ID: {invoice.invoiceId}</Text>
                    <Text>Shop ID: {invoice.shopId}</Text>
                    <Text>User ID: {invoice.userId}</Text>
                    <Text>Details: {invoice.details}</Text>
                    <Text>Amount: {invoice.amount}</Text>
                </Card.Content>
            </Card>
            <FAB
                style={styles.fab}
                icon={() => <MaterialIcons name="share" size={24} />}
                onPress={handleShare}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default ViewInvoiceScreen;