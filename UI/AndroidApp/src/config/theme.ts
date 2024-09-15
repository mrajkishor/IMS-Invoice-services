import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

export const myColors = {
    colors: {
        "primary": "rgb(98, 0, 238)", // Deep Purple (Material Design)
        "onPrimary": "rgb(255, 255, 255)",
        "primaryContainer": "rgb(224, 191, 255)", // Light Lavender for contrast
        "onPrimaryContainer": "rgb(29, 0, 84)", // Dark Purple
        "secondary": "rgb(3, 218, 197)", // Teal (Material Design)
        "onSecondary": "rgb(0, 77, 64)",
        "secondaryContainer": "rgb(178, 255, 241)", // Light Aqua
        "onSecondaryContainer": "rgb(0, 105, 92)",
        "tertiary": "rgb(255, 143, 0)", // Deep Orange (Material Design)
        "onTertiary": "rgb(255, 255, 255)",
        "tertiaryContainer": "rgb(255, 209, 128)", // Light Orange
        "onTertiaryContainer": "rgb(102, 60, 0)",
        "error": "rgb(211, 47, 47)", // Red (Material Design)
        "onError": "rgb(255, 255, 255)",
        "errorContainer": "rgb(255, 204, 204)",
        "onErrorContainer": "rgb(102, 0, 0)",
        "background": "rgb(250, 250, 250)", // Light background for readability
        "onBackground": "rgb(33, 33, 33)",
        "surface": "rgb(255, 255, 255)",
        "onSurface": "rgb(33, 33, 33)",
        "surfaceVariant": "rgb(224, 224, 224)", // Light Gray for contrast
        "onSurfaceVariant": "rgb(66, 73, 64)",
        "outline": "rgb(121, 134, 139)", // Subtle Gray for outline
        "outlineVariant": "rgb(189, 189, 189)",
        "shadow": "rgb(0, 0, 0)",
        "scrim": "rgb(0, 0, 0)",
        "inverseSurface": "rgb(66, 66, 66)",
        "inverseOnSurface": "rgb(255, 255, 255)",
        "inversePrimary": "rgb(160, 117, 255)", // Lighter Purple
        "elevation": {
            "level0": "transparent",
            "level1": "rgb(240, 240, 240)",
            "level2": "rgb(230, 230, 230)",
            "level3": "rgb(220, 220, 220)",
            "level4": "rgb(210, 210, 210)",
            "level5": "rgb(200, 200, 200)"
        },
        "surfaceDisabled": "rgba(0, 0, 0, 0.12)",
        "onSurfaceDisabled": "rgba(0, 0, 0, 0.38)",
        "backdrop": "rgba(33, 33, 33, 0.4)"
    },
    gradients: {
        primaryGradient: ['#7B1FA2', '#673AB7'], // Vibrant Purple Gradient
        secondaryGradient: ['#009688', '#4CAF50'], // Teal to Green
        tertiaryGradient: ['#F57C00', '#FF9800'], // Orange gradient
    }
}

const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
        ...DefaultTheme.colors,
        ...myColors.colors
    },
};

export default theme;
