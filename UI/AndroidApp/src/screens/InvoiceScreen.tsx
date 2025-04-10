import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ActivityIndicator, List, Appbar } from 'react-native-paper';
import { fetchInvoicesRequest } from '../store/actions/invoiceActions';
import Button from '../components/Button';
import Text from '../components/Text';
import { RootState } from '../store/reducers'; // Ensure this path is correct
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const InvoiceScreen: React.FC<{ route: any }> = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const { loading, invoices, error } = useSelector((state: RootState) => state.invoices);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            // Fetch updated data
            await dispatch(fetchInvoicesRequest(shopId));
        } catch (error) {
            console.error('Failed to refresh invoices:', error);
        } finally {
            setRefreshing(false);
        }
    };


    useEffect(() => {
        dispatch(fetchInvoicesRequest(shopId));
    }, [dispatch, shopId]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableWithoutFeedback >
            <Card style={styles.card}>
                <Card.Content>
                    <List.Item
                        title={`Invoice ${item.id}`}
                        description={`Amount: $${item.amount}\nDate: ${item.date}`}
                        left={(props) => <List.Icon {...props} icon="file-document" />}
                    />
                </Card.Content>
            </Card>
        </TouchableWithoutFeedback>
    );

    if (loading) {
        return <ActivityIndicator animating={true} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="store" />} onPress={() => { }} />
                <Appbar.Content title="My Store" />
            </Appbar.Header>
            <View style={styles.container}>
                <FlatList
                    data={invoices}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
                <Button style={styles.fab} icon="plus" onPress={() => console.log('Create Invoice')}>
                    Create Invoice
                </Button>
            </View>
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,

    },
    card: {
        marginBottom: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default InvoiceScreen;
