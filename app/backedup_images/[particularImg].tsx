import { Dimensions, StyleSheet, View, TouchableOpacity, Text, Alert, Share } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as Clipboard from 'expo-clipboard';
import { RootState } from '@/store/store';
import { Feather } from '@expo/vector-icons';
import { hp, wp } from '@/helpers/common';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn, FadeOut } from 'react-native-reanimated';
import { FlatList as RNFlatList } from 'react-native';

const { width, height } = Dimensions.get('window');

const Page = () => {
    const { particularImg } = useLocalSearchParams<{ particularImg: string }>();
    const [currentIndex, setCurrentIndex] = useState(parseInt(particularImg || '0', 10) || 0);
    const [showControls, setShowControls] = useState(true);
    const assets = useSelector((state: RootState) => state.media.remoteAssets);
    const router = useRouter();

    const isVideo = (url: string) => {
        if (!url) return false;
        const extension = url.split('.').pop();
        return extension === 'mp4';
    };

    const currentAsset = assets[currentIndex];
    const currentVideoUri = currentAsset && isVideo(currentAsset.url) ? currentAsset.url.replace('http', 'https') : null;

    const player = useVideoPlayer(currentVideoUri || '', player => {
        if (currentVideoUri) {
            player.loop = true;
            player.play();
        }
    });

    const copyToClipboard = () => {
        const url = currentAsset?.url?.replace('http', 'https') || '';
        Clipboard.setStringAsync(url);
        Alert.alert("Copied!", "URL copied to clipboard");
    };

    const handleShare = async () => {
        try {
            const url = currentAsset?.url?.replace('http', 'https') || '';
            await Share.share({
                message: `Check out this media: ${url}`,
                url: url,
            });
        } catch (error: any) {
            Alert.alert('Share failed', error.message);
        }
    };

    const toggleControls = () => {
        setShowControls(prev => !prev);
    };

    const ZoomableImage = ({ uri }: { uri: string }) => {
        const scale = useSharedValue(1);
        const savedScale = useSharedValue(1);
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);
        const savedTranslateX = useSharedValue(0);
        const savedTranslateY = useSharedValue(0);

        const pinchGesture = Gesture.Pinch()
            .onUpdate((e) => {
                scale.value = savedScale.value * e.scale;
            })
            .onEnd(() => {
                if (scale.value < 1) {
                    scale.value = withSpring(1);
                    translateX.value = withSpring(0);
                    translateY.value = withSpring(0);
                    savedTranslateX.value = 0;
                    savedTranslateY.value = 0;
                } else if (scale.value > 4) {
                    scale.value = withSpring(4);
                }
                savedScale.value = scale.value;
            });

        const panGesture = Gesture.Pan()
            .enabled(scale.value > 1)
            .onUpdate((e) => {
                translateX.value = savedTranslateX.value + e.translationX;
                translateY.value = savedTranslateY.value + e.translationY;
            })
            .onEnd(() => {
                savedTranslateX.value = translateX.value;
                savedTranslateY.value = translateY.value;
            });

        const doubleTap = Gesture.Tap()
            .numberOfTaps(2)
            .onEnd(() => {
                if (scale.value > 1) {
                    scale.value = withSpring(1);
                    translateX.value = withSpring(0);
                    translateY.value = withSpring(0);
                    savedScale.value = 1;
                    savedTranslateX.value = 0;
                    savedTranslateY.value = 0;
                } else {
                    scale.value = withSpring(2);
                    savedScale.value = 2;
                }
            });

        const singleTap = Gesture.Tap()
            .numberOfTaps(1)
            .onEnd(() => {
                toggleControls();
            });

        const composed = Gesture.Race(
            doubleTap,
            Gesture.Simultaneous(
                pinchGesture,
                panGesture
            ),
            singleTap
        );

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [
                { scale: scale.value },
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        }));

        return (
            <GestureDetector gesture={composed}>
                <Animated.View style={[{ width, height }, animatedStyle]}>
                    <Image
                        source={uri}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="contain"
                        transition={200}
                    />
                </Animated.View>
            </GestureDetector>
        );
    };

    const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
        const isVideoFile = isVideo(item.url);
        const secureUrl = item.url ? item.url.replace('http', 'https') : '';
        const isCurrentItem = index === currentIndex;

        return (
            <View style={{ width, height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                {isVideoFile ? (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={toggleControls}
                        style={{ width, height }}
                    >
                        {isCurrentItem && player ? (
                            <VideoView
                                player={player}
                                style={{ width, height }}
                                contentFit="contain"
                                nativeControls
                            />
                        ) : (
                            <Image
                                source={secureUrl}
                                style={{ width, height }}
                                contentFit="contain"
                                transition={100}
                            />
                        )}
                    </TouchableOpacity>
                ) : (
                    <ZoomableImage uri={secureUrl} />
                )}
            </View>
        );
    }, [currentIndex, player, toggleControls]);

    return (
        <ScreenWrapper bg='black'>
            <View style={styles.container}>
                <RNFlatList
                    data={assets}
                    horizontal
                    pagingEnabled
                    keyExtractor={(item) => item._id || item.id}
                    renderItem={renderItem}
                    initialScrollIndex={currentIndex}
                    getItemLayout={(data, index) => (
                        { length: width, offset: width * index, index }
                    )}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(index);
                    }}
                    showsHorizontalScrollIndicator={false}
                />

                {/* Top Toolbar - Only show when controls are visible */}
                {showControls && (
                    <Animated.View
                        style={styles.topToolbar}
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                    >
                        <TouchableOpacity onPress={() => router.back()} style={styles.toolbarButton}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity onPress={handleShare} style={styles.toolbarButton}>
                                <Feather name="share-2" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={copyToClipboard} style={styles.toolbarButton}>
                                <Feather name="link" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

                {/* Bottom Info - Only show when controls are visible */}
                {showControls && (
                    <Animated.View
                        style={styles.bottomInfo}
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                    >
                        <Text style={styles.infoText}>
                            {currentIndex + 1} / {assets.length}
                        </Text>
                        {!isVideo(currentAsset?.url) && (
                            <Text style={styles.hintText}>
                                Pinch to zoom • Double tap to reset
                            </Text>
                        )}
                    </Animated.View>
                )}
            </View>
        </ScreenWrapper>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    topToolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: hp(6),
        paddingHorizontal: wp(4),
        paddingBottom: hp(2),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    toolbarButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    hintText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
});
