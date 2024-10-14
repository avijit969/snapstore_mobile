import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { addAssets } from '../../features/media/mediaSlice'
const Photos = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [endCursor, setEndCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [remoteAssets, setRemoteAssets] = useState([]);
    const [mergedAssetsf, setMergedAssetsf] = useState([]);
    const router = useRouter();
    const dispatch = useDispatch()
    const mergedAssetsData = useSelector((state) => state.media.mergedAssets)
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
        const startCreationDateTime = await media.assets[0].modificationTime;
        const endCreationDateTime = await media.assets[media.assets.length - 1].modificationTime;
        await fetchRemoteAssets(media.assets, startCreationDateTime, endCreationDateTime);
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
        const mergedAssets = localAssets.map((asset) => {
            const remoteAsset = fetchedRemoteAssets.find((remote) => remote.localAssetId === asset.id);
            return {
                ...asset,
                isBackedUp: !!remoteAsset
            };
        });

        setMergedAssetsf((prev) => [...prev, ...mergedAssets]);
    };

    // Log the merged assets after they've been updated
    useEffect(() => {
        if (mergedAssetsf.length) {
            dispatch(addAssets(mergedAssetsf));
        }
    }, [mergedAssetsf]);

    const handleMediaPress = (index) => {
        router.push({
            pathname: `/media/${index}`,
        });
    };

    const renderMediaItem = ({ item, index }) => (
        <TouchableOpacity key={item.id} onPress={() => handleMediaPress(index)}>
            <Image
                source={{ uri: item.uri }}
                style={{ width: 120, height: 120, padding: 10, borderRadius: 10, margin: 1 }}
            />
            {item.isBackedUp && (
                <View style={{ position: 'absolute', bottom: 5, right: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="cloud-done" size={20} color="green" />

                </View>
            )}
        </TouchableOpacity>
    );

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
                    data={mergedAssetsData} // Use merged assets here
                    numColumns={3}
                    contentContainerStyle={{ marginRight: wp(1) }}
                    onEndReachedThreshold={2}
                    onEndReached={hasNextPage ? loadMediaFiles : null}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMediaItem}
                />
            </View>
        </ScreenWrapper>
    );
};

export default Photos;

const styles = StyleSheet.create({});
