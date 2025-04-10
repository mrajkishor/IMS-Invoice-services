import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

// theme colors guide 
// Primary: Deep Blue (#2C3E50) – for buttons or highlights.
// Secondary: Light Gray (#BDC3C7) – for background sections.
// Accent: Light Green (#27AE60) – for success messages or actions.
// Error: Light Red (#E74C3C) – for errors or alerts.
// Background: White (#FFFFFF) – for clean, simple readability.


export const myColors = {
    colors: {
        primary: "#2ECC71", // Light Green
        onPrimary: "#FFFFFF", // White
        primaryContainer: "#27AE60", // Darker Green
        onPrimaryContainer: "#FFFFFF", // White
        secondary: "#BDC3C7", // Light Gray
        onSecondary: "#2C3E50", // Deep Blue
        secondaryContainer: "#ECF0F1", // Lighter Gray
        onSecondaryContainer: "#2C3E50", // Deep Blue
        accent: "#2C3E50", // Deep Blue
        onAccent: "#FFFFFF", // White
        accentContainer: "#34495E", // Darker Blue
        onAccentContainer: "#FFFFFF", // White
        error: "#E74C3C", // Light Red
        onError: "#FFFFFF", // White
        background: "#FFFFFF", // White
        onBackground: "#2C3E50", // Deep Blue
        surface: "#FFFFFF", // White
        onSurface: "#2C3E50", // Deep Blue
        surfaceVariant: "#BDC3C7", // Light Gray
        onSurfaceVariant: "#2C3E50", // Deep Blue
        outline: "#7F8C8D", // Gray
        onOutline: "#2C3E50", // Deep Blue
    },
    gradients: {
        primaryGradient: ['#2ECC71', '#27AE60'], // Light Green to Darker Green
        secondaryGradient: ['#BDC3C7', '#ECF0F1'], // Light Gray to Lighter Gray
        accentGradient: ['#2C3E50', '#34495E'], // Deep Blue to Darker Blue
        errorGradient: ['#E74C3C', '#C0392B'], // Light Red to Darker Red
    },
    typography: {
        fontFamily: "Roboto, sans-serif",
        fontSize: {
            small: 12,
            medium: 16,
            large: 20,
            xlarge: 24,
        },
        fontWeight: {
            regular: "400",
            medium: "500",
            bold: "700",
        },
    },
    spacing: {
        small: 8,
        medium: 16,
        large: 24,
        xlarge: 32,
    },
    borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
    },
};


// export const myColors = {
//     colors: {
//         "primary": "rgb(44, 62, 80)", // Deep BlueLinearGradient
//         "onPrimary": "rgb(255, 255, 255)", // White
//         "primaryContainer": "rgb(108, 122, 137)", // Soft Blue-Gray
//         "onPrimaryContainer": "rgb(255, 255, 255)", // White
//         "secondary": "rgb(189, 195, 199)", // Light Gray
//         "onSecondary": "rgb(44, 62, 80)", // Deep Blue
//         "secondaryContainer": "rgb(236, 240, 241)", // Very Light Gray
//         "onSecondaryContainer": "rgb(44, 62, 80)", // Deep Blue
//         "tertiary": "rgb(39, 174, 96)", // Light Green
//         "onTertiary": "rgb(255, 255, 255)", // White
//         "tertiaryContainer": "rgb(46, 204, 113)", // Soft Green
//         "onTertiaryContainer": "rgb(39, 174, 96)", // Light Green
//         "error": "rgb(231, 76, 60)", // Light Red
//         "onError": "rgb(255, 255, 255)", // White
//         "background": "rgb(255, 255, 255)", // White
//         "onBackground": "rgb(33, 33, 33)", // Dark Gray
//         "surface": "rgb(255, 255, 255)", // White
//         "onSurface": "rgb(33, 33, 33)", // Dark Gray
//         "surfaceVariant": "rgb(200, 200, 200)", // Light Gray
//         "onSurfaceVariant": "rgb(70, 70, 70)", // Darker Gray
//         "outline": "rgb(121, 121, 121)", // Mid Gray
//         "shadow": "rgb(0, 0, 0)", // Black
//         "inverseSurface": "rgb(44, 62, 80)", // Deep Blue
//         "inverseOnSurface": "rgb(255, 255, 255)", // White
//     },
//     gradients: {
//         primaryGradient: ['#34495E', '#2C3E50'], // Blue gradient
//         secondaryGradient: ['#BDC3C7', '#ECF0F1'], // Light Gray gradient
//     }
// };

const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
        ...DefaultTheme.colors,
        ...myColors.colors
    },
};

export default theme;




// Gray theme

// import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
// import LinearGradient from 'react-native-linear-gradient';

// export const myColors = {
//     colors: {
//         "primary": "rgb(128, 128, 128)", // Mid Gray
//         "onPrimary": "rgb(255, 255, 255)", // White
//         "primaryContainer": "rgb(200, 200, 200)", // Light Gray
//         "onPrimaryContainer": "rgb(50, 50, 50)", // Darker Gray
//         "secondary": "rgb(160, 160, 160)", // Mid Gray
//         "onSecondary": "rgb(60, 60, 60)", // Dark Gray
//         "secondaryContainer": "rgb(220, 220, 220)", // Very Light Gray
//         "onSecondaryContainer": "rgb(80, 80, 80)", // Darker Gray
//         "tertiary": "rgb(180, 180, 180)", // Light Gray
//         "onTertiary": "rgb(255, 255, 255)", // White
//         "tertiaryContainer": "rgb(230, 230, 230)", // Very Light Gray
//         "onTertiaryContainer": "rgb(70, 70, 70)", // Darker Gray
//         "error": "rgb(100, 100, 100)", // Darker Gray
//         "onError": "rgb(255, 255, 255)", // White
//         "errorContainer": "rgb(230, 230, 230)", // Light Gray
//         "onErrorContainer": "rgb(50, 50, 50)", // Darker Gray
//         "background": "rgb(250, 250, 250)", // Very Light Gray
//         "onBackground": "rgb(33, 33, 33)", // Dark Gray
//         "surface": "rgb(255, 255, 255)", // White
//         "onSurface": "rgb(33, 33, 33)", // Dark Gray
//         "surfaceVariant": "rgb(200, 200, 200)", // Light Gray
//         "onSurfaceVariant": "rgb(70, 70, 70)", // Darker Gray
//         "outline": "rgb(121, 121, 121)", // Mid Gray
//         "outlineVariant": "rgb(189, 189, 189)", // Light Gray
//         "shadow": "rgb(0, 0, 0)", // Black
//         "scrim": "rgb(0, 0, 0)", // Black
//         "inverseSurface": "rgb(66, 66, 66)", // Darker Gray
//         "inverseOnSurface": "rgb(255, 255, 255)", // White
//         "inversePrimary": "rgb(200, 200, 200)", // Light Gray
//         "elevation": {
//             "level0": "transparent",
//             "level1": "rgb(240, 240, 240)", // Very Light Gray
//             "level2": "rgb(230, 230, 230)", // Light Gray
//             "level3": "rgb(220, 220, 220)", // Light Gray
//             "level4": "rgb(210, 210, 210)", // Light Gray
//             "level5": "rgb(200, 200, 200)"  // Mid Light Gray
//         },
//         "surfaceDisabled": "rgba(0, 0, 0, 0.12)", // Low-opacity Black
//         "onSurfaceDisabled": "rgba(0, 0, 0, 0.38)", // Mid-opacity Black
//         "backdrop": "rgba(33, 33, 33, 0.4)" // Mid-opacity Dark Gray
//     },
//     gradients: {
//         primaryGradient: ['#999999', '#666666'], // Gray gradient
//         secondaryGradient: ['#777777', '#888888'], // Mid Gray gradient
//         tertiaryGradient: ['#BBBBBB', '#CCCCCC'], // Light Gray gradient
//     }
// }

// const theme = {
//     ...DefaultTheme,
//     myOwnProperty: true,
//     colors: {
//         ...DefaultTheme.colors,
//         ...myColors.colors
//     },
// };

// export default theme;
