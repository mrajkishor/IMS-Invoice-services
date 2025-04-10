import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, FlatList, RefreshControl, TouchableWithoutFeedback, Image, ScrollView, Dimensions, Animated, Easing } from 'react-native';
import { TextInput, Button, Card, List, ActivityIndicator, Text, FAB, Appbar, Divider, BottomNavigation } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootState } from '../store/reducers';
import { RootStackParamList } from '../navigationTypes';
import { fetchShopRequest, updateShopRequest, deleteShopRequest } from '../store/actions/shopActions';
import { fetchInvoicesRequest } from '../store/actions/invoiceActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { myColors } from '../config/theme';

import { launchImageLibrary } from 'react-native-image-picker';
import AWS from 'aws-sdk';
import Spinner from 'react-native-spinkit';

// Configure AWS
AWS.config.update({
    accessKeyId: 'AKIAVKQ3NZATV3NMRS6B', // replace with your access key
    secretAccessKey: '+VYoRWHywCR794TY8pQyU/Jbj9mjjANy6g14qu0a', // replace with your secret key
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

    const [loading, setLoading] = useState(true); // Loader state
    const [fadeAnim] = useState(new Animated.Value(1)); // Animation state


    useEffect(() => {
        dispatch(fetchShopRequest(shopId));
    }, [dispatch, shopId]);

    useEffect(() => {
        if (shop) {
            // If shop data is available, populate the state and stop the loader
            setShopName(shop.shopName);
            setAddress(shop.address);
            setEmail(shop.email);
            setMobile(shop.mobile);
            setLogoUrl(shop.logo);
            setSlogan(shop.slogan);
            setLoading(false); // Stop the loader
        } else {
            // Show the loader while waiting for the shop data
            setLoading(true);
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

            // Dispatch the update shop action
            dispatch(updateShopRequest(shopId, updatedShop));

            // Optimistically update the state
            setShopName(updatedShop.shopName);
            setAddress(updatedShop.address);
            setEmail(updatedShop.email);
            setMobile(updatedShop.mobile);
            setLogoUrl(updatedShop.logo);
            setSlogan(updatedShop.slogan);

            // Fetch the updated shop details to ensure consistency
            setTimeout(() => {
                dispatch(fetchShopRequest(shopId));
            }, 500);
        }
        setEditMode(!editMode); // Toggle edit mode
    };


    const handleDelete = () => {
        Alert.alert(
            'Confirm Deactivation',
            'Are you sure you want to delete this shop?\n\nNote:\nOnce you click on delete, the shop will be deactivated for 2 weeks. Prior to 2 weeks if you can reactivate it any time. If you don\'t reactivate within this time period, your shop will be permanently deleted post 2 weeks. Are you sure you want to proceed to delete?',
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
                        Key: `uploads/${image.fileName}`,
                        Body: blob,
                        ContentType: image.type,
                    };

                    // Upload to S3
                    s3.upload(params, (err, data) => {
                        if (err) {
                            console.error('Error uploading image:', err);
                            setIsUploading(false);
                        } else {
                            console.log('Successfully uploaded image:', data.Location);
                            setLogoUrl(data.Location); // Immediately update logo URL in state
                            setIsUploading(false);
                        }
                    });
                } catch (error) {
                    console.error('Upload error:', error);
                    setIsUploading(false);
                }
            }
        });
    };


    if (loading) {
        return (
            <Animated.View style={[styles.loaderContainer, { opacity: fadeAnim }]}>
                <Spinner
                    isVisible={true}
                    size={100}
                    type="ThreeBounce"
                    color={myColors.colors.primary}
                />
            </Animated.View>
        );
    }


    return (

        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Card style={styles.cardWrapper} mode={"elevated"} elevation={0}>
                <Card.Title title="Business Details" subtitle="Update your Business details here." />
                <Card.Content>
                    <TextInput
                        style={styles.textInput}
                        label="Business Name"
                        value={shopName}
                        onChangeText={setShopName}
                        disabled={!editMode}
                    />
                    <TextInput
                        style={styles.textInput}
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        disabled={!editMode}
                    />
                    <TextInput
                        style={styles.textInput}
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        disabled={!editMode}
                    />
                    <TextInput
                        style={styles.textInput}
                        label="Mobile"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        disabled={!editMode}
                    />
                    <TextInput
                        style={styles.textInput}
                        label="Slogan"
                        value={slogan}
                        onChangeText={setSlogan}
                        disabled={!editMode}
                    />

                    <Button
                        style={styles.uploadBtn}
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
                                source={{ uri: `${logoUrl}?timestamp=${new Date().getTime()}` }} // Bypass cache
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>
                    )}

                </Card.Content>
            </Card>
            <Button icon={(props) => <MaterialIcons {...props} name={editMode ? "save" : "update"} size={20} />}
                mode="elevated" onPress={handleUpdate} style={styles.button}>
                {editMode ? 'Save Changes' : 'Update Business'}
            </Button>

            <Button icon={(props) => <MaterialIcons {...props} name="delete" size={20} />}
                mode="text" onPress={handleDelete} style={[styles.button]} labelStyle={styles.deleteButton}>
                DELETE THIS BUSINESS
            </Button>
        </ScrollView>
    );
};



const InvoiceListScreen: React.FC<Props> = ({ route }) => {
    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const invoicesState = useSelector((state: RootState) => state.invoices);
    const [refreshing, setRefreshing] = useState(false);

    const statusIcons: { [key: string]: string } = {
        Draft: 'edit',
        Pending: 'hourglass-empty',
        Unpaid: 'money-off',
        'Partially Paid': 'money',
        Paid: 'check-circle',
        Overdue: 'error',
        Cancelled: 'cancel',
        Processing: 'autorenew',
    };
    useEffect(() => {
        dispatch(fetchInvoicesRequest(shopId));
    }, [dispatch, shopId]);

    useFocusEffect( // triggered when navigating back
        useCallback(() => {
            dispatch(fetchInvoicesRequest(shopId));
        }, [dispatch, shopId])
    );

    // Listen for navigation changes to detect invoice creation
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchInvoicesRequest(shopId)); // Refresh invoices when the screen gains focus
        });

        return unsubscribe; // Cleanup the listener on component unmount
    }, [dispatch, navigation, shopId]);

    const renderInvoiceItem = ({ item }: { item: any }) => {
        const statusColors: { [key: string]: string } = {
            Draft: '#FFCC00', // Yellow
            Pending: '#FFA500', // Orange
            Unpaid: '#FF5733', // Red
            'Partially Paid': '#FFC300', // Amber
            Paid: '#4CAF50', // Green
            Overdue: '#FF0000', // Dark Red
            Cancelled: '#9E9E9E', // Grey
            Processing: '#2196F3', // Blue
        };
        const statusBackgroundColor = statusColors[item.paymentStatus] || '#FFFFFF'; // Default to white if no match

        return (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('ViewInvoice', { invoice: item })}>
                <Card style={styles.listItemWrapper} mode="elevated" elevation={1}>
                    <Card.Content>
                        <View style={styles.invoiceRow}>
                            <View style={styles.invoiceDetails}>
                                <Text numberOfLines={1} style={styles.invoiceId}>
                                    {`Invoice ID: ${item.invoiceId}`}
                                </Text>
                                <Text style={styles.billedTo}>
                                    {`Billed To: ${item?.billedTo?.customer?.name}`}
                                </Text>
                                <Text style={styles.invoiceDate}>
                                    {`Invoice Date: ${item?.invoiceDateTimeStamp}`}
                                </Text>
                            </View>
                            <View style={[styles.invoiceStatusBadge, { backgroundColor: statusBackgroundColor }]}>
                                <MaterialIcons
                                    name={statusIcons[item.paymentStatus]}
                                    size={20}
                                    style={styles.statusIcon}
                                    color={'#FFFFFF'}

                                />
                                <Text style={styles.statusText}>{item.paymentStatus}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableWithoutFeedback>
        )
    };


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
                <View style={styles.noInvoiceContainer}>
                    <MaterialIcons name="insert-drive-file" size={64} color="#FFCC00" style={styles.noInvoiceIcon} />
                    <Text style={styles.noInvoiceText}>No Invoices Found</Text>
                    <Text style={styles.noInvoiceSubText}>Start creating invoices to manage your business easily!</Text>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('CreateInvoice', { shopId, mode: 'create' })}
                        style={styles.createInvoiceButton}
                    >
                        Create Your First Invoice
                    </Button>
                </View>) : (
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
                onPress={() => navigation.navigate('CreateInvoice', { shopId, mode: "create" })}
            />
        </View>
    );
};

const ShopScreen: React.FC<Props> = ({ route }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { initialTab } = route.params;

    const [index, setIndex] = useState(0);
    const [layoutWidth, setLayoutWidth] = useState(Dimensions.get('window').width);  // Default to screen width
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set the index based on the initialTab parameter
        if (initialTab === 'business') {
            setIndex(1); // Set to 1 for business tab
        } else {
            setIndex(0); // Default to invoices tab
        }
        setLoading(false);

    }, [initialTab]);

    const [routes] = useState([
        { key: 'invoices', title: 'Invoices', focusedIcon: 'receipt', unfocusedIcon: 'receipt' },
        { key: 'business', title: 'Business Update', focusedIcon: 'store', unfocusedIcon: 'store' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        invoices: () => <InvoiceListScreen route={route} />,
        business: () => <BusinessUpdateScreen route={route} />
    });
    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: myColors.colors.primary }}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
        />
    );
    const onLayout = (event: any) => {
        // Get the container width when the component is rendered
        const { width } = event.nativeEvent.layout;
        setLayoutWidth(width);
    };
    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="store" />} onPress={() => { }} />
                <Appbar.Content title="My Business" />
            </Appbar.Header>
            {/* <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: 100 }}
                style={styles.tabView}
            /> */}

            {loading ? (
                <ActivityIndicator animating={true} size="large" style={styles.loader} />
            ) : (
                <View onLayout={onLayout} style={styles.tabView}>
                    {/* <TabView
                        renderTabBar={renderTabBar}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layoutWidth }}  // Set the width dynamically
                        style={styles.tabView}
                    /> */}
                    <BottomNavigation
                        navigationState={{ index, routes }}
                        onIndexChange={setIndex}
                        renderScene={renderScene}
                        style={styles.container}
                    />
                </View>
            )}

        </>
    );
};

const styles = StyleSheet.create({
    noInvoiceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: myColors.colors.onPrimary,
    },
    noInvoiceIcon: {
        marginBottom: 16,
    },
    noInvoiceText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: myColors.colors.primary,
        marginBottom: 8,
    },
    noInvoiceSubText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    createInvoiceButton: {
        marginTop: 16,
        backgroundColor: myColors.colors.surface,
    },
    invoiceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    invoiceDetails: {
        flex: 1,
    },
    invoiceId: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333333',
        marginBottom: 4,
    },
    billedTo: {
        fontSize: 14,
        color: '#666666',
    },
    invoiceDate: {
        fontSize: 12,
        color: '#999999',
        marginTop: 4,
    },
    invoiceStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 4,
        marginLeft: 10,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginLeft: 5,
        fontWeight: '600',

    },
    statusIcon: {
        marginLeft: 'auto',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: myColors.colors.surface,

    },
    cardWrapper: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: myColors.colors.primary,
        borderWidth: 0,
        backgroundColor: myColors.colors.surface,
    },
    button: {
        margin: 10,
    },
    deleteButton: {
        color: myColors.colors.error,
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
        color: myColors.colors.onBackground,
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
        backgroundColor: myColors.colors.onPrimary,
    },
    tabBar: {
        backgroundColor: myColors.colors.onPrimary
    },
    tabLabel: {
        color: myColors.colors.primary
    },
    container: {
        backgroundColor: myColors.colors.surface, flex: 1,
    },
    listItemWrapper: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: myColors.colors.surface,
        padding: 10,
        justifyContent: 'space-between',
        margin: 10,
    },
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
    uploadBtn: {
        marginTop: 10
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    textInput: {
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    invoiceStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },

});

export default ShopScreen;
