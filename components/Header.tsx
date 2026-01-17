import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { wp } from '@/helpers/common'
import Avatar from '@/components/Avatar'
import Icon from '@/assets/icons'
import { useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { RootState } from '@/store/store'

const Header = () => {
    const router = useRouter()
    const userData = useSelector((state: RootState) => state.auth.userData) as any; // Type assertion needed or fix UserData type in authSlice
    const avatarUrl = userData?.user?.avatar
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SnapStore</Text>
            {/* upload button  */}
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={() => router.push('backedup_images/allImages')}>
                    <View>
                        <Icon name={'cloudUpload'} color={theme.colors.dark} />
                    </View>
                </TouchableOpacity>
                {/* profile avatar */}
                <TouchableOpacity onPress={() => {
                    router.push('profile')
                }}>
                    <View>
                        <Avatar imageUrl={avatarUrl} height={wp(7.5)} width={wp(7.5)} />
                    </View>
                </TouchableOpacity>
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
        paddingRight: wp(2),
        paddingVertical: wp(.5),
    },
    rightContainer: {
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center'
    },
    title: {
        fontSize: wp(3.2),
        fontWeight: theme.fonts.bold,
        color: theme.colors.primary,
        paddingLeft: wp(2)
    },
})
