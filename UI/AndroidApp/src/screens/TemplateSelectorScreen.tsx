import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { RadioButton, Button, Appbar, TouchableRipple } from 'react-native-paper';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';

type TemplateSelectorScreenRouteProp = RouteProp<RootStackParamList, 'TemplateSelector'>;

type Props = {
    route: TemplateSelectorScreenRouteProp;
};

const TemplateSelectorScreen: React.FC<Props> = ({ route }) => {
    const { templateId: initialTemplateId = "1", onSelect } = route.params; // Destructure and set default value
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(initialTemplateId);
    const navigation = useNavigation();

    useEffect(() => {
        // If selectedTemplate is null, default to initialTemplateId
        if (selectedTemplate === null) {
            setSelectedTemplate(initialTemplateId);
        }
    }, [selectedTemplate, initialTemplateId]);

    const handleConfirm = () => {
        if (selectedTemplate !== null) {
            onSelect(selectedTemplate);
            navigation.goBack();
        }
    };

    const templateImages = {
        "1": require('../assets/images/templates/1.jpg'),
        "2": require('../assets/images/templates/2.jpg'),
        "3": require('../assets/images/templates/3.jpg'),
        "4": require('../assets/images/templates/4.jpg'),
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Select Template" />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.gridContainer}>
                    {["1", "2", "3", "4"].map((templateId) => (
                        <TouchableRipple
                            key={templateId}
                            onPress={() => setSelectedTemplate(templateId)}
                            style={[
                                styles.gridItem,
                                selectedTemplate === templateId && styles.selectedGridItem,
                            ]}
                        >
                            <View style={styles.gridContent}>
                                <Image source={templateImages[templateId]} style={styles.image} />
                                <Text style={styles.gridLabel}>{`Template ${templateId}`}</Text>
                                <RadioButton
                                    value={templateId}
                                    status={selectedTemplate === templateId ? 'checked' : 'unchecked'}
                                    onPress={() => setSelectedTemplate(templateId)}
                                />
                            </View>
                        </TouchableRipple>
                    ))}
                </View>
                <Button mode="contained" onPress={handleConfirm} style={styles.confirmButton}>
                    Confirm
                </Button>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '45%',
        height: 200, // Adjusted height to accommodate image
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedGridItem: {
        borderColor: '#6200ee',
        backgroundColor: '#f1f1f1',
    },
    gridContent: {
        alignItems: 'center',
    },
    image: {
        width: 100, // Adjust the size as necessary
        height: 100,
        marginBottom: 10,
    },
    gridLabel: {
        marginBottom: 10,
    },
    confirmButton: {
        marginTop: 20,
    },
});

export default TemplateSelectorScreen;
