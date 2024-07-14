import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import { loginRequest } from '../store/actions/authActions';
import { RootState } from '../store/store';
import { getAllData } from '../utils/localStorage/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp } from '../navigationTypes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleLogin = () => {
        dispatch(loginRequest(email, password));
        getAllData().then((data) => console.log('All AsyncStorage Data:', data));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigation.navigate('Main');
        }
    }, [isAuthenticated, navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} color="#1E90FF" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    mode="outlined"
                    theme={{ colors: { primary: '#1E90FF' } }}
                />
            </View>
            <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#1E90FF" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    theme={{ colors: { primary: '#1E90FF' } }}
                />
            </View>
            {loading && <ActivityIndicator animating={true} color="#1E90FF" />}
            {error && <Text style={styles.error}>{error}</Text>}
            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                theme={{ colors: { primary: '#1E90FF' } }}
            >
                Login
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        marginRight: 8,
        borderRadius: 10
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
