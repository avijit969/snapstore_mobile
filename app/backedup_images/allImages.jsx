import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { MasonryFlashList } from '@shopify/flash-list';
import { getAllPhotos } from '../../utils/managePhotos';
import { Image } from 'expo-image';
import { getHeight, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { addRemoteAssets } from '../../features/media/mediaSlice';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
const AllImages = () => {
  const [remoteAssets, setRemoteAssets] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalImage, setTotalImages] = useState(0)
  const router = useRouter();
  const dispatch = useDispatch()
  const assets = useSelector((state) => state.media.remoteAssets)
  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    dispatch(addRemoteAssets(remoteAssets))
  }, [remoteAssets])
  const fetchPhotos = async () => {
    if (loading || !hasNextPage) return;
    setLoading(true);
    const response = await getAllPhotos(page, 10);
    if (response.success) {
      setTotalImages(response.data.totalDocs)
      setRemoteAssets((prev) => [...prev, ...response.data.docs]);
      setHasNextPage(response.data.hasNextPage);
      setPage((prev) => prev + 1);
    } else {
      setHasNextPage(false);
      setPage(1);
    }
    setLoading(false);
  };
  // handel press
  const handelPress = (index) => {
    console.log('indexjhjss', index);
    router.push({
      pathname: `/backedup_images/${index}`,
    });
  }
  return (
    <ScreenWrapper>
      <View intensity={40} style={styles.blurContainer}>
        {!loading && <Text style={styles.snapCount}>
          Total {totalImage} snaps are uploaded
        </Text>}
      </View>
      <MasonryFlashList
        data={assets}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handelPress(index)}>
            <View style={styles.imageWrapper}>
              <Image
                source={item.url?.replace('http', 'https')}
                style={[styles.image, { height: getHeight(item.height, item.width) }]}
                transition={100}
              />
            </View>
          </TouchableOpacity>
        )}
        estimatedItemSize={500}
        onEndReached={fetchPhotos}
        onEndReachedThreshold={.5}
        ListFooterComponent={loading ? <Loading size='large' /> : null}
      />
    </ScreenWrapper>
  );
};

export default AllImages;

const styles = StyleSheet.create({
  snapCount: {
    alignSelf: 'center',
    fontSize: wp(3),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.primary,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  imageWrapper: {
    margin: 5,
    backgroundColor: '#ccc',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    borderRadius: theme.radius.sm,
  }
});
