import { StyleSheet, Text, View, ActivityIndicator, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { wp } from '@/helpers/common'
import axios from 'axios'
import { getToken } from '@/utils/tokenManage'
import Icon from '@/assets/icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const Library = () => {
    const [albums, setAlbums] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const router = useRouter()
    // method for calling albums API
    const getAlbums = async () => {
        try {
            const accessToken = await getToken()
            const response = await axios({
                method: 'GET',
                url: `${process.env.EXPO_PUBLIC_API_URL}/albums/album`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setAlbums(response.data.data)
        } catch (err) {
            setError('Failed to fetch albums')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAlbums()
    }, [])

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
            <ScrollView>

                <View style={styles.albumsContainer}>
                    <Pressable onPress={() => router.push('albums/createNew')}>
                        <View style={styles.albumWrapper}>
                            <View style={styles.album}>
                                <Icon name={'add'} width={wp(7)} height={wp(7)} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.name}>Create New</Text>
                        </View>
                    </Pressable>
                    {/* showing existing photo albums */}
                    {albums && albums.map((album, index) => {
                        return (
                            <View key={index} style={styles.albumWrapper}>
                                <Pressable onPress={() => router.push(`albums/${album.name}`)}>
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
                                </Pressable>
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
        marginTop: wp(4),
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
    }
})
