import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import { loginRequest, registerRequest } from '../store/actions/authActions'; // Import register action
import { RootState } from '../store/store';
import { getAllData } from '../utils/localStorage/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp } from '../navigationTypes';
import AppLogo from '../components/AppLogo';
import { validateEmail, validatePassword } from '../utils/validation';
import { createUsernameFromEmail } from '../utils/common';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleLogin = () => {
        const emailValid = validateEmail(email);
        const passwordValid = validatePassword(password);

        if (!emailValid) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }

        if (!passwordValid) {
            setPasswordError('Password must be at least 8 characters long and include a number and a special character.');
        } else {
            setPasswordError('');
        }

        if (emailValid && passwordValid) {
            dispatch(loginRequest(email, password));
            getAllData().then((data) => console.log('All AsyncStorage Data:', data));
        }
    };

    const handleRegister = () => {
        const emailValid = validateEmail(email);
        const passwordValid = validatePassword(password);

        if (!emailValid) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }

        if (!passwordValid) {
            setPasswordError('Password must be at least 8 characters long and include a number and a special character.');
        } else {
            setPasswordError('');
        }

        if (emailValid && passwordValid) {
            dispatch(registerRequest(email, createUsernameFromEmail(email), password));
            Alert.alert('Account created', 'Your account has been successfully created.');
        }
    };



    useEffect(() => {
        if (isAuthenticated) {
            navigation.navigate('Main');
        }
    }, [isAuthenticated, navigation]);

    return (
        <View style={styles.container}>
            <AppLogo />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    mode="outlined"
                    error={!!emailError}
                />
            </View>
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    error={!!passwordError}
                />
            </View>
            {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
            {loading && <ActivityIndicator animating={true} />}
            {error && <Text style={styles.error}>{error}</Text>}
            <Button
                mode="elevated"
                onPress={handleLogin}
                style={styles.button}
            >
                Login
            </Button>

            <Button
                mode="contained-tonal"
                onPress={handleRegister}
                style={styles.button}
            >
                Create a new Account
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 60,
        backgroundColor: '#ffffff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        flex: 1,
    },
    error: {
        color: '#B00020',
        marginBottom: 12,
    },
    button: {
        marginTop: 16,
    },
});

export default LoginScreen;
