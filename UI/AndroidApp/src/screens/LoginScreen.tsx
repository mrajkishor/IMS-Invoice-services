import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import { loginRequest, registerRequest, validateTokenRequest } from '../store/actions/authActions';
import { RootState } from '../store/store';
import { getAllData } from '../utils/localStorage/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp } from '../navigationTypes';
import AppLogo from '../components/AppLogo';
import { validateEmail, validatePassword, validateMobileNumber } from '../utils/validation';
import { createUsernameFromEmail } from '../utils/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myColors } from '../config/theme';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import { jwtDecode } from "jwt-decode";
import { refreshTokenService } from '../services/authService';
interface JwtPayload {
    exp: number; // Expiration time in seconds
    sub: string; // User ID
}
const LoginScreen: React.FC = () => {
    const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [countryCode, setCountryCode] = useState('IN');
    const [callingCode, setCallingCode] = useState('91');
    const [password, setPassword] = useState('');
    const [inputError, setInputError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const autoLogin = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                dispatch(validateTokenRequest(token));
            }
        };

        autoLogin();
    }, [dispatch]);

    // useEffect(() => {
    //     const checkSession = async () => {
    //         try {
    //             const token = await AsyncStorage.getItem('accessToken');
    //             const refreshToken = await AsyncStorage.getItem('refreshToken');

    //             getAllData().then((data) => console.log('All AsyncStorage Data:', data));

    //             if (token) {
    //                 const decoded: JwtPayload = jwtDecode(token);
    //                 const isExpired = decoded.exp * 1000 < Date.now();

    //                 if (isExpired && refreshToken) {
    //                     // Attempt to refresh the token if expired
    //                     const { token: newToken, refreshToken: newRefreshToken } = await refreshTokenService(refreshToken);

    //                     if (newToken && newRefreshToken) {
    //                         await AsyncStorage.setItem('accessToken', newToken);
    //                         await AsyncStorage.setItem('refreshToken', newRefreshToken);

    //                         const newDecoded: JwtPayload = jwtDecode(newToken);
    //                         dispatch({
    //                             type: 'LOGIN_SUCCESS',
    //                             payload: { token: newToken, refreshToken: newRefreshToken, user: { userId: newDecoded.sub } },
    //                         });
    //                         navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    //                     } else {
    //                         dispatch({ type: 'LOGOUT_REQUEST' });
    //                     }
    //                 } else if (!isExpired) {
    //                     // Token is valid
    //                     dispatch({ type: 'LOGIN_SUCCESS', payload: { token, userId: decoded.sub } });
    //                     navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    //                 } else {
    //                     dispatch({ type: 'LOGOUT_REQUEST' });
    //                 }
    //             } else {
    //                 dispatch({ type: 'LOGOUT_REQUEST' });
    //             }
    //         } catch (error) {
    //             console.error('Error checking session:', error);
    //             dispatch({ type: 'LOGOUT_REQUEST' });
    //         }
    //     };

    //     checkSession();
    // }, [dispatch, navigation]);



    const handleLogin = () => {
        let isValid = false;

        if (loginMethod === 'email') {
            isValid = validateEmail(emailOrMobile);
            setInputError(isValid ? '' : 'Please enter a valid email address.');
        } else if (loginMethod === 'mobile') {
            isValid = validateMobileNumber(`+${callingCode}${emailOrMobile}`);
            setInputError(isValid ? '' : 'Please enter a valid mobile number.');
        }

        const passwordValid = validatePassword(password);
        setPasswordError(passwordValid ? '' : 'Password must be at least 8 characters long and include a number and a special character.');

        if (isValid && passwordValid) {
            if (loginMethod === 'email') {
                dispatch(loginRequest(emailOrMobile, password));
            } else {
                dispatch(loginRequest(`+${callingCode}${emailOrMobile}`, password));
            }
            getAllData().then((data) => console.log('All AsyncStorage Data:', data));
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
            <View style={styles.switchContainer}>
                <TouchableOpacity onPress={() => {
                    setEmailOrMobile("");
                    setLoginMethod('email');
                }}>
                    <Text style={loginMethod === 'email' ? styles.activeSwitch : styles.inactiveSwitch}>
                        Login via Email
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setEmailOrMobile("");
                    setLoginMethod('mobile');
                }}>
                    <Text style={loginMethod === 'mobile' ? styles.activeSwitch : styles.inactiveSwitch}>
                        Login via Mobile
                    </Text>
                </TouchableOpacity>
            </View>
            {loginMethod === 'mobile' && (
                <View style={styles.countryPickerContainer}>
                    <CountryPicker
                        countryCode={countryCode as CountryCode}
                        withFilter
                        withFlag
                        withCallingCode
                        withCountryNameButton
                        onSelect={(country) => {
                            setCountryCode(country.cca2);
                            setCallingCode(country.callingCode[0]);
                        }}
                    />
                    <Text style={styles.callingCode}>+{callingCode}</Text>
                </View>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    label={loginMethod === 'email' ? 'Email' : 'Mobile Number'}
                    value={emailOrMobile}
                    onChangeText={text => {
                        // If login method is mobile, filter out non-numeric characters
                        if (loginMethod === 'mobile') {
                            const numericText = text.replace(/[^0-9]/g, ''); // Allow only numeric input
                            setEmailOrMobile(numericText);
                        } else {
                            setEmailOrMobile(text); // Allow normal text input for email
                        }
                    }}
                    keyboardType={loginMethod === 'email' ? 'email-address' : 'phone-pad'}
                    mode="outlined"
                    error={!!inputError}
                />
            </View>
            {inputError ? <Text style={styles.error}>{inputError}</Text> : null}
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
                mode="contained-tonal"
                onPress={handleLogin}
                style={styles.button}
            >
                Sign in / Sign up
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
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    activeSwitch: {
        color: myColors.colors.primary,
        fontWeight: 'bold',
        marginHorizontal: 10,
        fontSize: 16,
    },
    inactiveSwitch: {
        color: '#757575',
        marginHorizontal: 10,
        fontSize: 16,
    },
    countryPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    callingCode: {
        fontSize: 16,
        marginLeft: 10,
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
