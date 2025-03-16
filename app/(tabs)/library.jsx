import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { wp } from '@/helpers/common'
import axios from 'axios'
import { getAlbums } from '@/utils/manageAlbums'
import Icon from '@/assets/icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { addAlbums } from '../../features/album/albumSlice'
import BackButton from '@/components/BackButton'
const Library = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const router = useRouter()
    const dispatch = useDispatch()
    const albums = useSelector(state => state.album.albums)
    // method for calling albums API
    const fetchAllAlbums = async () => {
        setLoading(true)
        const response = await getAlbums()
        if (response.success) {
            console.log(response.data)
            dispatch(addAlbums(response.data))
        }
        else {
            setError(response.message)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchAllAlbums()
    }, [addAlbums])
    if (loading) {
        return (
            <ScreenWrapper bg='white'>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </ScreenWrapper>
        )
    }

    if (error) {
        return (
            <ScreenWrapper bg='white'>
                <View style={styles.center}>
                    <Text>{error}</Text>
                </View>
            </ScreenWrapper>
        )
    }

    return (
        <ScreenWrapper bg='white'>
            <View style={styles.header}>
                <BackButton router={router} />
                <Text style={styles.title}>Library</Text>
            </View>
            <ScrollView>
                <View style={styles.albumsContainer}>
                    <TouchableOpacity onPress={() => router.push('albums/createNew')}>
                        <View style={styles.albumWrapper}>
                            <View style={styles.album}>
                                <Icon name={'add'} width={wp(7)} height={wp(7)} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.name}>Create New</Text>
                        </View>
                    </TouchableOpacity>
                    {/* showing existing photo albums */}
                    {albums && albums.map((album, index) => {
                        return (
                            <View key={index} style={styles.albumWrapper}>
                                <TouchableOpacity onPress={() => router.push(`albums/${index}`)}>
                                    <View style={styles.album}>
                                        {album?.image ? (
                                            <Image
                                                source={{ uri: album?.image }}
                                                style={styles.albumImage}
                                            />
                                        ) : (
                                            <Icon name={'albumImages'} width={wp(7)} height={wp(7)} color={theme.colors.primary} />
                                        )}
                                    </View>
                                    <Text style={styles.name}>{album?.name || 'Untitled Album'}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default Library

const styles = StyleSheet.create({
    albumsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
        justifyContent: 'space-between',
        padding: wp(2),
    },
    albumWrapper: {
        // alignItems: 'center',
    },
    album: {
        backgroundColor: theme.colors.darkLight,
        width: wp(20),
        height: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(2)
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        color: theme.colors.text,
        fontSize: wp(2),
        fontWeight: theme.fonts.semibold
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: wp(3)
    },
    title: {
        fontSize: wp(3.5),
        fontWeight: theme.fonts.semibold,
        textAlign: 'center',
        color: theme.colors.text
    }
})
