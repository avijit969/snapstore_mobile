import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { wp } from '@/helpers/common'
import { theme } from '@/constants/theme'

const Avatar = ({ imageUrl }) => {
    return (
        <View>
            <Image
                style={styles.image}
                source={imageUrl}
                contentFit="cover"
                transition={100}
            />
        </View>
    )
}

export default Avatar

const styles = StyleSheet.create({
    image: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        borderRadius: theme.radius.full
    }
})