import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Text, G, Line, Rect } from 'react-native-svg';

const CancelledWatermark = () => {
    const { width, height } = Dimensions.get('window');
    const circleRadius = 120;

    return (
        <View style={styles.container}>
            <Svg width={width} height={height} style={styles.svg}>
                {/* Centering the watermark */}
                <G rotation="-15" origin={`${width / 2}, ${height / 2}`}>
                    {/* Outer Circle */}
                    <Circle
                        cx={width / 2}
                        cy={height / 2}
                        r={circleRadius}
                        stroke="red"
                        strokeWidth="5"
                        fill="none"
                    />

                    {/* Inner Circle */}
                    <Circle
                        cx={width / 2}
                        cy={height / 2}
                        r={circleRadius - 20}
                        stroke="red"
                        strokeWidth="5"
                        fill="none"
                    />

                    {/* Stars */}
                    {[...Array(8)].map((_, i) => (
                        <Text
                            key={i}
                            x={width / 2 + circleRadius * Math.cos((i * Math.PI) / 4)}
                            y={height / 2 + circleRadius * Math.sin((i * Math.PI) / 4)}
                            fill="red"
                            fontSize="12"
                            textAnchor="middle"
                        >
                            ★
                        </Text>
                    ))}

                    {/* Cancelled Rectangle */}
                    <Rect
                        x={width / 2 - 100}
                        y={height / 2 - 20}
                        width="200"
                        height="40"
                        fill="white"
                        stroke="red"
                        strokeWidth="5"
                    />
                    <Text
                        x={width / 2}
                        y={height / 2 + 5}
                        fontSize="24"
                        fontWeight="bold"
                        fill="red"
                        textAnchor="middle"
                    >
                        CANCELLED
                    </Text>
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        // position: 'absolute',
        // top: 10,
        // left: 10,
        // right: 10,
        // bottom: 10,
        // margin: "auto",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light overlay
        zIndex: 1000,
    },
    svg: {
        position: 'absolute',
        opacity: 0.5,
    },
});

export default CancelledWatermark;
