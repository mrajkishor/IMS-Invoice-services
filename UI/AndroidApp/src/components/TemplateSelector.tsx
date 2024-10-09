import React, { useState } from 'react';
import { Button, Menu, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';

const TemplateSelector: React.FC = () => {
    const [templateMenuVisible, setTemplateMenuVisible] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('Template 1');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleTemplateSelect = (template: string) => {
        setSelectedTemplate(template);
        setTemplateMenuVisible(false);
    };

    const handleWebViewNavigation = () => {
        navigation.navigate('WebViewScreen'); // Navigate to the new WebView screen
    };

    return (
        <>
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Menu
                        visible={templateMenuVisible}
                        onDismiss={() => setTemplateMenuVisible(false)}
                        anchor={
                            <Button mode="outlined" onPress={() => setTemplateMenuVisible(true)}>
                                {/* {selectedTemplate} */}
                                Select
                            </Button>
                        }>
                        {[...Array(14)].map((_, index) => (
                            <Menu.Item
                                key={index}
                                onPress={() => handleTemplateSelect(`Template ${index + 1}`)}
                                title={`Template ${index + 1}`}
                            />
                        ))}
                    </Menu>
                </View>
                <View style={styles.button}>
                    <Button mode="outlined" onPress={handleWebViewNavigation}>
                        Preview
                    </Button>
                </View>

            </View>
            <Text style={styles.preview} variant="bodyMedium">{`Template Selected: ${selectedTemplate}`}</Text>

        </>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    preview: {
        margin: 10
    },
});

export default TemplateSelector;
