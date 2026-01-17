import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { theme } from '../constants/theme'
import ScreenWrapper from '../components/ScreenWrapper'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'
import Icon from '../assets/icons'
import { ScrollView } from 'react-native'
import Button from '../components/Button'
import { TouchableOpacity } from 'react-native'

const handelContinue = () => {

}
const handleCancel = () => {

}
const ForgotPassword = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    return (
        <ScreenWrapper>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <BackButton router={router} />
                    <Text style={styles.title}>Forgot Password</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.subHeading}>Enter your email account to reset your password</Text>
                    <Image
                        source={require('../assets/images/forgotPassword.png')}
                        contentFit="cover"
                        transition={100}
                        style={{ width: wp(50), height: hp(40) }}
                    />
                    <View style={styles.emailInput}>
                        <Input
                            icon={<Icon name={'email'} size={26} strokeWidth={1.6} />}
                            placeholder="Enter your email"
                            onChangeText={setEmail}
                            value={email}
                        />
                    </View>
                    <View style={{ flex: 1, gap: wp(1) }}>
                        <Button
                            title='continue'
                            onPress={handelContinue}
                            buttonStyle={{ width: wp(45) }}
                        />
                        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: theme.colors.text,
    },
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        gap: 25,
        height: hp(100)
    },
    heading: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: theme.colors.text,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: '300',
        textAlign: 'center',
        color: theme.colors.text,
    },
    emailInput: {
        width: wp(45)
    },
    cancelButton: {
        width: wp(45),
        padding: 10,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: wp(2),
        backgroundColor: "rgb(242, 242, 242)",
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    cancelText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: theme.fonts.semibold
    }

})
