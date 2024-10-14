import React, { useCallback, useMemo, useRef } from 'react';
import { View, Image, Dimensions, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import ScreenWrapper from '../../components/ScreenWrapper';
import axios from 'axios';
import { getToken } from '../../utils/tokenManage';
import { markAssetAsBackedUp } from '../../features/media/mediaSlice';
import Icon from '../../assets/icons';
import { wp } from '../../helpers/common';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
export default function MediaViewer() {
  const mergedAssetsData = useSelector((state) => state.media.mergedAssets);
  const dispatch = useDispatch();
  const { index } = useLocalSearchParams();
  const { width, height } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = React.useState(parseInt(index, 10));

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%', '90%'], []);
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
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    []
  );
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
          name: `photo_${data.id}.jpg`, // Ensure a proper filename
          type: 'image/jpeg' // Set appropriate MIME type
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

      console.log(response.data);
      console.log('Upload successful');
      // Mark in mergedAssetsData as backed up true
      dispatch(markAssetAsBackedUp({ index: currentIndex }));
    } catch (error) {
      console.log("Error uploading photo:", error.response?.data || error.message);
    }
  };

  const handleEdit = () => {
    console.log('Edit');
  };

  const handleShare = () => {
    console.log('Share');
  };

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
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
          <TouchableOpacity>
            <Icon name={'arrowLeft'} height={wp(5)} width={wp(5)} color="white" style={styles.iconButton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveToCloud} style={styles.iconButton} accessibilityLabel="Save to cloud">
            {mergedAssetsData[currentIndex]?.isBackedUp ? ('') : (<MaterialIcons name="cloud-upload" size={30} color="white" />)}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton} accessibilityLabel="Edit">
            <Ionicons name="create-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePresentModalPress} style={styles.iconButton} accessibilityLabel="Share">
            <Icon name={"more"} width={wp(5)} height={wp(5)} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
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
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',  // Adjusted for better visibility
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
});
