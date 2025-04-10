import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { myColors } from '../config/theme';

const slides = [
    {
        key: '1',
        title: 'Create Invoices Easily',
        text: 'Generate and customize invoices quickly with our ready-made templates.',
        image: require('../assets/images/onBoarding/image_transparent_Craiyon.png'), // Add your image here
        backgroundColor: myColors.colors.primary,
    },
    {
        key: '2',
        title: 'Share Invoices with Permanent Links',
        text: 'Share invoices using permanent URLs for web and mobile-friendly views.',
        image: require('../assets/images/onBoarding/share_invoice_craiyon.png'), // Add your image here
        backgroundColor: myColors.colors.primary,
    },
    {
        key: '3',
        title: 'Manage Your Business',
        text: 'Keep track of all your invoices and customers in one place.',
        image: require('../assets/images/onBoarding/manage_your_business_3_craiyon.png'), // Add your image here
        backgroundColor: myColors.colors.primary,
    }
];


const OnboardingScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {

    // Check if the onboarding has been completed
    useEffect(() => {
        const checkOnboardingStatus = async () => {
            const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
            if (hasSeenOnboarding === 'true') {
                // If onboarding is complete, navigate to Login directly
                navigation.navigate('Login');
            }
        };
        checkOnboardingStatus();
    }, []);

    // Note below:
    // React native's way of combining/overriding styles 

    // const baseStyle = { padding: 10, margin: 5 };
    // const dynamicStyle = { backgroundColor: 'red' };
    // <View style={[baseStyle, dynamicStyle]} />

    // and with condition 

    // const buttonStyle = { padding: 10 };
    // const disabledStyle = { backgroundColor: 'gray' };
    // <Button style={[buttonStyle, isDisabled && disabledStyle]} />

    // which internally does this {...baseStyle, ...dynamicStyle}

    const _renderItem = ({ item }: { item: { key: string; title: string; text: string; image: any; backgroundColor: string } }) => {
        return (
            <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );
    };

    const _onDone = async () => {

        // Save the onboarding status so it's not shown again
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');

        // Navigate to Login Screen when onboarding is done
        navigation.navigate('Login');
    };
    const _renderDoneButton = () => {
        return (
            <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Login</Text>
            </View>
        );
    };
    return (
        <AppIntroSlider renderDoneButton={_renderDoneButton}
            renderItem={_renderItem} data={slides} onDone={_onDone} />
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20, // Added padding for better alignment
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 30,
        borderRadius: 10, // Optional rounded corners for the image
    },
    title: {
        fontSize: 20, // Increased font size for the title
        fontWeight: 'bold', // Bold font for a stronger visual hierarchy
        color: '#fff', // White text for contrast with background
        textAlign: 'center',
        marginBottom: 15, // Spacing between title and text
        letterSpacing: 1.2, // Added letter spacing for elegance
    },
    text: {
        fontSize: 15, // Increased font size for the subtitle
        color: '#f8f8f8', // Softer white color for subtitle
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 24, // Added line height for better readability
        paddingHorizontal: 10, // Padding for proper text spacing
    },
    buttonContainer: {
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;
