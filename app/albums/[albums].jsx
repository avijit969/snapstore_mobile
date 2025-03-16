import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenWrapper from '../../components/ScreenWrapper'
import Icon from '../../assets/icons'
import { TouchableOpacity } from 'react-native'
import { wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import BackButton from '../../components/BackButton'
import { useSelector } from 'react-redux'

const Albums = () => {
    const { albums } = useLocalSearchParams()
    const allAlbums = useSelector((state) => state.album.albums)
    const router = useRouter()
    // useEffect(() => {
    //     console.log(allAlbums, albums)
    // }, [])
    return (
        <ScreenWrapper>
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <BackButton router={router} />
                </TouchableOpacity>
                <View>
                    <View style={styles.rightContainer}>
                        <TouchableOpacity >
                            <Icon name={'message'} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Icon name={"more"} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.albumDetailsContainer}>
                <Text style={styles.albumTitle}>{allAlbums[albums].name}</Text>
                <Text style={styles.albumDescription}>{allAlbums[albums].description}</Text>
                <TouchableOpacity>
                    <View style={styles.addImage}>
                        <Icon name={'addImage'} color={theme.colors.text} />
                        <Text style={{ color: theme.colors.text, fontWeight: theme.fonts.semibold }}>Add photos</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    )
}

export default Albums

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    rightContainer: {
        flexDirection: 'row',
        gap: wp(3),
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: "center"
    },
    albumTitle: {
        fontSize: wp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
    },
    albumDescription: {
        fontSize: wp(2.5),
        color: theme.colors.text
    },
    albumDetailsContainer: {
        padding: wp(3),
        gap: wp(2)
    },
    addImage: {
        padding: wp(1),
        backgroundColor: theme.colors.darkLight,
        borderRadius: wp(2),
        width: wp(17),
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center'
    }
})