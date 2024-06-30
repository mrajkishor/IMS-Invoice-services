import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ActivityIndicator, List } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { fetchInvoicesRequest } from '../store/actions/invoiceActions';
import Button from '../components/Button';
import Text from '../components/Text';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';

type ShopScreenRouteProp = RouteProp<RootStackParamList, 'Shop'>;

const ShopScreen: React.FC = () => {
    const route = useRoute<ShopScreenRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const { loading, invoices, error } = useSelector((state: RootState) => state.invoices);

    useEffect(() => {
        dispatch(fetchInvoicesRequest(shopId));
    }, [dispatch, shopId]);

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card} onPress={() => navigation.navigate('Invoice', { invoiceId: item.id })}>
            <Card.Content>
                <List.Item
                    title={`Invoice ${item.id}`}
                    description={`Amount: $${item.amount}\nDate: ${item.date}`}
                    left={(props) => <List.Icon {...props} icon="file-document" />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                />
            </Card.Content>
        </Card>
    );

    if (loading) {
        return <ActivityIndicator animating={true} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={invoices}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Button style={styles.fab} icon="plus" onPress={() => console.log('Create Invoice')}>
                Create Invoice
            </Button>
        </View>
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

export default ShopScreen;
