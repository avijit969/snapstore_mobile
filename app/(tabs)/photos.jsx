import { FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';
import axios from 'axios';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import { wp } from '@/helpers/common';
import { getToken } from '../../utils/tokenManage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { addAssets } from '../../features/media/mediaSlice';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import HandelMultipleSelect from '../../components/HandelMultiPleSelect';
import { theme } from '../../constants/theme';
import UploadProgress from '../../components/UploadProgress';
import Toast from 'react-native-toast-message';
import Loading from '../../components/Loading';
// Memoized component to prevent re-renders unless props change
const RenderMediaItem = React.memo(({ item, index, handleMediaPress, handleLongPress, isSelected }) => (
    <TouchableOpacity
        key={item.id}
        onPress={() => handleMediaPress(index)}
        onLongPress={() => handleLongPress(index)}
        style={{ position: 'relative' }}
    >
        <Image
            source={item.uri}
            style={{
                width: wp(15.5),
                height: wp(15.5),
                padding: 10,
                borderRadius: 10,
                margin: 1,
                opacity: isSelected ? 0.5 : 1, // Dim the image if selected
            }}
        />
        {item.isBackedUp && (
            <View style={{ position: 'absolute', bottom: 5, right: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="cloud-done" size={wp(3.5)} color={theme.colors.primary} />
            </View>
        )}
        {/* set the upload progress icon */}
        {<UploadProgress item={item} />}
        {isSelected && (
            <View style={{ position: 'absolute', top: 5, right: 5 }}>
                <Icon name="checkmark-circle" size={wp(3.5)} color="blue" />
            </View>
        )}
    </TouchableOpacity>
));
const Photos = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [endCursor, setEndCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // New state for pull-to-refresh
    const [remoteAssets, setRemoteAssets] = useState([]);
    const [mergedAssetsf, setMergedAssetsf] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const mergedAssetsData = useSelector((state) => state.media.mergedAssets);
    const multipleSelectedItemModalRef = useRef(null);
    const [toasterData, setToasterData] = useState({});
    useEffect(() => {
        const getPermission = async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            if (status === 'granted') {
                loadMediaFiles();
            }
        };
        getPermission();
    }, []);

    useEffect(() => {
        multipleSelectedItemModalRef.current?.present();
    }, [selectedItems]);

    // Load media files function
    const loadMediaFiles = async () => {
        if (loading || (!hasNextPage && endCursor !== null)) return;
        setLoading(true);

        const mediaOptions = {
            mediaType: ['photo', 'video'],
            first: 40,
            sortBy: ['modificationTime'],
        };

        if (endCursor) {
            mediaOptions.after = endCursor;
        }

        const media = await MediaLibrary.getAssetsAsync(mediaOptions);
        const startCreationDateTime = media.assets[0]?.modificationTime;
        const endCreationDateTime = media.assets[media.assets.length - 1]?.modificationTime;

        if (media.assets.length) {
            await fetchRemoteAssets(media.assets, startCreationDateTime, endCreationDateTime);
        }

        setEndCursor(media.endCursor);
        setHasNextPage(media.hasNextPage);
        setLoading(false);
    };

    // Fetch remote assets
    const fetchRemoteAssets = async (loadedAssets, startCreationDateTime, endCreationDateTime) => {
        const accessToken = await getToken();
        try {
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_API_URL}/photos/all-photos-by-date-range`,
                {
                    params: {
                        startCreationDateTime,
                        endCreationDateTime,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setRemoteAssets(response.data.data);
            compareAndMergeRemoteAssets(loadedAssets, response.data.data);
        } catch (error) {
            compareAndMergeRemoteAssets(loadedAssets, []);
        }
    };

    // Compare and merge remote assets
    const compareAndMergeRemoteAssets = (localAssets, fetchedRemoteAssets) => {
        let mergedAssets = localAssets.map((asset) => {
            const remoteAsset = fetchedRemoteAssets.find((remote) => remote.localAssetId === asset.id);
            return {
                ...asset,
                isBackedUp: !!remoteAsset,
                uploadProgress: false,
                _id: remoteAsset?._id,
            };
        });

        const missingLocalAssets = fetchedRemoteAssets.filter(
            (remote) => !localAssets.some((local) => local.id === remote.localAssetId)
        );

        missingLocalAssets.forEach((remoteAsset) => {
            const { localAssetId, creationDateTime } = remoteAsset;
            const insertionIndex = mergedAssets.findIndex(
                (asset) => asset.modificationTime > creationDateTime
            );
            const newRemoteAsset = {
                id: localAssetId,
                uri: remoteAsset.url?.replace('http', 'https'),
                modificationTime: creationDateTime,
                isBackedUp: true,
                mediaType: remoteAsset.url.split('.').pop() === 'mp4' ? 'video' : 'photo',
                _id: remoteAsset._id
            };

            if (insertionIndex === -1) {
                mergedAssets.push(newRemoteAsset);
            } else {
                mergedAssets.splice(insertionIndex, 0, newRemoteAsset);
            }
        });

        setMergedAssetsf((prev) => [...prev, ...mergedAssets]);
    };

    useEffect(() => {
        if (mergedAssetsf.length) {
            dispatch(addAssets(mergedAssetsf));
        }
    }, [mergedAssetsf]);

    // Handle pull-to-refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setEndCursor(null); // Reset the cursor to reload from the start
        setMergedAssetsf([]); // Clear current media
        await loadMediaFiles(); // Reload media
        setRefreshing(false); // Stop refreshing
    }, []);

    const handleMediaPress = useCallback((index) => {
        if (isSelectionMode) {
            toggleSelectItem(index);
        } else {
            router.push({
                pathname: `/media/${index}`,
            });
        }
    }, [isSelectionMode, router]);

    const handleLongPress = useCallback((index) => {
        setIsSelectionMode(true);
        toggleSelectItem(index);
    }, []);

    const toggleSelectItem = (index) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(index)) {
                return prevSelectedItems.filter((item) => item !== index);
            } else {
                return [...prevSelectedItems, index];
            }
        });
    };

    const renderMediaItem = useCallback(({ item, index }) => (
        <RenderMediaItem
            item={item}
            index={index}
            handleMediaPress={handleMediaPress}
            handleLongPress={handleLongPress}
            isSelected={selectedItems.includes(index)}  // Check if the item is selected
        />
    ), [handleMediaPress, handleLongPress, selectedItems]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedItems([]);
                setIsSelectionMode(false);
            };
        }, [])
    );

    useEffect(() => {
        if (toasterData?.type) {
            Toast.show({
                type: toasterData.type,
                text1: toasterData.heading,
                text2: toasterData.message,
                position: toasterData.position,
            })
        }
    }, [toasterData]);
    if (loading && mergedAssetsf.length === 0) return
    <View >
        <Loading color={theme.colors.primary} />
    </View>
    return (
        <ScreenWrapper bg='white'>
            <Header />
            <View style={{ paddingHorizontal: wp(1), paddingBottom: wp(10) }}>
                {selectedItems.length > 0 && (
                    <HandelMultipleSelect bottomSheetModalRef={multipleSelectedItemModalRef} selectedItems={selectedItems} setSelectedItems={setSelectedItems} setSelectionMode={setIsSelectionMode}
                        setToasterData={setToasterData} />
                )}
                <FlatList
                    data={mergedAssetsData}
                    numColumns={3}
                    contentContainerStyle={{ marginRight: wp(1) }}
                    onEndReachedThreshold={2}
                    onEndReached={hasNextPage ? loadMediaFiles : null}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMediaItem}
                    initialNumToRender={10}
                    windowSize={5}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Added pull-to-refresh
                    }
                />
            </View>
            <Toast />
        </ScreenWrapper>
    );
};

export default Photos;

const styles = StyleSheet.create({});
