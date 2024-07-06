import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ActivityIndicator, List } from 'react-native-paper';
import { fetchShopsRequest } from '../store/actions/shopActions';
import Button from '../components/Button';
import Text from '../components/Text';
import { RootState } from '../store/reducers';

const ShopScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { loading, shops, error } = useSelector((state: RootState) => state.shops);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchShopsRequest(user.userId));
        }
    }, [dispatch, user?.userId]);

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card}>
            <Card.Content>
                <List.Item
                    title={item.shopName}
                    description={`Address d: ${item.address}`}
                    left={(props) => <List.Icon {...props} icon="store" />}
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
                data={shops}
                renderItem={renderItem}
                keyExtractor={(item) => item.shopId}
            />
            <Button style={styles.fab} icon="plus" onPress={() => console.log('Create Shop')}>
                Create Shop
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
