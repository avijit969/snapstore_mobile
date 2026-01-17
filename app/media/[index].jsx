import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Video } from 'expo-video';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import ScreenWrapper from '../../components/ScreenWrapper';
import axios from 'axios';
import { getToken } from '../../utils/tokenManage';
import { markAssetAsBackedUp, removeAParticularAsset } from '../../features/media/mediaSlice';
import Icon from '../../assets/icons';
import { hp, wp } from '../../helpers/common';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

import Toaster from '../../components/Toaster';
import * as MediaLibrary from 'expo-media-library';
import dateCovertToLocalDate from '../../utils/manageDate';
import { Image } from 'expo-image';
import { mediaStyles } from '../../constants/mediaStyles';
import AddToAlbum from '../../components/AddToAlbum';
import { deleteImage, deleteImageFromDevice } from '../../utils/managePhotos';
export default function MediaViewer() {
  const mergedAssetsData = useSelector((state) => state.media.mergedAssets);
  const dispatch = useDispatch();
  const { index } = useLocalSearchParams();
  const { width, height } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = React.useState(parseInt(index, 10));
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const addToAlbumRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%', '90%'], []);
  const currentAsset = mergedAssetsData[currentIndex];
  const [assetExtraInfo, setAssetExtraInfo] = useState(null)
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentAddToAlbumModalPress = useCallback(() => {
    addToAlbumRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  useEffect(() => {
    const fetchAssetInfo = async () => {
      const asset = await MediaLibrary.getAssetInfoAsync(currentAsset.id);
      setAssetExtraInfo(asset);
    };

    fetchAssetInfo();
  }, [currentIndex, currentAsset]);
  const renderItem = ({ item }) => {
    return item.mediaType === 'photo' ? (
      <Image
        source={item.uri}
        style={{ width, height }}
        contentFit='contain'
        transition={100}
      />
    ) : (
      <Video
        source={{ uri: item.uri }}
        style={{ width, height }}
        resizeMode="contain"
        useNativeControls
        isLooping={true}
      />
    );
  };

  const handleSaveToCloud = async () => {
    try {
      const accessToken = await getToken();
      const data = mergedAssetsData[currentIndex];

      const formData = new FormData();
      formData.append('localAssetId', data.id);
      formData.append('creationDateTime', data.modificationTime);
      if (data.mediaType === 'photo') {
        formData.append('photo', {
          uri: data.uri,
          name: `photo_${data.id}.jpg`,
          type: 'image/jpeg'
        });
      } else {
        formData.append('photo', {
          uri: data.uri,
          name: `video_${data.id}.mp4`,
          type: 'video/mp4'
        });
      }
      const response = await axios({
        method: 'POST',
        url: `${process.env.EXPO_PUBLIC_API_URL}/photos/upload-single`,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`
        },
        data: formData
      });
      if (response.data.success) {
        Toaster({
          type: 'success',
          heading: 'Success!',
          message: response.data.message,
          position: 'bottom'
        })
      }
      dispatch(markAssetAsBackedUp({ index: currentIndex }));
    } catch (error) {
      Toaster({
        type: 'error',
        heading: 'failed!',
        message: error.message,
        position: 'bottom'
      })
    }
  };

  const handleShare = () => {
    console.log('Share');
  };
  const handleDelete = async () => {
    try {
      const response = currentAsset.isBackedUp ? await deleteImageFromDevice(currentAsset.id) : await deleteImage(currentAsset._id)
      if (response.success) {
        dispatch(removeAParticularAsset(currentIndex))
        Toaster({
          type: 'success',
          heading: 'Success!',
          message: response.message,
          position: 'bottom'
        })
      }
    } catch (error) {
      Toaster({
        type: 'error',
        heading: 'failed!',
        message: error.message,
        position: 'bottom'
      })
    }
  }

  return (
    <ScreenWrapper>
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

        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name={'arrowLeft'} height={30} width={30} color="white" />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: wp(4), alignContent: 'center', alignItems: 'center', justifyContent: "center" }}>
            <TouchableOpacity onPress={handleSaveToCloud} accessibilityLabel="Save to cloud">
              {mergedAssetsData[currentIndex]?.isBackedUp ? ('') : (<MaterialIcons name="cloud-upload" size={30} color="white" />)}
            </TouchableOpacity>
            <TouchableOpacity >
              <Icon name={'star'} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePresentModalPress} >
              <Icon name={"more"} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={[styles.contentContainer, { height: hp(50) }]}>
          <View style={styles.BSContainer}>
            <TouchableOpacity onPress={() => handlePresentAddToAlbumModalPress()}>
              <View style={styles.BSButton}>
                <Icon name={'albumAdd'} />
                <Text style={styles.BSButtonText}>Add to album</Text>
              </View>
            </TouchableOpacity>
            {!currentAsset?.isBackedUp && (<TouchableOpacity onPress={handleSaveToCloud}>
              <View style={styles.BSButton}>
                <Icon name={'cloudUpload'} />
                <Text style={styles.BSButtonText}>Backup</Text>
              </View>
            </TouchableOpacity>)}
            <TouchableOpacity onPress={handleDelete}>
              <View style={styles.BSButton}>
                <Icon name={'delete'} />
                <Text style={styles.BSButtonText}>delete from {currentAsset?.isBackedUp ? 'cloud' : 'device'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.BSButton}>
                <Icon name={'share'} />
                <Text style={styles.BSButtonText}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
          <View>
            {/* creation day , month date,year time */}
            <Text style={styles.BSDateTime}>{dateCovertToLocalDate(currentAsset.modificationTime)}</Text>
          </View>

          {/* showing assets metadata */}
          <View style={styles.BSDetailsContainer}>
            <Text style={styles.BSDetailsTitle}>Details</Text>
            {assetExtraInfo?.exif?.Make && (<View style={styles.BSDetailsItems} >
              <View>
                <Icon name={'cameraLense'} width={wp(6)} height={wp(6)} />
              </View>
              <View>
                <Text style={styles.BSDetails1stItems}>{assetExtraInfo?.exif?.Make}  {assetExtraInfo?.exif?.Model}</Text>
                <Text style={styles.BSDetails2ndItems}>f/{assetExtraInfo?.exif?.FNumber}  {assetExtraInfo?.exif?.FocalLength}mm   ISO{assetExtraInfo?.exif?.ISOSpeedRatings}</Text>
              </View>
            </View>)}
            {assetExtraInfo?.exif?.Make && (<View style={styles.BSDetailsItems} >
              <View>
                <Icon name={'image'} width={wp(6)} height={wp(6)} />
              </View>
              <View>
                <Text style={styles.BSDetails1stItems}>{assetExtraInfo?.filename} </Text>
                <Text style={styles.BSDetails2ndItems}>{assetExtraInfo?.width} x {assetExtraInfo?.height}</Text>
              </View>
            </View>)}
            <AddToAlbum bottomSheetModalRef={addToAlbumRef} />
          </View>

        </BottomSheetView>
      </BottomSheetModal>
    </ScreenWrapper>
  );
}

const styles = mediaStyles
