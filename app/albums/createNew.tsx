import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import { hp, wp } from '../../helpers/common';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import { createNewAlbum } from '../../utils/manageAlbums'
import { useDispatch } from 'react-redux';
import { addNewAlbum } from '../../features/album/albumSlice';
import BackButton from '../../components/BackButton';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

const CreateNew = () => {
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const { colors, isDark } = useTheme();

    const dispatch = useDispatch();
    const router = useRouter();

    const handleAlbumCreate = async () => {
        if (!albumName.trim()) {
            Alert.alert('Required', 'Please add a title for your album');
            return;
        }

        setLoading(true);
        // call new album create method
        const response = await createNewAlbum(albumName, albumDescription);

        if (response.success) {
            dispatch(addNewAlbum(response.data));
            setAlbumName('');
            setAlbumDescription('');
            Alert.alert('Success', 'Album created successfully', [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]);
        }
        else {
            Alert.alert('Error', response.message || 'Something went wrong');
        }
        setLoading(false);
    }

    return (
        <ScreenWrapper bg={colors.background}>
            <View style={styles.header}>
                <BackButton router={router} />
                <Text style={[styles.title, { color: colors.text }]}>New Album</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Album Title</Text>
                            <Input
                                placeholder='e.g., Summer Vacation 2024'
                                placeholderTextColor={colors.textSecondary}
                                containerStyles={[styles.inputContainer, { borderColor: colors.border, backgroundColor: isDark ? colors.card : '#FAFAFA' }]}
                                onChangeText={setAlbumName}
                                value={albumName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Description <Text style={[styles.optional, { color: colors.textSecondary }]}>(Optional)</Text></Text>
                            <Input
                                multiline={true}
                                numberOfLines={4}
                                placeholder="What's this album about?"
                                placeholderTextColor={colors.textSecondary}
                                containerStyles={[styles.inputContainer, styles.textArea, { borderColor: colors.border, backgroundColor: isDark ? colors.card : '#FAFAFA' }] as any}
                                onChangeText={setAlbumDescription}
                                value={albumDescription}
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title='Create Album'
                            onPress={handleAlbumCreate}
                            loading={loading}
                            buttonStyle={[styles.createBtn, { backgroundColor: colors.primary }]}
                            textStyle={styles.createBtnText}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default CreateNew;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
        marginBottom: hp(2)
    },
    title: {
        fontSize: wp(5),
        fontWeight: theme.fonts.bold
    },
    container: {
        flex: 1,
        paddingHorizontal: wp(6),
    },
    form: {
        gap: hp(3),
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: wp(3.5),
        fontWeight: theme.fonts.medium
    },
    optional: {
        fontSize: wp(3),
        fontWeight: 'normal'
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: theme.radius.md,
        paddingHorizontal: 15,
        height: hp(6.5)
    },
    textArea: {
        height: hp(15),
        paddingVertical: 12,
        alignItems: 'flex-start'
    },
    footer: {
        marginTop: hp(5),
    },
    createBtn: {
        borderRadius: theme.radius.xl,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    createBtnText: {
        fontWeight: theme.fonts.bold,
        fontSize: wp(4)
    }
});
