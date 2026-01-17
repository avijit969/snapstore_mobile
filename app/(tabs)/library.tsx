import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, RefreshControl, Dimensions, Alert, Modal, TextInput, Pressable, Platform } from 'react-native'
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { wp, hp } from '@/helpers/common'
import { getAlbums, deleteAlbum as deleteAlbumApi, editAlbumDetails } from '@/utils/manageAlbums'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { addAlbums, removeAlbum, updateAlbum } from '../../features/album/albumSlice'
import BackButton from '@/components/BackButton'
import { FlashList } from '@shopify/flash-list'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
// Removed LinearGradient as per request

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = wp(4);

const Library = () => {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState<any>(null)
    const [newAlbumName, setNewAlbumName] = useState('')
    const [newAlbumDesc, setNewAlbumDesc] = useState('')

    // Layout state
    const [isGrid, setIsGrid] = useState(true);

    // Bottom Sheet Ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const router = useRouter()
    const dispatch = useDispatch()
    const albums = useSelector((state: any) => state.album.albums)

    // Derived values for layout
    const columnCount = isGrid ? 2 : 1;
    const itemSize = isGrid
        ? (SCREEN_WIDTH - (columnCount + 1) * GAP) / columnCount
        : (SCREEN_WIDTH - 2 * GAP); // Full width minus padding

    const fetchAllAlbums = async () => {
        setLoading(true)
        const response = await getAlbums()
        if (response.success) {
            dispatch(addAlbums(response.data))
        } else {
            Alert.alert('Error', response.message)
        }
        setLoading(false)
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await fetchAllAlbums()
        setRefreshing(false)
    }, [])

    useEffect(() => {
        fetchAllAlbums()
    }, [])

    const handlePresentModalPress = useCallback((album: any) => {
        setSelectedAlbum(album);
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismissModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleDeleteAlbum = () => {
        handleDismissModal();
        if (!selectedAlbum) return;

        Alert.alert(
            "Delete Album",
            `Are you sure you want to delete "${selectedAlbum.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const res = await deleteAlbumApi(selectedAlbum._id);
                        if (res.success) {
                            dispatch(removeAlbum(selectedAlbum._id));
                        } else {
                            Alert.alert("Error", res.message);
                        }
                    }
                }
            ]
        );
    }

    const openEditModal = () => {
        handleDismissModal();
        if (!selectedAlbum) return;
        setNewAlbumName(selectedAlbum.name);
        setNewAlbumDesc(selectedAlbum.description || '');
        setEditModalVisible(true);
    }

    const handleUpdateAlbum = async () => {
        if (!selectedAlbum) return;
        if (!newAlbumName.trim()) {
            Alert.alert("Error", "Album name cannot be empty");
            return;
        }

        const res = await editAlbumDetails(selectedAlbum._id, newAlbumName, newAlbumDesc);
        if (res.success) {
            dispatch(updateAlbum(res.data));
            setEditModalVisible(false);
        } else {
            Alert.alert("Error", res.message);
        }
    }

    const renderAlbumItem = ({ item, index }: { item: any, index: number }) => {
        // Dynamic styles based on layout
        const cardStyle = {
            width: itemSize,
            height: isGrid ? itemSize * 1.3 : itemSize * 0.6, // Taller for grid, shorter/wider for list
        };

        if (item.isCreateNew) {
            return (
                <TouchableOpacity
                    onPress={() => router.push('albums/createNew' as any)}
                    activeOpacity={0.7}
                    style={[styles.cardContainer, { marginRight: isGrid ? GAP : 0 }]}
                >
                    <View style={[styles.albumCard, cardStyle, styles.createNewCard]}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="add" size={32} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.createtext}>New Album</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity
                onPress={() => router.push({ pathname: `albums/[albums]`, params: { albums: item._id } } as any)}
                onLongPress={() => handlePresentModalPress(item)}
                activeOpacity={0.9}
                style={[styles.cardContainer, { marginRight: isGrid ? GAP : 0 }]}
            >
                <View style={[styles.albumCard, cardStyle]}>
                    {item.coverImage || item.image ? (
                        <Image
                            source={{ uri: item.coverImage || item.image }}
                            style={styles.albumImage}
                            contentFit="cover"
                            transition={500}
                        />
                    ) : (
                        <View style={[styles.albumImage, styles.fallbackContainer]}>
                            <Ionicons name="images-outline" size={isGrid ? 64 : 48} color={theme.colors.gray} />
                        </View>
                    )}

                    {/* Dark Overlay for Text Visibility */}
                    <View style={styles.darkOverlay} />

                    <View style={styles.textContainer}>
                        <Text style={styles.albumName} numberOfLines={1}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={styles.albumCount}>{item.photos?.length || 0} items</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    // Prepend "Create New" item to the list
    const dataWithCreateNew = [{ id: 'create-new', isCreateNew: true }, ...(albums || [])];

    // Bottom Sheet Backdrop
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    return (
        <ScreenWrapper bg='white'>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <BackButton router={router} />
                    <Text style={styles.title}>Library</Text>
                </View>
                <TouchableOpacity onPress={() => setIsGrid(!isGrid)} style={styles.layoutBtn}>
                    <Ionicons
                        name={isGrid ? "list" : "grid"}
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, paddingHorizontal: GAP }}>
                {loading && !refreshing && albums?.length === 0 ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <FlashList
                        key={isGrid ? 'grid' : 'list'} // Force re-render on layout change
                        data={dataWithCreateNew}
                        renderItem={renderAlbumItem}
                        // @ts-ignore
                        estimatedItemSize={200}
                        numColumns={columnCount}
                        contentContainerStyle={styles.listContainer}
                        keyExtractor={(item: any) => item._id || item.id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                        }
                    />
                )}
            </View>

            {/* Bottom Sheet Modal for Actions */}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={['30%']}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ borderRadius: 24 }}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={styles.sheetTitle}>Manage Album</Text>
                    {selectedAlbum && (
                        <Text style={styles.sheetSubtitle}>{selectedAlbum.name}</Text>
                    )}

                    <View style={styles.sheetActions}>
                        <TouchableOpacity style={styles.actionRow} onPress={openEditModal}>
                            <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
                                <Feather name="edit-2" size={20} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.actionText}>Edit Details</Text>
                            <Feather name="chevron-right" size={20} color="#C7C7CC" style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.actionRow} onPress={handleDeleteAlbum}>
                            <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
                                <Feather name="trash-2" size={20} color={theme.colors.rose} />
                            </View>
                            <Text style={[styles.actionText, { color: theme.colors.rose }]}>Delete Album</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>


            {/* Edit Modal (Keeping as regular modal for text input focus stability) */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Album</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newAlbumName}
                            onChangeText={setNewAlbumName}
                            placeholder="Album Name"
                            placeholderTextColor={theme.colors.textLight}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input}
                            value={newAlbumDesc}
                            onChangeText={setNewAlbumDesc}
                            placeholder="Description (Optional)"
                            placeholderTextColor={theme.colors.textLight}
                        />

                        <View style={styles.modalActions}>
                            <Pressable
                                style={[styles.btn, styles.btnCancel]}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.btnTextCancel}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.btn, styles.btnSave]}
                                onPress={handleUpdateAlbum}
                            >
                                <Text style={styles.btnTextSave}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
    )
}

export default Library

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },
    title: {
        fontSize: wp(7),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
        letterSpacing: 0.5,
        marginLeft: 10
    },
    layoutBtn: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#f0f0f0'
    },
    listContainer: {
        paddingBottom: hp(10),
        paddingTop: GAP / 2
    },
    cardContainer: {
        marginBottom: GAP,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    albumCard: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    createNewCard: {
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        elevation: 0,
        shadowOpacity: 0
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    createtext: {
        fontSize: wp(4),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.primary
    },
    albumImage: {
        width: '100%',
        height: '100%',
    },
    fallbackContainer: {
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    textContainer: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        gap: 2
    },
    albumName: {
        color: 'white',
        fontSize: wp(4.5),
        fontWeight: theme.fonts.bold,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3
    },
    albumCount: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: wp(3.2),
        fontWeight: theme.fonts.medium
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Bottom Sheet Styles
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 10
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
    },
    sheetSubtitle: {
        fontSize: 14,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 4
    },
    sheetActions: {
        gap: 8
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4
    },

    // Edit Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme.colors.text
    },
    label: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginBottom: 8,
        marginTop: 10,
        fontWeight: theme.fonts.medium
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: theme.colors.text,
        backgroundColor: '#F9FAFB'
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 30,
        gap: 12
    },
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: 90,
        alignItems: 'center'
    },
    btnCancel: {
        backgroundColor: '#F3F4F6'
    },
    btnSave: {
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    btnTextCancel: {
        color: '#4B5563',
        fontWeight: '600',
        fontSize: 15
    },
    btnTextSave: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15
    }
})
