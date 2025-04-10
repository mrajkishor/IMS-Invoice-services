import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, Image } from 'react-native';
import { TextInput, Button, Appbar, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { createShopRequest } from '../store/actions/shopActions';
import { useNavigation } from '@react-navigation/native';
import { MainScreenNavigationProp } from 'navigationTypes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { EventRegister } from 'react-native-event-listeners';

import AWS from 'aws-sdk';

// Configure AWS S3
AWS.config.update({
    accessKeyId: 'AKIAVKQ3NZATV3NMRS6B', // replace with your access key
    secretAccessKey: '+VYoRWHywCR794TY8pQyU/Jbj9mjjANy6g14qu0a', // replace with your secret key
    region: 'ap-south-1', // e.g., 'us-east-1'
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: 'imsinvoicelogos' },
});

const CreateShopScreen: React.FC = () => {
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [slogan, setSlogan] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { error, loading } = useSelector((state: RootState) => state.shops);

    const navigation = useNavigation<MainScreenNavigationProp>();
    useEffect(() => {
        if (error) {
            setSnackbarMessage(error); // Set the error message in Snackbar
            setSnackbarVisible(true); // Show the Snackbar
        }
    }, [error]);
    const handleCreateShop = () => {

        // Email regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Mobile number regex pattern (Indian example, modify if necessary)
        const mobileRegex = /^[0-9]{10}$/;


        // Validate that all fields are filled
        if (!shopName || !shopName.trim()) {
            showSnackbar('Please enter the Business Name.');
            return;
        }

        if (!address || !address.trim()) {
            showSnackbar('Please enter the Business Address.');
            return;
        }

        // if (!email || !email.trim()) {
        //     showSnackbar('Please enter a valid Email.');
        //     return;
        // }

        // if (!emailRegex.test(email)) {
        //     showSnackbar('Please enter a valid Email.');
        //     return;
        // }

        if (!mobile || !mobile.trim()) {
            showSnackbar('Please enter the Mobile Number.');
            return;
        }

        if (!mobileRegex.test(mobile)) {
            showSnackbar('Please enter a valid 10-digit Mobile Number.');
            return;
        }

        // if (!slogan || !slogan.trim()) {
        //     showSnackbar('Please enter a Slogan.');
        //     return;
        // }

        // if (!logoUrl || !logoUrl.trim()) {
        //     showSnackbar('Please upload a Business Logo.');
        //     return;
        // }

        // Proceed only if all fields are valid
        if (user?.userId) {
            const payload = {
                shopName,
                ownerId: user.userId,
                address,
                email,
                mobile,
                logo: logoUrl,
                slogan,
            };

            dispatch(createShopRequest(payload));

            // Notify shop list screen to refresh
            EventRegister.emit('refreshShopList');
            // navigation.navigate('Main', { refresh: true });
            // Show success toast
            showSnackbar('Business created successfully!');
        }
    };



    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const handleLogoUpload = async () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: false }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets) {
                const image = response.assets[0];

                // Ensure the image has a valid URI before attempting to fetch it
                if (!image.uri) {
                    Alert.alert('Error', 'Image URI is not available.');
                    return;
                }

                setIsUploading(true);

                try {
                    // Fetch the file from the local URI and convert it to a Blob
                    const fetchResponse = await fetch(image.uri);
                    const blob = await fetchResponse.blob();

                    // Prepare S3 upload parameters without ACL
                    const params = {
                        Bucket: 'imsinvoicelogos',
                        Key: `uploads/${image.fileName}`, // Customize the folder structure
                        Body: blob, // Use Blob as the body
                        ContentType: image.type, // Use the image type
                    };

                    // Upload to S3
                    s3.upload(params, (err: any, data: { Location: React.SetStateAction<string>; }) => {
                        if (err) {
                            console.log('Error uploading image: ', err);
                            setIsUploading(false);
                        } else {
                            console.log('Successfully uploaded image: ', data);
                            setLogoUrl(data.Location); // Update your state with the uploaded image URL
                            setIsUploading(false);
                        }
                    });
                } catch (error) {
                    console.log('Upload error: ', error);
                    setIsUploading(false);
                }
            }
        });
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Action icon={(props) => <MaterialIcons {...props} name="create" />} onPress={() => { }} />
                <Appbar.Content title="Create Business" />
            </Appbar.Header>
            <View style={styles.container}>
                <TextInput
                    label="Business Name*"
                    mode={"outlined"}
                    value={shopName}
                    onChangeText={setShopName}
                    style={styles.input}
                />
                <TextInput
                    mode={"outlined"}
                    label="Business Address*"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                />
                <TextInput
                    mode={"outlined"}
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                />
                <TextInput
                    mode={"outlined"}
                    label="Mobile*"
                    value={mobile}
                    onChangeText={setMobile}
                    style={styles.input}
                    keyboardType="phone-pad"
                />
                <TextInput
                    mode={"outlined"}
                    label="Slogan"
                    value={slogan}
                    onChangeText={setSlogan}
                    style={styles.input}
                />
                <Button
                    mode="outlined"
                    onPress={handleLogoUpload}
                    disabled={isUploading}
                    loading={isUploading}
                    style={styles.uploadButton}
                >
                    {isUploading ? 'Uploading...' : 'Upload Business Logo'}
                </Button>
                {logoUrl && (
                    <View style={styles.logoPreview}>
                        <Text>Logo Preview:</Text>
                        <Image
                            source={{ uri: logoUrl }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                )}
                <Button mode={'elevated'} onPress={handleCreateShop} style={styles.button}>
                    Create new Business
                </Button>
            </View>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'OK',
                    onPress: () => {
                        setSnackbarVisible(false);
                    },
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    uploadButton: {
        marginTop: 10,
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

export default CreateShopScreen;
