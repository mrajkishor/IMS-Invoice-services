import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { loginRequest } from '../store/actions/authActions';
import { RootState } from '../store/store';
import { getAllData } from '../utils/localStorage/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp } from '../navigationTypes';

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
            <Text>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <Text>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading && <ActivityIndicator />}
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
});

export default LoginScreen;
