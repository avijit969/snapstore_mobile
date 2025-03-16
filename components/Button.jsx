import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { wp, hp } from '../helpers/common'
import Loading from './Loading'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Button = (
  { buttonStyle,
    textStyle,
    title = "",
    onPress = () => { },
    loading = false,
    hasShadow = true,
    disabled = false,
    icon
  }
) => {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4
  }
  const disabledStyle = {
    backgroundColor: theme.colors.disabled
  }
  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: 'white' }]}>
        <Loading />
      </View>
    )
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle, disabled && disabledStyle]}>
      <Text style={styles.text}>{title}</Text>
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
  },
  text: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: theme.fonts.bold,

  },

})