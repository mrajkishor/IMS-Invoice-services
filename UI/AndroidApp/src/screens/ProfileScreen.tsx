import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, ScrollView, RefreshControl } from 'react-native';
import { Button, Card, ActivityIndicator, Text, TextInput, Appbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { logoutRequest } from '../store/actions/authActions';
import { fetchUserRequest, updateUserRequest, deleteUserRequest } from '../store/actions/userActions';
import { RootStackParamList } from '../navigationTypes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { myColors } from '../config/theme';
import { launchImageLibrary } from 'react-native-image-picker';
import AWS from 'aws-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AWS S3 Configuration (as in your previous screen)
AWS.config.update({
    accessKeyId: 'AKIAVKQ3NZATV3NMRS6B', // replace with your access key
    secretAccessKey: '+VYoRWHywCR794TY8pQyU/Jbj9mjjANy6g14qu0a', // replace with your secret key
    region: 'ap-south-1', // e.g., 'us-east-1'
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: 'imsinvoicelogos' },
});

const ProfileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const authState = useSelector((state: RootState) => state.auth);
    const userState = useSelector((state: RootState) => state.users);
    const { user } = authState;
    const { loading, user: fetchedUser, error } = userState;

    // State for the new fields
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [signaturePhoto, setSignaturePhoto] = useState('');
    const [signatureInWords, setSignatureInWords] = useState('');
    const [designation, setDesignation] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const [refreshing, setRefreshing] = useState(false);  // Refresh control state

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchUserRequest(user.userId));
        }
    }, [dispatch, user?.userId]);

    useEffect(() => {
        if (fetchedUser) {
            setUsername(fetchedUser.username);
            setFullName(fetchedUser.fullName || '');
            setSignatureInWords(fetchedUser.signatureInWords || '');
            setDesignation(fetchedUser.designation || '');
            if (fetchedUser.signaturePhoto) {
                setSignaturePhoto(fetchedUser.signaturePhoto);
            }
            if (fetchedUser.email) {
                setEmail(fetchedUser.email);
            } else if (fetchedUser.mobile) {
                setMobile(fetchedUser.mobile);
            }
        }
    }, [fetchedUser]);

    const handleLogout = () => {
        dispatch(logoutRequest());
        navigation.navigate('Login');
        AsyncStorage.clear();
    };

    const handleUpdate = () => {
        if (editMode && user?.userId) {
            const updatePayload: any = { username, fullName, signatureInWords, designation };

            if (email) {
                updatePayload.email = email;
            } else if (mobile) {
                updatePayload.mobile = mobile;
            }

            if (signaturePhoto) {
                updatePayload.signaturePhoto = signaturePhoto;
            }

            dispatch(updateUserRequest(user.userId, updatePayload));
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

    const handleSignatureUpload = () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: false }, async (response) => {
            if (response.didCancel || response.errorMessage || !response.assets) {
                console.log('User cancelled or there was an error in image picker');
                return;
            }

            const image = response.assets[0];

            if (!image.uri) {
                Alert.alert('Error', 'Image URI is not available.');
                return;
            }

            setIsUploading(true);

            try {
                const fetchResponse = await fetch(image.uri);
                const blob = await fetchResponse.blob();

                const params = {
                    Bucket: 'imsinvoicelogos',
                    Key: `signatures/${image.fileName}`,
                    Body: blob,
                    ContentType: image.type,
                };

                s3.upload(params, (err: any, data: { Location: React.SetStateAction<string>; }) => {
                    if (err) {
                        console.error('Error uploading signature:', err);
                        setIsUploading(false);
                    } else {
                        setSignaturePhoto(data.Location); // Update the signature photo URL
                        setIsUploading(false);
                    }
                });
            } catch (error) {
                console.error('Upload error:', error);
                setIsUploading(false);
            }
        });
    };

    // Refresh control for pull to refresh
    const onRefresh = () => {
        setRefreshing(true);
        if (user?.userId) {
            dispatch(fetchUserRequest(user.userId)); // Re-fetch user data on refresh
        }
        setRefreshing(false);
    };

    if (loading) {
        return <ActivityIndicator animating={true} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Action icon={(props) => <MaterialIcons {...props} name="settings" />} onPress={() => { }} />
                <Appbar.Content title="Account Settings" />
            </Appbar.Header>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.container}>
                    <Card mode={"elevated"} elevation={0}>
                        <Card.Title title="Change User Details" subtitle="Changes appear on the invoice" />
                        <Card.Content>
                            <TextInput
                                label="Username"
                                value={username}
                                onChangeText={setUsername}
                                disabled={!editMode}
                                style={styles.input}
                            />
                            <TextInput
                                label="Full Name"
                                value={fullName}
                                onChangeText={setFullName}
                                disabled={!editMode}
                                style={styles.input}
                            />
                            <TextInput
                                label="Signature In Words"
                                value={signatureInWords}
                                onChangeText={setSignatureInWords}
                                disabled={!editMode}
                                style={styles.input}
                            />
                            <TextInput
                                label="Designation"
                                value={designation}
                                onChangeText={setDesignation}
                                disabled={!editMode}
                                style={styles.input}
                            />
                            {email ? (
                                <TextInput
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    disabled={!editMode}
                                    style={styles.input}
                                />
                            ) : (
                                <TextInput
                                    label="Mobile Number"
                                    value={mobile}
                                    onChangeText={setMobile}
                                    disabled={!editMode}
                                    style={styles.input}
                                />
                            )}
                            <Button
                                mode="outlined"
                                onPress={handleSignatureUpload}
                                disabled={!editMode || isUploading}
                                loading={isUploading}
                            >
                                {isUploading ? 'Uploading...' : 'Upload Signature Photo'}
                            </Button>
                            {signaturePhoto && (
                                <View style={styles.logoPreview}>
                                    <Image source={{ uri: signaturePhoto }} style={styles.logo} resizeMode="contain" />
                                </View>
                            )}
                        </Card.Content>
                    </Card>
                    <Button mode="elevated" onPress={handleUpdate} style={styles.button}>
                        {editMode ? 'Save' : 'Update'}
                    </Button>
                    <Button mode="outlined" onPress={handleLogout} style={styles.button}>
                        Logout
                    </Button>
                    <Button mode="contained" onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
                        Delete Account
                    </Button>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },
    container: {
        flex: 1,
        paddingBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    deleteButton: {
        backgroundColor: myColors.colors.errorContainer,
        display: 'flex',
        justifyContent: 'flex-end',
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
    logoPreview: {
        marginTop: 10,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: 10,
    },
});

export default ProfileScreen;
