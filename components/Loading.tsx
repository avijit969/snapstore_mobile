import { ActivityIndicator, ColorValue, StyleSheet, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'

interface LoadingProps {
    size?: number | 'small' | 'large';
    color?: ColorValue;
}

export default function Loading({ size = 'large', color = theme.colors.primary }: LoadingProps) {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
}

const styles = StyleSheet.create({})
