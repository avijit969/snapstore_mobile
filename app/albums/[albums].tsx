import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, RefreshControl, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenWrapper from '../../components/ScreenWrapper'
import Icon from '../../assets/icons'
import { wp, hp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import BackButton from '../../components/BackButton'
import { useSelector } from 'react-redux'
import { getImagesFromAlbum } from '../../utils/manageAlbums'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GAP = 2;
const ITEM_SIZE = (SCREEN_WIDTH - (COLUMN_COUNT - 1) * GAP) / COLUMN_COUNT;

const Albums = () => {
    const { albums: albumId } = useLocalSearchParams<{ albums: string }>()
    const allAlbums = useSelector((state: any) => state.album.albums)
    const router = useRouter()

    // Find album by ID (handle string vs number id issues if any, assuming string from API)
    const currentAlbum = allAlbums.find((a: any) => a._id === albumId || a.id === albumId) || { name: 'Album not found', description: '' };

    const [photos, setPhotos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchAlbumPhotos = async () => {
        if (!albumId) return;
        setLoading(true)
        const res = await getImagesFromAlbum(albumId);
        if (res.success) {
            setPhotos(res.data)
        }
        setLoading(false)
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchAlbumPhotos()
        setRefreshing(false)
    }

    useEffect(() => {
        fetchAlbumPhotos()
    }, [albumId])

    const renderPhotoItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    // Navigate to photo detail if needed, or expand
                }}
            >
                <Image
                    source={{ uri: item.url }}
                    style={{
                        width: ITEM_SIZE,
                        height: ITEM_SIZE,
                        marginBottom: GAP,
                        marginRight: GAP
                    }}
                    contentFit="cover"
                    transition={200}
                />
            </TouchableOpacity>
        )
    }

    return (
        <ScreenWrapper bg='white'>
            {/* header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <BackButton router={router} />
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {currentAlbum.name || 'Album Details'}
                    </Text>
                </View>

                <View style={styles.rightContainer}>
                    <TouchableOpacity>
                        <Icon name={"more"} color={theme.colors.primary} size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <View style={styles.albumMeta}>
                    <Text style={styles.albumDescription}>{currentAlbum.description}</Text>
                    <Text style={styles.stats}>{photos.length} photos</Text>
                </View>

                {loading && !refreshing ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <FlashList
                        data={photos}
                        renderItem={renderPhotoItem}
                        // @ts-ignore
                        estimatedItemSize={ITEM_SIZE}
                        numColumns={COLUMN_COUNT}
                        contentContainerStyle={{ paddingBottom: hp(5) }}
                        keyExtractor={(item: any) => item._id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No photos in this album yet.</Text>
                                <TouchableOpacity style={styles.addBtn} onPress={() => alert('Feature coming soon!')}>
                                    <Text style={styles.addBtnText}>Add Photos</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
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
        paddingVertical: 10,
        paddingHorizontal: wp(4),
    },
    headerTitle: {
        fontSize: wp(4.5),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
        maxWidth: wp(60)
    },
    rightContainer: {
        flexDirection: 'row',
        gap: wp(1),
    },
    albumMeta: {
        paddingHorizontal: wp(4),
        paddingBottom: 10
    },
    albumDescription: {
        fontSize: wp(3.5),
        color: theme.colors.textLight,
        marginBottom: 4
    },
    stats: {
        fontSize: wp(3),
        color: theme.colors.textLight,
        opacity: 0.7
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        marginTop: hp(10),
        alignItems: 'center',
        paddingHorizontal: 20
    },
    emptyText: {
        color: theme.colors.textLight,
        marginBottom: 20
    },
    addBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20
    },
    addBtnText: {
        color: 'white',
        fontWeight: 'bold'
    }
})
