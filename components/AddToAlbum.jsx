import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'

const AddToAlbum = ({ bottomSheetModalRef }) => {
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
            />
        ),
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