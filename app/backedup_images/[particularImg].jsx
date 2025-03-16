import { Dimensions, FlatList, StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';
import { Video } from 'expo-av';
import * as Clipboard from 'expo-clipboard';

const Page = () => {
    const { particularImg } = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(parseInt(particularImg, 10) || 0);
    const assets = useSelector((state) => state.media.remoteAssets);
    const { width, height } = Dimensions.get('window');

    const isVideo = (url) => {
        const extension = url.split('.').pop();
        return extension === 'mp4';
    };

    const copyToClipboard = (url) => {
        Clipboard.setStringAsync(url);
        Alert.alert("Copied to Clipboard", "The URL has been copied successfully.");
    };

    const renderItem = ({ item }) => {
        const isVideoFile = isVideo(item.url);
        const secureUrl = item.url.replace('http', 'https');

        return (
            <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
                {isVideoFile ? (
                    <Video
                        source={{ uri: secureUrl }}
                        style={{ width, height }}
                        resizeMode="contain"
                        useNativeControls
                        isLooping={true}
                    />
                ) : (
                    <Image
                        source={secureUrl}
                        style={{ width, height }}
                        contentFit="contain"
                        transition={100}
                    />
                )}
                <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(secureUrl)}
                >
                    <Text style={styles.copyButtonText}>Copy URL</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScreenWrapper>
            <View style={{ backgroundColor: 'black' }}>
                <FlatList
                    data={assets}
                    horizontal
                    pagingEnabled
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    initialScrollIndex={currentIndex}
                    getItemLayout={(data, index) => (
                        { length: width, offset: width * index, index }
                    )}
                />
            </View>
        </ScreenWrapper>
    );
};

export default Page;

const styles = StyleSheet.create({
    copyButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    copyButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
