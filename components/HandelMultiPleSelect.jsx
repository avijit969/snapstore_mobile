import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { deleteImage, deleteImageFromDevice, uploadSinglePhoto } from '../utils/managePhotos';
import { markAssetAsBackedUp, markUploadProgress, removeAParticularAsset } from '../features/media/mediaSlice';
import Icon from '../assets/icons';
import { wp } from '../helpers/common';
import { theme } from '../constants/theme';

const HandelMultipleSelect = ({ bottomSheetModalRef, selectedItems, setSelectedItems, setSelectionMode, setToasterData }) => {
    const snapPoints = useMemo(() => ['20%', '50%'], []);
    const assets = useSelector((state) => state.media.mergedAssets);
    const dispatch = useDispatch();

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setSelectedItems([]);
            setSelectionMode(false);
        }
    }, []);

    useEffect(() => {
        if (selectedItems.length > 0) {
            const itemsToUpload = selectedItems.map((index) => assets[index]);
            console.log(JSON.stringify(itemsToUpload, null, 2));
        }
    }, [selectedItems]);

    const uploadSelectedItems = async () => {
        setSelectedItems([]);
        setSelectionMode(false);

        const uploadPromises = selectedItems.map(async (item) => {
            if (!assets[item].isBackedUp) {
                const formData = new FormData();
                formData.append('localAssetId', assets[item].id);
                formData.append('creationDateTime', assets[item].modificationTime);
                formData.append('height', assets[item].height);
                formData.append('width', assets[item].width);

                const mediaType = assets[item].mediaType === 'photo' ? 'image/jpeg' : 'video/mp4';
                const fileName = assets[item].mediaType === 'photo' ? `photo_${assets[item].id}.jpg` : `video_${assets[item].id}.mp4`;

                formData.append('photo', {
                    uri: assets[item].uri,
                    name: fileName,
                    type: mediaType,
                });

                dispatch(markUploadProgress({ index: item }));
                const response = await uploadSinglePhoto(formData);

                if (response.success) {
                    dispatch(markAssetAsBackedUp({ index: item }));
                    return true;
                }
                return false;
            }
        });

        const results = await Promise.all(uploadPromises);
        const uploadSuccess = results.every(Boolean);

        setToasterData({
            type: uploadSuccess ? 'success' : 'error',
            heading: uploadSuccess ? 'Success!' : 'Error!',
            message: uploadSuccess
                ? 'All selected items uploaded successfully!'
                : 'Something went wrong. Please try again.',
            position: 'top',
        });
    };

    const deleteSelectedItems = async () => {
        setSelectedItems([]);
        setSelectionMode(false);

        const deletePromises = selectedItems.map(async (item) => {
            if (!assets[item].isBackedUp) {
                const response = await deleteImageFromDevice(assets[item].id);
                if (response.success) {
                    const indexOfAsset = assets.findIndex((asset) => asset.id === assets[item].id);
                    dispatch(removeAParticularAsset(indexOfAsset));
                    return true;
                }
                return false;
            } else {
                const response = await deleteImage(assets[item]._id);
                if (response.success) {
                    const indexOfAsset = assets.findIndex((asset) => asset._id === assets[item]._id);
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
                : 'Something went wrong. Please try again.',
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
            >
                <BottomSheetView style={styles.contentContainer}>
                    <TouchableOpacity onPress={uploadSelectedItems}>
                        <View style={styles.eachItem}>
                            <Icon name={'cloudUpload'} width={wp(3.5)} height={wp(3.5)} />
                            <Text style={styles.text}>Upload</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteSelectedItems}>
                        <View style={styles.eachItem}>
                            <Icon name={'delete'} width={wp(3.5)} height={wp(3.5)} />
                            <Text style={styles.text}>Delete</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.eachItem}>
                        <Icon name={'albumAdd'} width={wp(3.5)} height={wp(3.5)} />
                        <Text style={styles.text}>Add to Album</Text>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};

export default HandelMultipleSelect;

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: wp(2),
        paddingHorizontal: wp(2),
    },
    eachItem: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: wp(0.2),
    },
    text: {
        color: theme.colors.text,
        fontSize: wp(2),
    },
});
