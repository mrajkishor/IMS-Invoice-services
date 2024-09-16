import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, RefreshControl, TouchableWithoutFeedback, Image } from 'react-native';
import { TextInput, Button, Card, List, ActivityIndicator, Text, FAB, Appbar, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { fetchShopRequest, updateShopRequest, deleteShopRequest } from '../store/actions/shopActions';
import { fetchInvoicesRequest } from '../store/actions/invoiceActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { myColors } from '../config/theme';

import { launchImageLibrary } from 'react-native-image-picker';
import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
    accessKeyId: 'AKIAVKQ3NZATRAVRR7H3', // replace with your access key
    secretAccessKey: '5jaybFr510WWEtxuXcrwbAc0AWT4XYtI5HJATDGs', // replace with your secret key
    region: 'ap-south-1', // e.g., 'us-east-1'
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: 'imsinvoicelogos' },
});

type ShopScreenRouteProp = RouteProp<RootStackParamList, 'Shop'>;

type Props = {
    route: ShopScreenRouteProp;
};

const BusinessUpdateScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const shop = useSelector((state: RootState) => state.shops.shop);
    const [editMode, setEditMode] = useState(false);
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [slogan, setSlogan] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        dispatch(fetchShopRequest(shopId));
    }, [dispatch, shopId]);

    useEffect(() => {
        if (shop) {
            setShopName(shop.name);
            setAddress(shop.address);
            setEmail(shop.email);
            setMobile(shop.mobile);
            setLogoUrl(shop.logo);
            setSlogan(shop.slogan);
        }
    }, [shop]);

    const handleUpdate = () => {
        if (editMode) {
            const updatedShop = {
                shopName,
                ownerId: shop.ownerId,
                address,
                email,
                mobile,
                logo: logoUrl,
                slogan,
            };
            dispatch(updateShopRequest(shopId, updatedShop));
        }
        setEditMode(!editMode);
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this shop?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        dispatch(deleteShopRequest(shopId));
                        navigation.goBack();
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
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

                // Check if the image size is less than 20KB
                // const imageSizeInKB = image.fileSize / 1024;
                // if (imageSizeInKB > 20) {
                //     Alert.alert('Error', 'Image size should be less than 20KB.');
                //     return;
                // }

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
        <View style={styles.container}>
            <Card mode={"elevated"} elevation={0}>
                <Card.Title title="Business Details" subtitle="Update your Business details" />
                <Card.Content>
                    <TextInput
                        label="Business Name"
                        value={shopName}
                        onChangeText={setShopName}
                        disabled={!editMode}
                    />
                    <TextInput
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        disabled={!editMode}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        disabled={!editMode}
                    />
                    <TextInput
                        label="Mobile"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        disabled={!editMode}
                    />
                    <TextInput
                        label="Slogan"
                        value={slogan}
                        onChangeText={setSlogan}
                        disabled={!editMode}
                    />
                    <Button
                        mode="outlined"
                        onPress={handleLogoUpload}
                        disabled={!editMode || isUploading}
                        loading={isUploading}
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
                </Card.Content>
            </Card>
            <Button mode="elevated" onPress={handleUpdate} style={styles.button}>
                {editMode ? 'Save Changes' : 'Update Business'}
            </Button>
            <Button mode="contained" onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
                Delete
            </Button>
        </View>
    );
};



const InvoiceListScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const invoicesState = useSelector((state: RootState) => state.invoices);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchInvoicesRequest(shopId));
    }, [dispatch, shopId]);

    const renderInvoiceItem = ({ item }: { item: any }) => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('ViewInvoice', { invoice: item })}>
            <Card mode={"elevated"} elevation={0}>
                <Card.Content>
                    <Card.Title
                        title={`Invoice ID: ${item.invoiceId}`}
                        subtitle={`Amount: ${item.amount}\nDetails: ${item.details}`}
                        right={() => <MaterialIcons name="chevron-right" size={24} color="black" />}
                    />
                </Card.Content>
            </Card>
        </TouchableWithoutFeedback>
    );

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchInvoicesRequest(shopId));
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {invoicesState.loading ? (
                <ActivityIndicator animating={true} style={styles.loader} />
            ) : invoicesState.error ? (
                <Text style={styles.error}>{invoicesState.error}</Text>
            ) : invoicesState?.invoices?.length === 0 ? (
                <Text style={styles.alert}>No Invoice Found!</Text>
            ) : (
                <FlatList
                    data={invoicesState.invoices}
                    renderItem={renderInvoiceItem}
                    keyExtractor={(item) => item.invoiceId}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('CreateInvoice', { shopId })}
            />
        </View>
    );
};

const ShopScreen: React.FC<Props> = ({ route }) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'invoices', title: 'Invoices' },
        { key: 'business', title: 'Business Update' }
    ]);

    const renderScene = SceneMap({
        invoices: () => <InvoiceListScreen route={route} />,
        business: () => <BusinessUpdateScreen route={route} />
    });
    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={styles.tabBar}
        />
    );
    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="store" />} onPress={() => { }} />
                <Appbar.Content title="My Business" />
            </Appbar.Header>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: 100 }}
                style={styles.tabView}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    button: {
        marginTop: 5,
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: myColors.colors.errorContainer,
    },
    loader: {
        marginTop: 20,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    alert: {
        color: myColors.colors.backdrop,
        textAlign: 'center',
        margin: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    tabView: {
        flex: 1,
        backgroundColor: myColors.colors.onPrimary
    },
    tabBar: {
        backgroundColor: myColors.colors.inversePrimary
    },
    // container: {
    //     flex: 1,
    //     padding: 10,
    // },
    // button: {
    //     marginTop: 5,
    //     marginBottom: 10,
    // },
    // deleteButton: {
    //     backgroundColor: myColors.colors.errorContainer,
    // },
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

export default ShopScreen;
