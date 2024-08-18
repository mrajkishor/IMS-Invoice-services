import { myColors } from '../config/theme';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Title } from 'react-native-paper';


const AppLogo = () => {
    return (
        <View style={styles.container}>
            <Title style={styles.logoText}>InvoGuru</Title>
            <Text style={styles.sloganText}>Effortless Invoicing, Expertly Managed</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    logoText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: myColors.colors.inversePrimary, // Deep purple
        // marginBottom: 10,
    },
    sloganText: {
        fontSize: 10,
        color: myColors.colors.secondary, // Deep purple
        textAlign: 'center',
        // paddingHorizontal: 20,
    },
});

export default AppLogo;
