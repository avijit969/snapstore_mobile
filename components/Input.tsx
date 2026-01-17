import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

interface InputProps extends TextInputProps {
    containerStyles?: ViewStyle;
    icon?: ReactNode;
    inputRef?: React.RefObject<TextInput>;
    inputStyles?: ViewStyle;
}

export default function Input(props: InputProps) {
    return (
        <View style={[styles.container, props.containerStyles]}>
            {
                props.icon && props.icon
            }
            <TextInput
                style={[{ flex: 1 }]}
                placeholderTextColor={theme.colors.textLight}
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
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    }
})
