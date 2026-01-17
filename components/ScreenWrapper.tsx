import { View } from 'react-native'
import React, { ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../contexts/ThemeContext'

interface ScreenWrapperProps {
    children: ReactNode;
    bg?: string;
}

export default function ScreenWrapper({ children, bg }: ScreenWrapperProps) {
    const { top } = useSafeAreaInsets();
    const { colors } = useTheme();
    const paddingTop = top > 0 ? top + 5 : 30;
    const backgroundColor = bg || colors.background;

    return (
        <View style={{ flex: 1, paddingTop, backgroundColor }}>
            {children}
        </View>
    )
}
