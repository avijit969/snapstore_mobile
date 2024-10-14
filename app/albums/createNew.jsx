import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import { hp, wp } from '../../helpers/common';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import { getToken } from '../../utils/tokenManage';
import Alert from '../../components/Alert';
import axios from 'axios';

const CreateNew = () => {
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const handleAlbumCreate = async () => {
        console.log(albumName, albumDescription);
        const accessToken = await getToken()
        const response = await axios({
            method: "POST",
            url: `${process.env.EXPO_PUBLIC_API_URL}/albums/create-album`,
            data: {
                name: albumName,
                description: albumDescription
            },
            header: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`
            }
        })
        if (response.data.success) {
            setAlertMessage(response.data.message)
            setAlertVisible(true)
        }
        else {
            setAlertMessage(response.data.message)
            setAlertVisible(true)
        }
    }

    return (
        <ScreenWrapper>
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
                    <Button title='Invite People' buttonStyle={{ width: wp(25) }} icon={<Icon name={'invite'} color={'black'} />} />
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
});
