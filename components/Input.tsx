import { StyleSheet, TextInput, TextInputProps, View, ViewStyle, StyleProp } from 'react-native'
import React, { ReactNode } from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import { useTheme } from '../contexts/ThemeContext'

interface InputProps extends TextInputProps {
    containerStyles?: StyleProp<ViewStyle>;
    icon?: ReactNode;
    inputRef?: React.RefObject<TextInput>;
    inputStyles?: StyleProp<ViewStyle>;
}

export default function Input(props: InputProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { borderColor: colors.border, backgroundColor: isDark ? colors.card : 'transparent' }, props.containerStyles]}>
            {
                props.icon && props.icon
            }
            <TextInput
                style={[{ flex: 1, color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                ref={props.inputRef}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        borderWidth: 0.4,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    }
})
