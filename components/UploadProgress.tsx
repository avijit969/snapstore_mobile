import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { theme } from '../constants/theme';
import { wp } from '../helpers/common';

interface Item {
    isBackedUp?: boolean;
    uploadProgress?: boolean;
    [key: string]: any;
}

interface UploadIconProps {
    item: Item;
}

const UploadIcon = ({ item }: UploadIconProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (!item.isBackedUp && item.uploadProgress) {
            const fadeInOut = Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );

            fadeInOut.start();
            return () => fadeInOut.stop();
        } else {

            fadeAnim.setValue(0);
        }
    }, [item.isBackedUp, item.uploadProgress, fadeAnim]);

    return (
        !item.isBackedUp && item.uploadProgress ? (
            <View style={{ position: 'absolute', bottom: 5, right: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <MaterialIcons name="cloud-upload" size={wp(3.5)} color={theme.colors.primary} />
                </Animated.View>
            </View>
        ) : null
    );
};

export default UploadIcon;
