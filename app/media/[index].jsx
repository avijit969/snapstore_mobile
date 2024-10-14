import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Image, Dimensions, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import ScreenWrapper from '../../components/ScreenWrapper';
import axios from 'axios';
import { getToken } from '../../utils/tokenManage';
import { markAssetAsBackedUp } from '../../features/media/mediaSlice';
import Icon from '../../assets/icons';
import { hp, wp } from '../../helpers/common';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { theme } from '../../constants/theme';
import Toaster from '../../components/Toaster';
import * as MediaLibrary from 'expo-media-library';
import dateCovertToLocalDate from '../../utils/manageDate';
export default function MediaViewer() {
  const mergedAssetsData = useSelector((state) => state.media.mergedAssets);
  const dispatch = useDispatch();
  const { index } = useLocalSearchParams();
  const { width, height } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = React.useState(parseInt(index, 10));
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%', '90%'], []);
  const currentAsset = mergedAssetsData[currentIndex];
  const [assetExtraInfo, setAssetExtraInfo] = useState(null)
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
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
  const getAssetExtraInfo = async (assetId) => {
    const asset = await MediaLibrary.getAssetInfoAsync(assetId);
    console.log(JSON.stringify(asset, null, 2));
    return asset;
  }
  useEffect(() => {
    console.log('currentAsset', currentAsset);
    const fetchAssetInfo = async () => {
      const asset = await MediaLibrary.getAssetInfoAsync(currentAsset.id);
      setAssetExtraInfo(asset);
      console.log("EXIF data:", JSON.stringify(asset?.exif, null, 2));
    };

    fetchAssetInfo();
  }, [currentIndex, currentAsset]);
  const renderItem = ({ item }) => {
    return item.mediaType === 'photo' ? (
      <Image
        source={{ uri: item.uri }}
        style={{ width, height }}
        resizeMode="contain"
        resizeMethod="resize"
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
          name: `video_${data.id}.mp4`, // Ensure a proper filename
          type: 'video/mp4' // Set appropriate MIME type
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
      console.log("Error uploading photo:", error.response?.data || error.message);
    }
  };

  const handleShare = () => {
    console.log('Share');
  };
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
        <Toast />
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
            <TouchableOpacity >
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
            <TouchableOpacity>
              <View style={styles.BSButton}>
                <Icon name={'delete'} />
                <Text style={styles.BSButtonText}>delete from device</Text>
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
          </View>
          <Toast />
        </BottomSheetView>
      </BottomSheetModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    top: 0,  // Corrected typo here
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',  // Adjusted for better visibility
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  BSContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  BSButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: wp(1)
  },
  BSButtonText: {
    fontSize: wp(1.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.dark,
  },
  line: {
    height: 1, // Line height
    backgroundColor: theme.colors.darkLight,
    marginVertical: wp(1),
    marginHorizontal: wp(1),
  },
  BSDateTime: {
    fontSize: wp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.dark,
    margin: wp(3),
  },
  BSDetailsItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    margin: wp(3),
  },
  BSDetails1stItems: {
    fontSize: wp(2.1),
    fontWeight: theme.fonts.bold,
    color: theme.colors.dark,
    flexDirection: 'row',
    alignItems: 'center',
  },
  BSDetails2ndItems: {
    fontSize: wp(1.8),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.dark,
    flexDirection: 'row',
    alignItems: 'center',
  },
  BSDetailsTitle: {
    fontSize: wp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.dark,
    marginLeft: wp(3),
  }
});
