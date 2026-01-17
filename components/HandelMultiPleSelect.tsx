import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { deleteImage, deleteImageFromDevice, uploadSinglePhoto } from '../utils/managePhotos';
import { addImageToAlbum, getAlbums } from '../utils/manageAlbums';
import { markAssetAsBackedUp, markUploadProgress, removeAParticularAsset } from '../features/media/mediaSlice';
import { Feather, Ionicons } from '@expo/vector-icons';
import { wp, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import { RootState } from '@/store/store';

interface HandelMultipleSelectProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
    selectedItems: number[];
    setSelectedItems: (items: number[]) => void;
    setSelectionMode: (mode: boolean) => void;
    setToasterData: (data: any) => void;
}

const HandelMultipleSelect = ({ bottomSheetModalRef, selectedItems, setSelectedItems, setSelectionMode, setToasterData }: HandelMultipleSelectProps) => {
    const snapPoints = useMemo(() => ['35%'], []);
    const assets = useSelector((state: RootState) => state.media.mergedAssets);
    const dispatch = useDispatch();
    const [albums, setAlbums] = useState<any[]>([]);
    const [showAlbumPicker, setShowAlbumPicker] = useState(false);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setSelectedItems([]);
            setSelectionMode(false);
            setShowAlbumPicker(false);
        }
    }, [setSelectedItems, setSelectionMode]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const fetchAlbums = async () => {
        const response = await getAlbums();
        if (response.success) {
            setAlbums(response.data);
        }
    };

    const uploadSelectedItems = async () => {
        bottomSheetModalRef.current?.dismiss();
        setSelectedItems([]);
        setSelectionMode(false);

        const uploadPromises = selectedItems.map(async (item) => {
            if (assets[item] && !assets[item].isBackedUp) {
                const formData = new FormData();
                formData.append('localAssetId', assets[item].id);
                formData.append('creationDateTime', String(assets[item].modificationTime));
                formData.append('height', String(assets[item].height));
                formData.append('width', String(assets[item].width));

                const mediaType = assets[item].mediaType === 'photo' ? 'image/jpeg' : 'video/mp4';
                const fileName = assets[item].mediaType === 'photo' ? `photo_${assets[item].id}.jpg` : `video_${assets[item].id}.mp4`;

                formData.append('photo', {
                    uri: assets[item].uri,
                    name: fileName,
                    type: mediaType,
                } as any);

                dispatch(markUploadProgress({ index: item }));
                const response = await uploadSinglePhoto(formData);

                if (response.success) {
                    dispatch(markAssetAsBackedUp({ index: item, _id: response.data._id }));
                    return true;
                }
                return false;
            }
            return true; // Already uploaded
        });

        const results = await Promise.all(uploadPromises);
        const uploadSuccess = results.every(Boolean);

        setToasterData({
            type: uploadSuccess ? 'success' : 'error',
            heading: uploadSuccess ? 'Success!' : 'Error!',
            message: uploadSuccess
                ? 'All selected items uploaded successfully!'
                : 'Some items failed to upload.',
            position: 'top',
        });
    };

    const deleteSelectedItems = async () => {
        bottomSheetModalRef.current?.dismiss();

        Alert.alert(
            "Delete Photos",
            `Are you sure you want to delete ${selectedItems.length} photo(s)?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setSelectedItems([]);
                        setSelectionMode(false);

                        const deletePromises = selectedItems.map(async (item) => {
                            if (assets[item] && !assets[item].isBackedUp) {
                                const response = await deleteImageFromDevice(assets[item].id);
                                if (response.success) {
                                    const indexOfAsset = assets.findIndex((asset: any) => asset.id === assets[item].id);
                                    dispatch(removeAParticularAsset(indexOfAsset));
                                    return true;
                                }
                                return false;
                            } else if (assets[item]) {
                                const response = await deleteImage(assets[item]._id);
                                if (response.success) {
                                    const indexOfAsset = assets.findIndex((asset: any) => asset._id === assets[item]._id);
                                    dispatch(removeAParticularAsset(indexOfAsset));
                                    return true;
                                }
                                return false;
                            }
                        });

                        const results = await Promise.all(deletePromises);
                        const deleteSuccess = results.every(Boolean);

                        setToasterData({
                            type: deleteSuccess ? 'success' : 'error',
                            heading: deleteSuccess ? 'Success!' : 'Error!',
                            message: deleteSuccess
                                ? 'All selected items deleted successfully!'
                                : 'Some items failed to delete.',
                            position: 'top',
                        });
                    }
                }
            ]
        );
    };

    const handleAddToAlbum = async () => {
        await fetchAlbums();
        setShowAlbumPicker(true);
    };

    const addToAlbum = async (albumId: string) => {
        bottomSheetModalRef.current?.dismiss();

        // Get IDs of backed up photos
        const photoIds = selectedItems
            .map(idx => assets[idx])
            .filter(asset => asset._id)
            .map(asset => asset._id!);

        if (photoIds.length === 0) {
            setToasterData({
                type: 'error',
                heading: 'Error!',
                message: 'Please upload photos before adding to album.',
                position: 'top',
            });
            setSelectedItems([]);
            setSelectionMode(false);
            return;
        }

        const response = await addImageToAlbum(albumId, photoIds);

        setSelectedItems([]);
        setSelectionMode(false);
        setShowAlbumPicker(false);

        setToasterData({
            type: response.success ? 'success' : 'error',
            heading: response.success ? 'Success!' : 'Error!',
            message: response.message || (response.success ? 'Added to album!' : 'Failed to add to album.'),
            position: 'top',
        });
    };

    return (
        <View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ borderRadius: 24 }}
            >
                <BottomSheetView style={styles.contentContainer}>
                    {!showAlbumPicker ? (
                        <>
                            <Text style={styles.sheetTitle}>{selectedItems.length} Selected</Text>

                            <View style={styles.actionsGrid}>
                                <TouchableOpacity style={styles.actionCard} onPress={uploadSelectedItems}>
                                    <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
                                        <Feather name="upload-cloud" size={24} color={theme.colors.primary} />
                                    </View>
                                    <Text style={styles.actionText}>Upload</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionCard} onPress={handleAddToAlbum}>
                                    <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                                        <Ionicons name="albums" size={24} color="#10B981" />
                                    </View>
                                    <Text style={styles.actionText}>Add to Album</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionCard} onPress={deleteSelectedItems}>
                                    <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
                                        <Feather name="trash-2" size={24} color={theme.colors.rose} />
                                    </View>
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.albumPickerHeader}>
                                <TouchableOpacity onPress={() => setShowAlbumPicker(false)}>
                                    <Feather name="arrow-left" size={24} color={theme.colors.text} />
                                </TouchableOpacity>
                                <Text style={styles.sheetTitle}>Select Album</Text>
                                <View style={{ width: 24 }} />
                            </View>

                            <ScrollView style={styles.albumList} showsVerticalScrollIndicator={false}>
                                {albums.map((album) => (
                                    <TouchableOpacity
                                        key={album._id}
                                        style={styles.albumItem}
                                        onPress={() => addToAlbum(album._id)}
                                    >
                                        <Ionicons name="albums-outline" size={20} color={theme.colors.text} />
                                        <Text style={styles.albumName}>{album.name}</Text>
                                        <Feather name="chevron-right" size={20} color="#C7C7CC" />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    )}
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};

export default HandelMultipleSelect;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    actionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    actionCard: {
        alignItems: 'center',
        gap: 8,
    },
    actionIcon: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    albumPickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    albumList: {
        maxHeight: hp(30),
    },
    albumItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        marginBottom: 8,
        gap: 12,
    },
    albumName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text,
    },
});
