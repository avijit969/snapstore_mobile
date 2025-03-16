import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setUserData } from '../features/auth/authSlice'
import Button from '../components/Button'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { theme } from '../constants/theme'
import Input from '../components/Input'
import { TouchableOpacity } from 'react-native'
import BackButton from '../components/BackButton'
import Icon from '../assets/icons'
import * as ImagePicker from 'expo-image-picker'
import { wp } from '../helpers/common'
import { updateProfile } from '../utils/userManage'
import Toaster from '../components/Toaster'
import Toast from 'react-native-toast-message'

const profile = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const userData = useSelector((state) => state.auth.userData)

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        fullName: userData?.user?.fullName || '',
        username: userData?.user?.username || '',
        email: userData?.user?.email || '',
    })
    const [avatar, setAvatar] = useState(userData?.user?.avatar)

    useEffect(() => {
        console.log(JSON.stringify(userData, null, 4)) // Debugging
    }, [])

    // Handle input changes
    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        })
    }

    // Handle avatar edit
    const handleEditAvatar = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (!permissionResult.granted) {
                alert('Permission to access media library is required!')
                return
            }
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            })

            if (!pickerResult.canceled) {
                const selectedImageUri = pickerResult.assets[0].uri
                setAvatar(selectedImageUri)
            }
        } catch (error) {
            console.error('Error editing avatar:', error)
            alert('An error occurred while updating your avatar. Please try again.')
        }
    }

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing)
    }
    const handleCancel = () => {
        setIsEditing(false)
        setFormData({
            fullName: userData?.user?.fullName || '',
            username: userData?.user?.username || '',
            email: userData?.user?.email || '',
        })
        setAvatar(userData?.user?.avatar)
    }

    // Save profile changes
    const handleSaveProfile = async () => {
        console.log(formData, avatar)
        const form = new FormData()
        form.append('fullName', formData.fullName)
        form.append('username', formData.username)
        form.append('email', formData.email)
        form.append('avatar', {
            uri: avatar,
            name: 'avatar.jpg',
            type: 'image/jpeg',
        })

        const response = await updateProfile(form)
        if (response.success) {
            Toaster({
                type: 'success',
                message: response.message,
                position: 'top'
            })
            dispatch(setUserData(response.data))
        }
        else {
            Toaster({
                type: 'error',
                message: response.message,
                position: 'top'
            })
        }

        setIsEditing(false)
    }

    return (
        <ScreenWrapper>
            {/* Header */}
            <View style={styles.header}>
                <BackButton router={router} style={styles.button} />
                <Text style={styles.title}>Profile</Text>
            </View>

            <View style={styles.container}>
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: avatar?.replace('http', 'https') }}
                        contentFit="cover"
                        transition={100}
                    />
                    {isEditing && <TouchableOpacity style={styles.editIcon} onPress={isEditing ? handleEditAvatar : null}>
                        <Icon name="edit" size={20} />
                    </TouchableOpacity>}
                </View>

                {/* User Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailsContainerItem}>
                        <Text style={styles.detailsContainerItemText}>Full Name</Text>
                        <Input
                            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                            value={formData.fullName}
                            editable={isEditing}
                            onChangeText={(value) => handleChange('fullName', value)}
                            style={{
                                color: theme.colors.text,
                            }}
                        />
                    </View>

                    <View style={styles.detailsContainerItem}>
                        <Text style={styles.detailsContainerItemText}>Username</Text>
                        <Input
                            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                            value={formData.username}
                            editable={isEditing}
                            onChangeText={(value) => handleChange('username', value)}
                            style={{
                                color: theme.colors.text,
                            }}
                        />
                    </View>

                    <View style={styles.detailsContainerItem}>
                        <Text style={styles.detailsContainerItemText}>Email</Text>
                        <Input
                            icon={<Icon name="email" size={26} strokeWidth={1.6} />}
                            value={formData.email}
                            editable={isEditing}
                            onChangeText={(value) => handleChange('email', value)}
                            style={{
                                color: theme.colors.text,
                            }}
                        />
                    </View>

                    <TouchableOpacity onPress={() => router.push('/changePassword')}>
                        <Text style={styles.changePassword}>Change Password</Text>
                    </TouchableOpacity>

                    {/* Toggle between Edit and Save buttons */}
                    {isEditing ? (
                        <View style={styles.savaCancelButtonContainer}>
                            <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => {
                        router.dismissAll()
                        dispatch(logout())
                    }} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast />
        </ScreenWrapper>
    )
}

export default profile

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 10,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        height: 100,
        width: 100,
        alignSelf: 'center',
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 50,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },

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

    detailsContainer: {
        gap: 15,
    },
    detailsContainerItem: {
        flexDirection: 'column',
        gap: 5,
    },
    detailsContainerItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    changePassword: {
        color: theme.colors.textDark,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right',
    },
    editButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: wp(2),
        borderWidth: 1,
        borderColor: theme.colors.primary,
        backgroundColor: "rgb(242, 242, 242)",
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    editText: {
        color: theme.colors.text,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: theme.fonts.semibold
    },
    savaCancelButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    saveButton: {
        width: wp(20),
        marginTop: 20,
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
    saveText: {
        color: 'green',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: theme.fonts.semibold
    },
    cancelButton: {
        width: wp(20),
        marginTop: 20,
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
    },
    logoutButton: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: "rgb(242, 242, 242)",
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    logoutText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
