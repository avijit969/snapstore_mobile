import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { wp } from '@/helpers/common'
import { theme } from '@/constants/theme'

const Avatar = ({ imageUrl, height, width }) => {
    return (
        <View>
            <Image
                style={[styles.image, { height: height, width: width }]}
                source={imageUrl?.replace('http', 'https')}
                contentFit="cover"
                transition={100}
            />
        </View>
    )
}

export default Avatar

const styles = StyleSheet.create({
    image: {
        borderRadius: wp(5),
        borderRadius: theme.radius.full
    }
})