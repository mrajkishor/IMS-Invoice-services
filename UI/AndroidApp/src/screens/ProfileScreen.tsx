import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, ScrollView, RefreshControl, BackHandler, Animated, TouchableOpacity } from 'react-native';
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
import Spinner from 'react-native-spinkit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


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

interface ProfileScreenProps {
    setIndex: (index: number) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
    setIndex
}) => {
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
    const [designation, setDesignation] = useState('Owner');
    const [isUploading, setIsUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);  // Refresh control state

    // Add a new state for handling the artificial delay
    const [isArtificiallyLoading, setIsArtificiallyLoading] = useState(true);

    // Animated value for opacity
    const loaderOpacity = new Animated.Value(1); // fully visible

    useEffect(() => { // show loader for 2000ms post data fetch.. This is to give extra time for inputs to render fetched text in it and the app will appear professional.  
        // Simulate delay after loading is complete
        if (!loading) {
            const delayTimeout = setTimeout(() => {
                Animated.timing(loaderOpacity, {
                    toValue: 0, //transition to 0 i.e invisible
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => setIsArtificiallyLoading(false)); // Once animation is complete, hide loader
            }, 2000); // Adjust the delay time here (e.g., 2000ms = 2 seconds)

            return () => clearTimeout(delayTimeout); // Clean up the timeout when the component unmounts or dependencies change
        }
    }, [loading]);


    // Handle back button press to go to shops tab (from hardware)
    useEffect(() => {
        const backAction = () => {
            setIndex(0); // Set the index to 0 to go to the shops tab
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove(); // Clean up listener
    }, [setIndex]);

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchUserRequest(user.userId));
        }
    }, [dispatch, user?.userId]);

    // useEffect(() => {
    //     if (fetchedUser) {
    //         setUsername(fetchedUser.username);
    //         setFullName(fetchedUser.fullName || '');
    //         setSignatureInWords(fetchedUser.signatureInWords || '');
    //         setDesignation(fetchedUser.designation || '');
    //         if (fetchedUser.signaturePhoto) {
    //             setSignaturePhoto(fetchedUser.signaturePhoto);
    //         }
    //         if (fetchedUser.email) {
    //             setEmail(fetchedUser.email);
    //         } else if (fetchedUser.mobile) {
    //             setMobile(fetchedUser.mobile);
    //         }
    //     }
    // }, [fetchedUser]);

    useEffect(() => {
        if (fetchedUser) {
            setUsername(fetchedUser.username || '');
            setFullName(fetchedUser.fullName || '');
            setSignatureInWords(fetchedUser.signatureInWords || '');
            setDesignation(fetchedUser.designation || 'Owner');
            setSignaturePhoto(fetchedUser.signaturePhoto || '');
            setEmail(fetchedUser.email || '');
            setMobile(fetchedUser.mobile || '');
        }
    }, [fetchedUser]);


    const handleLogout = () => {
        // Clear local state
        setUsername('');
        setFullName('');
        setSignatureInWords('');
        setDesignation('');
        setSignaturePhoto(''); // Clear signature photo
        setEmail('');
        setMobile('');

        // Clear AsyncStorage and navigate to login screen
        AsyncStorage.clear();
        dispatch(logoutRequest());
        navigation.navigate('Login');
    };

    // const handleUpdate = () => {
    //     if (editMode && user?.userId) {
    //         const updatePayload: any = { username, fullName, signatureInWords, designation };

    //         if (email) {
    //             updatePayload.email = email;
    //         } else if (mobile) {
    //             updatePayload.mobile = mobile;
    //         }

    //         if (signaturePhoto) {
    //             updatePayload.signaturePhoto = signaturePhoto;
    //         }

    //         // Dispatch update user request
    //         dispatch(updateUserRequest(user.userId, updatePayload));

    //         // Re-fetch the updated user data after successful update
    //         setTimeout(() => {
    //             dispatch(fetchUserRequest(user.userId)); // Fetch the updated user data to reflect changes
    //         }, 500); // Adding a small delay to give time for the update to complete
    //     }
    //     setEditMode(!editMode);
    // };


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

            // Dispatch update user request
            dispatch(updateUserRequest(user.userId, updatePayload));

            // Update local state immediately (optimistic UI)
            setUsername(updatePayload.username || username);
            setFullName(updatePayload.fullName || fullName);
            setSignatureInWords(updatePayload.signatureInWords || signatureInWords);
            setDesignation(updatePayload.designation || designation);
            setSignaturePhoto(updatePayload.signaturePhoto || signaturePhoto);
            setEmail(updatePayload.email || email);
            setMobile(updatePayload.mobile || mobile);
        }
        setEditMode(!editMode); // Toggle edit mode
    };



    const handleDelete = () => {
        Alert.alert(
            'Confirm Deactivation',
            'Are you sure you want to deactivate your account?\n\nNote:\nOnce you deactivate your account, within 14 days your account will be permanently deleted. If you login with in these 14 days your account will be restored again.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Proceed to Deactivate',
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

    // if (loading || isArtificiallyLoading) {
    //     return <ActivityIndicator animating={true} style={styles.loader} />;
    // }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }



    const handleSelectImage = () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: false }, async (response) => {
            if (response.didCancel || response.errorMessage || !response.assets) {
                console.log('User cancelled or there was an error in image picker');
                return;
            }

            const image = response.assets[0];

            if (!image.uri || !image.fileSize || !image.width || !image.height) {
                Alert.alert('Error', 'Image details are not available.');
                return;
            }

            // Validate image size (e.g., max 5MB)
            const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
            if (image.fileSize > maxSizeInBytes) {
                Alert.alert('Error', 'Image size should be less than 5MB.');
                return;
            }

            // Validate image dimensions (e.g., max width and height)
            const maxWidth = 2000; // Set your max width
            const maxHeight = 2000; // Set your max height
            if (image.width > maxWidth || image.height > maxHeight) {
                Alert.alert(
                    'Error',
                    `Image dimensions should be less than ${maxWidth}x${maxHeight} pixels.`
                );
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

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {
                    setIndex(0); //Go to shops tab when back button is pressed (in software) 
                }} />
                <Appbar.Action icon={(props) => <MaterialIcons {...props} name="settings" />} onPress={() => { }} />
                <Appbar.Content title="Account Settings" />
            </Appbar.Header>
            {/* Render the content, regardless of loading state */}

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.container}>
                    <Card style={styles.cardWrapper} mode={"elevated"} elevation={2}>
                        <Card.Title title="User Details" subtitle="Changes appear on the invoice" />
                        <Card.Content >
                            {editMode ? (<TextInput
                                label="Username"
                                value={username}
                                onChangeText={setUsername}
                                disabled={!editMode}
                                style={[styles.input, editMode && styles.editableInput]}
                            />) : (
                                <View style={styles.container}>
                                    <Text style={styles.label}>Username</Text>
                                    <Text style={styles.text}>{username}</Text>
                                </View>
                            )}


                            {editMode ? (<TextInput
                                label="Full Name"
                                value={fullName}
                                onChangeText={setFullName}
                                disabled={!editMode}
                                style={[styles.input, editMode && styles.editableInput]}
                            />) : (
                                <View style={styles.container}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <Text style={styles.text}>{fullName}</Text>
                                </View>
                            )}

                            {editMode ? (<TextInput
                                label="Signature In Words"
                                value={signatureInWords}
                                onChangeText={setSignatureInWords}
                                disabled={!editMode}
                                style={[styles.input, editMode && styles.editableInput]}
                            />) : (
                                <View style={styles.container}>
                                    <Text style={styles.label}>Signature In Words</Text>
                                    <Text style={styles.text}>{signatureInWords}</Text>
                                </View>
                            )}

                            {editMode ? (<TextInput
                                label="Designation"
                                value={designation}
                                onChangeText={setDesignation}
                                disabled={!editMode}
                                style={[styles.input, editMode && styles.editableInput]}
                            />) : (
                                <View style={styles.container}>
                                    <Text style={styles.label}>Designation</Text>
                                    <Text style={styles.text}>{designation}</Text>
                                </View>
                            )}


                            {email ? (

                                editMode ? (< TextInput
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    disabled={!editMode}
                                    style={[styles.input, editMode && styles.editableInput]}
                                    readOnly={true}
                                />) : (
                                    <View style={styles.container}>
                                        <Text style={styles.label}>Email</Text>
                                        <Text style={styles.text}>{email}</Text>
                                    </View>
                                )

                            ) : (

                                editMode ? (<TextInput
                                    label="Mobile Number"
                                    value={mobile}
                                    onChangeText={setMobile}
                                    disabled={!editMode}
                                    style={[styles.input, editMode && styles.editableInput]}
                                />) : (
                                    <View style={styles.container}>
                                        <Text style={styles.label}>Mobile Number</Text>
                                        <Text style={styles.text}>{mobile}</Text>
                                    </View>
                                )

                            )}
                            {/* <Button
                                mode="outlined"
                                onPress={handleSignatureUpload}
                                disabled={!editMode || isUploading}
                                loading={isUploading}
                            >
                                {isUploading ? 'Uploading...' : 'Upload Signature Photo'}
                            </Button> */}

                            {/* 
                            {signaturePhoto && (
                                <View style={styles.logoPreview}>
                                    <Image source={{ uri: signaturePhoto }} style={styles.logo} resizeMode="contain" />
                                </View>
                            )} */}


                            <TouchableOpacity style={!editMode ? styles.showZone : styles.dropZone} onPress={() => { editMode && handleSelectImage() }}>
                                {!signaturePhoto ? (
                                    <>

                                        {
                                            editMode && (<>
                                                <MaterialIcons name="file-upload" size={48} color={myColors.colors.primary} />
                                                <Text style={!editMode ? styles.showZoneText : styles.dropZoneText}>Tap to Upload Signature Photo</Text>
                                            </>)
                                        }

                                    </>
                                ) : (
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: signaturePhoto }} style={styles.uploadedImage} resizeMode="contain" />
                                        {editMode && (

                                            <TouchableOpacity onPress={() => setSignaturePhoto('')} style={styles.deleteButtonForSignature}>
                                                <MaterialIcons name="delete" size={24} color={myColors.colors.error} />
                                            </TouchableOpacity>

                                        )}

                                    </View>
                                )}
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                    <Button
                        mode="elevated"
                        onPress={handleUpdate}
                        style={styles.button}
                        icon={(props) => (
                            <MaterialIcons {...props} name={editMode ? 'save' : 'edit'} size={20} />
                        )}
                    >
                        {editMode ? 'Save' : 'Update'}
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={handleLogout}
                        style={styles.button}
                        icon={(props) => <MaterialIcons {...props} name="logout" size={20} />}
                    >
                        Logout
                    </Button>

                    <Button
                        mode="text"
                        onPress={handleDelete}
                        contentStyle={styles.deleteButtonContent}
                        labelStyle={styles.deleteButtonText}
                        icon={(props) => <MaterialIcons {...props} name="delete" size={20} />}
                    >
                        Deactivate Account
                    </Button>

                </View>
            </ScrollView>



            {/* Display loader overlay while `isArtificiallyLoading` is true */}
            {isArtificiallyLoading && (
                <Animated.View style={[styles.loaderOverlay, { opacity: loaderOpacity }]}>
                    {/* <ActivityIndicator animating={true} size="large" /> */}
                    <Spinner
                        isVisible={true}
                        size={100}
                        type="ThreeBounce"
                        color={myColors.colors.primary}
                    />
                </Animated.View>
            )}


        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    container: {
        flex: 1,
        paddingBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
    editableInput: {
        backgroundColor: myColors.colors.surface,
    },
    button: {
        margin: 10,
    },
    deleteButton: {
        color: myColors.colors.error,
        margin: 10,
        textTransform: 'uppercase',
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        color: 'black',
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
    loaderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: myColors.colors.onPrimary,
        zIndex: 1000, // Ensure it is above everything
    },
    cardWrapper: {
        paddingTop: 16,
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: myColors.colors.primary,
        backgroundColor: myColors.colors.surface,
    },
    showZone: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    showZoneText: {
        color: myColors.colors.primary,
    },
    dropZone: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: myColors.colors.primary,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: myColors.colors.surface,
        marginBottom: 16,
    },
    dropZoneText: {
        marginTop: 8,
        fontSize: 14,
        color: myColors.colors.primary,
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadedImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    deleteButtonForSignature: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 2,
        elevation: 2, // Optional: to add a shadow effect
    },
    deleteButtonContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: myColors.colors.error, // Set the text color to red or your desired color
        textTransform: 'uppercase', // Optional: to make the text uppercase
    },
    userDetailsWrapper: {
        backgroundColor: myColors.colors.surface,
    },
});

export default ProfileScreen;
