import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { theme } from '../constants/theme'
import { wp, hp } from '../helpers/common'
import Loading from './Loading'
import { useTheme } from '../contexts/ThemeContext'

interface ButtonProps {
    buttonStyle?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
    title?: string;
    onPress?: () => void;
    loading?: boolean;
    hasShadow?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
}

const Button = (
    { buttonStyle,
        textStyle,
        title = "",
        onPress = () => { },
        loading = false,
        hasShadow = true,
        disabled = false,
        icon
    }: ButtonProps
) => {
    const { colors, isDark } = useTheme();

    const shadowStyle = {
        shadowColor: isDark ? colors.text : theme.colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4
    }
    const disabledStyle = {
        backgroundColor: theme.colors.disabled,
        opacity: 0.5
    }
    if (loading) {
        return (
            <View style={[styles.button, buttonStyle, { backgroundColor: isDark ? colors.card : 'white' }]}>
                <Loading />
            </View>
        )
    }
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle, disabled && disabledStyle]} disabled={disabled}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
            {icon && icon}
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: wp(2),
        backgroundColor: theme.colors.primary,
        height: hp(6),
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl
    } as ViewStyle,
    text: {
        fontSize: hp(2.5),
        color: 'white',
        fontWeight: theme.fonts.bold as any, // Cast or exact match

    } as TextStyle,

})
