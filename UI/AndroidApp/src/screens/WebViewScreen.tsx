import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Divider, Button, SegmentedButtons, Appbar, ActivityIndicator } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
type TemplateSelectorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TemplateSelector'>;

const WebViewScreen: React.FC = () => {
    const navigation = useNavigation<TemplateSelectorScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Action icon={(props) => <MaterialIcons  {...props} name="preview" />} onPress={() => { }} />
                <Appbar.Content title="Preview" />
            </Appbar.Header>
            <WebView source={{ uri: 'https://www.chalaan.com/preview' }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default WebViewScreen;
