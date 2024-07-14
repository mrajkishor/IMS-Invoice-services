import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, ActivityIndicator, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { logoutRequest } from '../store/actions/authActions';
import { fetchUserRequest, updateUserRequest, deleteUserRequest } from '../store/actions/userActions';
import { RootStackParamList } from '../navigationTypes';

const ProfileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const authState = useSelector((state: RootState) => state.auth);
    const userState = useSelector((state: RootState) => state.users);
    const { user } = authState;
    const { loading, user: fetchedUser, error } = userState;
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchUserRequest(user.userId));
        }
    }, [dispatch, user?.userId]);

    useEffect(() => {
        if (fetchedUser) {
            setUsername(fetchedUser.username);
        }
    }, [fetchedUser]);

    const handleLogout = () => {
        dispatch(logoutRequest());
        navigation.navigate('Login'); // Redirect to the Login screen
    };

    const handleUpdate = () => {
        if (editMode && user?.userId) {
            dispatch(updateUserRequest(user.userId, { username }));
        }
        setEditMode(!editMode);
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete your account?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        if (user?.userId) {
                            dispatch(deleteUserRequest(user.userId));
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    if (loading) {
        return <ActivityIndicator animating={true} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title title="Profile Settings" />
                <Card.Content>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        disabled={!editMode}
                        style={styles.input}
                    />
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                {editMode ? 'Save' : 'Update'}
            </Button>
            <Button mode="contained" onPress={handleLogout} style={styles.button}>
                Logout
            </Button>
            <Button mode="contained" onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
                Delete Account
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
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
});

export default ProfileScreen;
