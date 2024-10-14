import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { wp } from '@/helpers/common'
import Avatar from '@/components/Avatar'
import Icon from '@/assets/icons'
import { useNavigation } from 'expo-router'
const Header = () => {
    const navigation = useNavigation()
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
                <Pressable onPress={() => navigation.push('profile')}>
                    <View>
                        <Avatar imageUrl={require('../assets/images/icon.png')} />
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
    }
})