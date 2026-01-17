import { StyleSheet, View, Text, Dimensions, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { FlashList } from '@shopify/flash-list';
import { getAllPhotos } from '../../utils/managePhotos';
import { Image } from 'expo-image';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { addRemoteAssets } from '../../features/media/mediaSlice';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const GAP = wp(1);
const ITEM_WIDTH = (SCREEN_WIDTH - (COLUMN_COUNT + 1) * GAP) / COLUMN_COUNT;

const AllImages = () => {
    const { colors, isDark } = useTheme();
    const [remoteAssetsState, setRemoteAssetsState] = useState<any[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalImage, setTotalImages] = useState(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const assets = useSelector((state: RootState) => state.media.remoteAssets);

    // Calculate item height based on aspect ratio for masonry
    const getItemHeight = (width: number, height: number) => {
        if (!width || !height) return ITEM_WIDTH;
        const aspectRatio = height / width;
        return Math.min(Math.max(ITEM_WIDTH * aspectRatio, ITEM_WIDTH * 0.6), ITEM_WIDTH * 1.8);
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    useEffect(() => {
        if (remoteAssetsState.length > 0) {
            dispatch(addRemoteAssets(remoteAssetsState));
        }
    }, [remoteAssetsState]);

    const fetchPhotos = async () => {
        if (loading || !hasNextPage) return;
        setLoading(true);
        const response = await getAllPhotos(page, 30);
        if (response && response.success) {
            setTotalImages(response.data.totalDocs);
            setRemoteAssetsState((prev) => [...prev, ...response.data.docs]);
            setHasNextPage(response.data.hasNextPage);
            setPage((prev) => prev + 1);
        } else {
            setHasNextPage(false);
        }
        setLoading(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setPage(1);
        setHasNextPage(true);
        setRemoteAssetsState([]);

        const response = await getAllPhotos(1, 30);
        if (response && response.success) {
            setTotalImages(response.data.totalDocs);
            setRemoteAssetsState(response.data.docs);
            setHasNextPage(response.data.hasNextPage);
            setPage(2);
        }
        setRefreshing(false);
    }, []);

    const handlePress = useCallback((index: number) => {
        router.push({
            pathname: `/backedup_images/${index}` as any,
        });
    }, [router]);

    const renderItem = useCallback(({ item, index }: { item: any, index: number }) => {
        const secureUrl = item.url?.replace('http', 'https') || '';
        const isVideo = secureUrl.endsWith('.mp4');
        const itemHeight = getItemHeight(item.width, item.height);

        return (
            <TouchableOpacity
                onPress={() => handlePress(index)}
                activeOpacity={0.9}
                style={styles.itemContainer}
            >
                <View style={[styles.imageWrapper, { height: itemHeight, backgroundColor: colors.surface }]}>
                    <Image
                        source={secureUrl}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                    />
                    {isVideo && (
                        <View style={styles.videoIndicator}>
                            <View style={styles.playButton}>
                                <Ionicons name="play" size={20} color="white" />
                            </View>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }, [handlePress, colors.surface]);

    const ListHeaderComponent = () => (
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(2) }}>
                <BackButton router={router} />
                <Text style={[styles.title, { color: colors.text }]}>Backed Up</Text>
            </View>
            {totalImage > 0 && (
                <View style={[styles.statsCard, { backgroundColor: isDark ? colors.card : '#F0F9FF' }]}>
                    <Ionicons name="cloud-done" size={24} color={theme.colors.primary} />
                    <Text style={[styles.statsText, { color: colors.text }]}>
                        <Text style={styles.statsNumber}>{totalImage}</Text> photos backed up
                    </Text>
                </View>
            )}
        </View>
    );

    const ListEmptyComponent = () => (
        !loading && (
            <View style={styles.emptyState}>
                <Ionicons name="cloud-offline-outline" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.text }]}>No backed up photos yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Your uploaded photos will appear here</Text>
            </View>
        )
    );

    return (
        <ScreenWrapper bg={colors.background}>
            <View style={{ flex: 1 }}>
                {loading && assets.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <Loading color={theme.colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your photos...</Text>
                    </View>
                ) : (
                    <FlashList
                        data={assets}
                        keyExtractor={(item: any) => item._id}
                        masonry
                        numColumns={COLUMN_COUNT}
                        renderItem={renderItem}
                        optimizeItemArrangement={true}
                        ListHeaderComponent={ListHeaderComponent}
                        ListEmptyComponent={ListEmptyComponent}
                        onEndReached={fetchPhotos}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme.colors.primary]}
                            />
                        }
                        ListFooterComponent={
                            loading && assets.length > 0 ? (
                                <View style={styles.footerLoading}>
                                    <Loading size='small' color={theme.colors.primary} />
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

export default AllImages;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: wp(4),
        paddingTop: hp(1),
        paddingBottom: hp(2),
    },
    title: {
        fontSize: wp(7),
        fontWeight: theme.fonts.bold,
        letterSpacing: 0.5,
        marginLeft: 10,
    },
    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 12,
    },
    statsText: {
        fontSize: 15,
        fontWeight: theme.fonts.medium,
    },
    statsNumber: {
        fontSize: 18,
        fontWeight: theme.fonts.bold,
        color: theme.colors.primary,
    },
    listContainer: {
        paddingHorizontal: GAP,
        paddingBottom: hp(10),
    },
    itemContainer: {
        width: ITEM_WIDTH,
        marginBottom: GAP,
        marginHorizontal: GAP / 2,
    },
    imageWrapper: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    videoIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: theme.fonts.medium,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(20),
        paddingHorizontal: wp(8),
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: theme.fonts.semibold,
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    footerLoading: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
