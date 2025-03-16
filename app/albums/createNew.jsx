import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import { hp, wp } from '../../helpers/common';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import Alert from '../../components/Alert';
import { createNewAlbum } from '../../utils/manageAlbums'
import { useDispatch } from 'react-redux';
import { addAlbums, addNewAlbum } from '../../features/album/albumSlice';
import BackButton from '../../components/BackButton';
import { useRouter } from 'expo-router';
const CreateNew = () => {
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();
    const handleAlbumCreate = async () => {
        if (!albumName || !albumDescription) {
            setAlertMessage('Please fill both fields');
            setAlertVisible(true);
            return;
        }

        // call new album create method
        const response = await createNewAlbum(albumName, albumDescription);

        if (response.success) {
            setAlertMessage(response.message);
            setAlertVisible(true);
            console.log(response.data);
            dispatch(addNewAlbum(response.data));
            setAlbumDescription('');
            setAlbumName('');
        }
        else {
            setAlertMessage(response.message);
            setAlertVisible(true);
        }
    }

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <BackButton router={router} />
                <Text style={styles.title}>Create New Album</Text>
            </View>
            <View style={styles.container}>
                <Input
                    placeholder='Add a title for the album'
                    inputStyles={{ fontSize: hp(3) }}
                    onChangeText={setAlbumName}
                    value={albumName}
                />
                <Input
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Add a description"
                    containerStyles={{ height: hp(20), alignItems: "flex-start" }}
                    onChangeText={setAlbumDescription}
                    value={albumDescription}
                />
                <View style={{ flexDirection: 'row', gap: wp(1) }}>
                    <Button title='Share' buttonStyle={styles.buttonStyle} icon={<Icon name={'share'} />} />
                    <Button title='Invite' buttonStyle={{ width: wp(25) }} icon={<Icon name={'invite'} color={'black'} />} />
                </View>
                <Button title='Create Album' onPress={handleAlbumCreate} />
            </View>
            <Alert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />

        </ScreenWrapper>
    );
};

export default CreateNew;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: hp(5),
        marginTop: hp(5),
        paddingHorizontal: wp(2),
    },
    buttonStyle: {
        backgroundColor: '#82e0aa',
        width: wp(18),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: wp(3)
    },
    title: {
        fontSize: wp(3.5),
        fontWeight: theme.fonts.semibold,
        textAlign: 'center',
        color: theme.colors.text
    },
});
