import { myColors } from '../config/theme';
import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Title } from 'react-native-paper';

const AppLogo = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/logo.png')} // Make sure you have the correct path to your logo
                style={styles.logoImage}
            />
            <Title style={styles.logoText}>Chalaan</Title>
            <Text style={styles.sloganText}>Effortless Invoicing, Expertly Managed</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    logoImage: {
        width: 100, // Adjust the width of the logo as needed
        height: 100, // Adjust the height to maintain aspect ratio
        marginBottom: 0, // Adds spacing between the logo and the text
        borderRadius: 50, // Optional: Makes the image circular, remove if not needed
    },
    logoText: {
        fontSize: 25, // Slightly increased font size for a stronger presence
        fontWeight: 'bold',
        color: myColors.colors.onSecondary, // Deep purple
        marginBottom: 8, // Reduced margin for tighter spacing
        letterSpacing: 1.5, // Added letter spacing for a modern look
    },
    sloganText: {
        fontSize: 14, // Increased font size for better readability
        color: myColors.colors.secondary, // Deep purple
        textAlign: 'center',
        paddingHorizontal: 15, // Padding for better text alignment
        lineHeight: 20, // Added line height for improved readability
    },
});

export default AppLogo;
