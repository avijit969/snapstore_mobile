import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { wp } from '@/helpers/common'
import Avatar from '@/components/Avatar'
import Icon from '@/assets/icons'
import { useNavigation } from 'expo-router'
import { useSelector } from 'react-redux'
import { Image } from 'expo-image'
const Header = () => {
    const navigation = useNavigation()
    const userData = useSelector((state) => state.auth.userData)
    const avatarUrl = userData.user?.avatar
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SanpStore</Text>
            {/* upload button  */}
            <View style={styles.rightContainer}>
                <Pressable onPress={() => navigation.push('upload')}>
                    <View>
                        <Icon name={'cloudUpload'} color={theme.colors.dark} />
                    </View>
                </Pressable>
                {/* logout button */}
                <Pressable onPress={() => {
                    console.log(avatarUrl)
                    navigation.push('profile')
                }}>
                    <View>
                        <Avatar imageUrl={avatarUrl} />
                    </View>
                </Pressable>
            </View>

        </View >

    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: theme.colors.darkLight,
        borderBottomWidth: wp(0.1),

    },
    rightContainer: {
        flexDirection: 'row',
        gap: wp(1),
        alignItems: 'center'
    },
    title: {
        fontSize: wp(3.2),
        fontWeight: theme.fonts.bold,
        color: theme.colors.primary,
        paddingLeft: wp(2)
    },
})