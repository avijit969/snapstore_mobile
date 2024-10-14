import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
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

// Memoized component to prevent re-renders unless props change
const RenderMediaItem = React.memo(({ item, index, handleMediaPress }) => (
    <TouchableOpacity key={item.id} onPress={() => handleMediaPress(index)}>
        <Image
            source={{ uri: item.uri }}
            style={{ width: wp(15.5), height: wp(15.5), padding: 10, borderRadius: 10, margin: 1 }}
        />
        {item.isBackedUp && (
            <View style={{ position: 'absolute', bottom: 5, right: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="cloud-done" size={20} color="green" />
            </View>
        )}
    </TouchableOpacity>
));

const Photos = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [endCursor, setEndCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [remoteAssets, setRemoteAssets] = useState([]);
    const [mergedAssetsf, setMergedAssetsf] = useState([]);
    const router = useRouter();
    const dispatch = useDispatch();
    const mergedAssetsData = useSelector((state) => state.media.mergedAssets);

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

    const compareAndMergeRemoteAssets = (localAssets, fetchedRemoteAssets) => {
        // Create a new merged array with local assets and their backup status
        let mergedAssets = localAssets.map((asset) => {
            const remoteAsset = fetchedRemoteAssets.find((remote) => remote.localAssetId === asset.id);
            return {
                ...asset,
                isBackedUp: !!remoteAsset
            };
        });

        // Add remote assets that are not found locally (i.e., deleted locally but backed up remotely)
        const missingLocalAssets = fetchedRemoteAssets.filter(
            (remote) => !localAssets.some((local) => local.id === remote.localAssetId)
        );

        console.log('Missing local assets:', missingLocalAssets);

        // Insert these missing assets into the correct time position based on creation date
        missingLocalAssets.forEach((remoteAsset) => {
            console.log('Remote asset data:', remoteAsset); // Log remote asset data for debugging
            const { localAssetId, creationDateTime } = remoteAsset;

            // Log the creation time to ensure it's being accessed correctly
            console.log('Remote asset insertion time:', creationDateTime);



            // Find the correct insertion index based on the creation date
            const insertionIndex = mergedAssets.findIndex(
                (asset) => asset.modificationTime > creationDateTime
            );

            console.log('Calculated insertion index:', insertionIndex);

            // Create a new asset object for the remote asset
            const newRemoteAsset = {
                id: localAssetId,
                uri: remoteAsset.url,
                modificationTime: creationDateTime,
                isBackedUp: true,
                mediaType: remoteAsset.url.split('.').pop() === 'mp4' ? 'video' : 'photo',
            };

            // Insert at the correct position, or append if no earlier asset is found
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

    const handleMediaPress = useCallback((index) => {
        router.push({
            pathname: `/media/${index}`,
        });
    }, [router]);

    const renderMediaItem = useCallback(({ item, index }) => (
        <RenderMediaItem item={item} index={index} handleMediaPress={handleMediaPress} />
    ), [handleMediaPress]);

    if (hasPermission === null) {
        return <Text>Requesting for permissions...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to media library.</Text>;
    }

    return (
        <ScreenWrapper bg='white'>
            <Header />
            <View style={{ paddingHorizontal: wp(1), paddingBottom: wp(10) }}>
                <FlatList
                    data={mergedAssetsData}
                    numColumns={3}
                    contentContainerStyle={{ marginRight: wp(1) }}
                    onEndReachedThreshold={2}
                    onEndReached={hasNextPage ? loadMediaFiles : null}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMediaItem}
                    initialNumToRender={10}  // Adjust initial render count
                    windowSize={5}           // Adjust window size for better performance
                />
            </View>
        </ScreenWrapper>
    );
};

export default Photos;

const styles = StyleSheet.create({});
