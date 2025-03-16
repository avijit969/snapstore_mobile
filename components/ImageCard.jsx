import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { Image } from 'expo-image'
import { getHeight } from '../helpers/common'

const ImageCard = ({ item }) => {
    return (
        <View style={styles.imageWrapper}>
            <Image
                source={item.url}
                style={[styles.image, { height: getHeight(item.height, item.width) }]}
                transition={100}
            />
        </View>
    )
}

export default ImageCard

const styles = StyleSheet.create({
    imageWrapper: {
        margin: 5,
        backgroundColor: '#ccc',
        borderRadius: theme.radius.sm,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        borderRadius: theme.radius.sm,
    },
})