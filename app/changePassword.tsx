import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useRouter } from 'expo-router'
import Icon from '../assets/icons'
import BackButton from '../components/BackButton'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'

import { changePassword } from '../utils/userManage'

const ChangePassword = () => {
    const router = useRouter()
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const handelResetPassword = async () => {
        if (!oldPassword || !newPassword) {
            setAlertMessage('Please fill both fields');
            setAlertVisible(true);
            return;
        }

        const response = await changePassword(oldPassword, newPassword);
        if (response.success) {
            setAlertMessage(response.message);
            setAlertVisible(true);
            setNewPassword('');
            setOldPassword('');
            return;
        }
        else {
            setAlertMessage(response.message);
            setAlertVisible(true);
        }


    }
    return (
        <ScreenWrapper>
            {/* header */}
            <View style={styles.header}>
                <BackButton router={router} />
                <Text style={styles.title}>Change Password</Text>
            </View>
            <View style={styles.container}>
                <Image style={styles.changePasswordImage} resizeMode='contain' source={require('../assets/images/changePassword.png')} />
                <Input
                    icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                    placeholder="Enter your old password"
                    onChangeText={setOldPassword}
                    secureTextEntry
                    value={oldPassword}
                />
                <Input
                    icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                    placeholder="Enter your new password"
                    onChangeText={setNewPassword}
                    secureTextEntry
                    value={newPassword}
                />
                <Button title="Reset Password" onPress={() => { handelResetPassword() }} />
                <Alert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
            </View>
            {/* Custom Alert */}

        </ScreenWrapper>
    )
}


const styles = StyleSheet.create({
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
    container: {
        justifyContent: 'center',
        flex: 1,
        gap: 25,
        paddingHorizontal: wp(2),
    },
    changePasswordImage: {
        height: hp(40),
        width: wp(100),
        alignSelf: 'center'
    }
})

export default ChangePassword
