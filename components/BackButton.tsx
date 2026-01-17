import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router'
import { useTheme } from '../contexts/ThemeContext'

interface BackButtonProps {
    size?: number;
    router: ReturnType<typeof useRouter>;
}

export default function BackButton({ size = 26, router }: BackButtonProps) {
    const { colors, isDark } = useTheme();

    return (
        <Pressable onPress={() => router.back()} style={[styles.button, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' }]}>
            <Icon name={'arrowLeft'} size={size} color={colors.text} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
    }
})
