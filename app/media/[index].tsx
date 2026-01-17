import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Dimensions, TouchableOpacity, Text, ViewStyle, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import ScreenWrapper from '../../components/ScreenWrapper';
import axios from 'axios';
import { getToken } from '../../utils/tokenManage';
import { markAssetAsBackedUp, removeAParticularAsset } from '../../features/media/mediaSlice';
import { hp, wp } from '../../helpers/common';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

import Toaster from '../../components/Toaster';
import * as MediaLibrary from 'expo-media-library';
import dateCovertToLocalDate from '../../utils/manageDate';
import { Image } from 'expo-image';
import AddToAlbum from '../../components/AddToAlbum';
import { deleteImage, deleteImageFromDevice } from '../../utils/managePhotos';
import { RootState } from '@/store/store';
import { theme } from '@/constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function MediaViewer() {
    const mergedAssetsData = useSelector((state: RootState) => state.media.mergedAssets);
    const dispatch = useDispatch();
    const { index } = useLocalSearchParams<{ index: string }>();
    const [currentIndex, setCurrentIndex] = React.useState(parseInt(index || '0', 10));
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const addToAlbumRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['45%', '70%'], []);
    const currentAsset = mergedAssetsData[currentIndex];
    const [assetExtraInfo, setAssetExtraInfo] = useState<MediaLibrary.AssetInfo | null>(null)
    const { colors, isDark } = useTheme();

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handlePresentAddToAlbumModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
        setTimeout(() => {
            addToAlbumRef.current?.present();
        }, 300);
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
            />
        ),
        []
    );

    useEffect(() => {
        const fetchAssetInfo = async () => {
            if (currentAsset && currentAsset.id) {
                try {
                    const asset = await MediaLibrary.getAssetInfoAsync(currentAsset.id);
                    setAssetExtraInfo(asset);
                } catch (e) {
                    console.log("Error fetching asset info, might be remote asset", e);
                }
            }
        };

        fetchAssetInfo();
    }, [currentIndex, currentAsset]);

    // Create a single video player for the current video only
    const currentVideoUri = useMemo(() => {
        const asset = mergedAssetsData[currentIndex];
        return asset?.mediaType === 'video' ? asset.uri : null;
    }, [currentIndex, mergedAssetsData]);

    const currentVideoPlayer = useVideoPlayer(currentVideoUri || '', player => {
        if (currentVideoUri) {
            player.loop = true;
            player.play();
        }
    });

    // Pause video when index changes
    useEffect(() => {
        if (currentVideoUri && currentVideoPlayer) {
            currentVideoPlayer.play();
        } else if (currentVideoPlayer) {
            currentVideoPlayer.pause();
        }
    }, [currentIndex, currentVideoUri, currentVideoPlayer]);

    const renderItem = useCallback(({ item, index: itemIndex }: { item: any; index: number }) => {
        const isCurrentItem = itemIndex === currentIndex;

        if (item.mediaType === 'photo') {
            return (
                <Image
                    source={item.uri}
                    style={{ width, height }}
                    contentFit='contain'
                    transition={100}
                />
            );
        } else {
            // Only render VideoView for the current video
            if (isCurrentItem && currentVideoPlayer) {
                return (
                    <VideoView
                        player={currentVideoPlayer}
                        style={{ width, height }}
                        contentFit="contain"
                        nativeControls
                    />
                );
            } else {
                // Placeholder for non-current videos
                return (
                    <View style={{ width, height, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={item.uri}
                            style={{ width, height }}
                            contentFit='contain'
                            transition={100}
                        />
                    </View>
                );
            }
        }
    }, [currentIndex, currentVideoPlayer]);

    const handleSaveToCloud = async () => {
        if (uploading) return;

        try {
            setUploading(true);
            bottomSheetModalRef.current?.dismiss();

            const accessToken = await getToken();
            const data = mergedAssetsData[currentIndex];

            const formData = new FormData();
            formData.append('localAssetId', data.id);
            formData.append('creationDateTime', String(data.modificationTime));
            formData.append('height', String(data.height || 0));
            formData.append('width', String(data.width || 0));

            const mediaType = data.mediaType === 'photo' ? 'image/jpeg' : 'video/mp4';
            const fileName = data.mediaType === 'photo' ? `photo_${data.id}.jpg` : `video_${data.id}.mp4`;

            formData.append('photo', {
                uri: data.uri,
                name: fileName,
                type: mediaType
            } as any);

            const response = await axios({
                method: 'POST',
                url: `${process.env.EXPO_PUBLIC_API_URL}/photos/upload-single`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                },
                data: formData
            });
            console.log(response.data);
            if (response.data.success) {
                dispatch(markAssetAsBackedUp({ index: currentIndex, _id: response.data.data._id }));
                Toaster({
                    type: 'success',
                    heading: 'Success!',
                    message: 'Media backed up successfully',
                    position: 'top'
                });
            }
        } catch (error: any) {
            Toaster({
                type: 'error',
                heading: 'Upload Failed',
                message: error.response?.data?.message || error.message || 'Failed to upload',
                position: 'top'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        bottomSheetModalRef.current?.dismiss();

        Alert.alert(
            "Delete Media",
            `Delete from ${currentAsset?.isBackedUp ? 'cloud' : 'device'}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = currentAsset.isBackedUp
                                ? await deleteImage(currentAsset._id)
                                : await deleteImageFromDevice(currentAsset.id);

                            if (response.success) {
                                dispatch(removeAParticularAsset(currentIndex));
                                router.back();
                                Toaster({
                                    type: 'success',
                                    heading: 'Success!',
                                    message: 'Media deleted successfully',
                                    position: 'top'
                                });
                            }
                        } catch (error: any) {
                            Toaster({
                                type: 'error',
                                heading: 'Delete Failed',
                                message: error.message,
                                position: 'top'
                            });
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScreenWrapper bg='black'>
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <FlatList
                    data={mergedAssetsData}
                    horizontal
                    pagingEnabled
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    initialScrollIndex={currentIndex}
                    getItemLayout={(data, index) => (
                        { length: width, offset: width * index, index }
                    )}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(index);
                    }}
                />

                {/* Top Toolbar */}
                <View style={styles.topToolbar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.toolbarButton}>
                        <Feather name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {!currentAsset?.isBackedUp && (
                            <TouchableOpacity
                                onPress={handleSaveToCloud}
                                disabled={uploading}
                                style={styles.toolbarButton}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <MaterialIcons name="cloud-upload" size={24} color="white" />
                                )}
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handlePresentModalPress} style={styles.toolbarButton}>
                            <Feather name="more-vertical" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Modern Bottom Sheet */}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ borderRadius: 24, backgroundColor: colors.surface }}
            >
                <BottomSheetView style={styles.sheetContent}>
                    <Text style={[styles.sheetTitle, { color: colors.text }]}>Media Details</Text>

                    {/* Action Buttons */}
                    <View style={styles.actionsContainer}>
                        {!currentAsset?.isBackedUp && (
                            <TouchableOpacity
                                style={[styles.actionRow, { backgroundColor: isDark ? colors.card : '#F9FAFB' }]}
                                onPress={handleSaveToCloud}
                                disabled={uploading}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: isDark ? colors.surface : '#EEF2FF' }]}>
                                    {uploading ? (
                                        <ActivityIndicator size="small" color={theme.colors.primary} />
                                    ) : (
                                        <Feather name="upload-cloud" size={20} color={theme.colors.primary} />
                                    )}
                                </View>
                                <Text style={[styles.actionText, { color: colors.text }]}>Backup to Cloud</Text>
                                <Feather name="chevron-right" size={20} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={[styles.actionRow, { backgroundColor: isDark ? colors.card : '#F9FAFB' }]} onPress={handlePresentAddToAlbumModalPress}>
                            <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                                <Feather name="folder-plus" size={20} color="#10B981" />
                            </View>
                            <Text style={[styles.actionText, { color: colors.text }]}>Add to Album</Text>
                            <Feather name="chevron-right" size={20} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionRow, { backgroundColor: isDark ? colors.card : '#F9FAFB' }]} onPress={handleDelete}>
                            <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
                                <Feather name="trash-2" size={20} color={theme.colors.rose} />
                            </View>
                            <Text style={[styles.actionText, { color: theme.colors.rose }]}>
                                Delete from {currentAsset?.isBackedUp ? 'Cloud' : 'Device'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Media Info */}
                    <View style={styles.infoSection}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Date</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {dateCovertToLocalDate(currentAsset?.modificationTime)}
                        </Text>
                    </View>

                    {assetExtraInfo && (
                        <>
                            {assetExtraInfo.width && assetExtraInfo.height && (
                                <View style={styles.infoSection}>
                                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Dimensions</Text>
                                    <Text style={[styles.infoValue, { color: colors.text }]}>
                                        {assetExtraInfo.width} × {assetExtraInfo.height}
                                    </Text>
                                </View>
                            )}

                            {(assetExtraInfo.exif as any)?.Make && (
                                <View style={styles.infoSection}>
                                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Camera</Text>
                                    <Text style={[styles.infoValue, { color: colors.text }]}>
                                        {(assetExtraInfo.exif as any).Make} {(assetExtraInfo.exif as any).Model}
                                    </Text>
                                    {(assetExtraInfo.exif as any).FNumber && (
                                        <Text style={[styles.infoSubValue, { color: colors.textSecondary }]}>
                                            f/{(assetExtraInfo.exif as any).FNumber} ·
                                            {(assetExtraInfo.exif as any).FocalLength}mm ·
                                            ISO{(assetExtraInfo.exif as any).ISOSpeedRatings}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </>
                    )}
                </BottomSheetView>
            </BottomSheetModal>

            {/* Add to Album Sheet */}
            <AddToAlbum bottomSheetModalRef={addToAlbumRef} currentAsset={currentAsset} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    topToolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: hp(1),
        paddingHorizontal: wp(2),
        paddingBottom: hp(2),
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    toolbarButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheetContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    sheetTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    actionsContainer: {
        gap: 8,
        marginBottom: 20,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 16,
    },
    infoSection: {
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    infoSubValue: {
        fontSize: 14,
        marginTop: 4,
    },
});
