import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
export const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
        console.error(e);
    }
};

// Retrieve data
export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // value previously stored
            return value;
        }
    } catch (e) {
        // error reading value
        console.error(e);
    }
};

// Retrieve all data
export const getAllData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        const data = result.reduce<{ [key: string]: string | null }>((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        console.log('All AsyncStorage Data:', data);
        return data;
    } catch (e) {
        // error reading value
        console.error(e);
    }
};

// use case
// storeData('accessToken', 'your-access-token');
// storeData('refreshToken', 'your-refresh-token');

// getData('accessToken').then((token) => console.log('Access Token:', token));
// getData('refreshToken').then((token) => console.log('Refresh Token:', token));
// getAllData().then((data) => console.log('All AsyncStorage Data:', data));
