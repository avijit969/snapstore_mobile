import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import ScreenWrapper from '../components/ScreenWrapper'
import Button from '../components/Button'
import { useRouter } from 'expo-router'
import { useTheme } from '../contexts/ThemeContext'

const Welcome = () => {
    const router = useRouter()
    const { colors } = useTheme();

    return (
        <ScreenWrapper bg={colors.background}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')} />
                {/* title */}
                <View style={{ gap: 4 }}>
                    <Text style={[styles.title, { color: colors.text }]}>SnapStore</Text>
                    <Text style={[styles.punchLine, { color: colors.text }]}>Welcome to SnapStore, securely back up your photos and videos in the cloud!</Text>
                </View>
                {/* footer */}
                <View style={styles.footer} >
                    <Button title='Getting Started'
                        buttonStyle={{ marginHorizontal: wp(3) }}
                        onPress={() => { router.push('signUp') }}
                    />
                </View>

                <View style={[styles.buttonTextContainer]}>
                    <Text style={[styles.loginText, { color: colors.text }]} >
                        Already have an account!
                    </Text>
                    <Pressable onPress={() => router.push('login')}>
                        <Text style={[styles.loginText, { color: colors.primary, fontWeight: theme.fonts.semibold }]}>
                            logIn
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: wp(4)
    },
    welcomeImage: {
        height: hp(40),
        width: wp(100),
        alignSelf: 'center'
    },
    title: {
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold
    },
    punchLine: {
        textAlign: 'center',
        paddingHorizontal: wp(4),
        fontSize: hp(2.4),
    },
    footer: {
        gap: 30,
        width: "100%"
    },
    buttonTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    loginText: {
        textAlign: 'center',
        fontSize: hp(2)
    }
})
