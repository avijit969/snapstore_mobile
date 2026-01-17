import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { wp } from '@/helpers/common'
import { theme } from '@/constants/theme'

interface AvatarProps {
    imageUrl: string;
    height: number;
    width: number;
}

const Avatar = ({ imageUrl, height, width }: AvatarProps) => {
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
        borderRadius: theme.radius.full
    }
})
