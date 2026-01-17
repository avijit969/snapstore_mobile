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

const CreateNew = () => {
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [loading, setLoading] = useState(false);

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
        <ScreenWrapper bg='white'>
            <View style={styles.header}>
                <BackButton router={router} />
                <Text style={styles.title}>New Album</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Album Title</Text>
                            <Input
                                placeholder='e.g., Summer Vacation 2024'
                                placeholderTextColor={theme.colors.textLight}
                                containerStyles={styles.inputContainer}
                                onChangeText={setAlbumName}
                                value={albumName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description <Text style={styles.optional}>(Optional)</Text></Text>
                            <Input
                                multiline={true}
                                numberOfLines={4}
                                placeholder="What's this album about?"
                                placeholderTextColor={theme.colors.textLight}
                                containerStyles={[styles.inputContainer, styles.textArea] as any}
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
                            buttonStyle={styles.createBtn}
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
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
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
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
    },
    optional: {
        color: theme.colors.textLight,
        fontSize: wp(3),
        fontWeight: 'normal'
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: theme.colors.darkLight,
        borderRadius: theme.radius.md,
        paddingHorizontal: 15,
        height: hp(6.5),
        backgroundColor: '#FAFAFA'
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
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.xl,
        shadowColor: theme.colors.primary,
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
