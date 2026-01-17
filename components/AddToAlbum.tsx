import { StyleSheet, View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'

interface AddToAlbumProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

const AddToAlbum = ({ bottomSheetModalRef }: AddToAlbumProps) => {
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
            />
        ),
        []
    )
    return (
        <View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}

            >
                <BottomSheetView style={styles.contentContainer}>
                    <View>

                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    )
}

export default AddToAlbum

const styles = StyleSheet.create({
    contentContainer: {

    }
})
