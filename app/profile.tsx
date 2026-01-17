import { Pressable, StyleSheet, Text, View, Switch, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setUserData } from '../features/auth/authSlice'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import Input from '../components/Input'
import { TouchableOpacity } from 'react-native'
import BackButton from '../components/BackButton'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { wp, hp } from '../helpers/common'
import { updateProfile } from '../utils/userManage'
import Toaster from '../components/Toaster'
import { RootState } from '@/store/store'
import { useTheme } from '../contexts/ThemeContext'

const Profile = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { theme, isDark, setTheme, colors } = useTheme()
    const userData = useSelector((state: RootState) => state.auth.userData) as any;

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        fullName: userData?.user?.fullName || '',
        username: userData?.user?.username || '',
        email: userData?.user?.email || '',
    })
    const [avatar, setAvatar] = useState(userData?.user?.avatar)

    // Handle input changes
    const handleChange = (field: string, value: string) => {
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
                Alert.alert('Permission Required', 'Permission to access media library is required!')
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
            Alert.alert('Error', 'An error occurred while updating your avatar.')
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
        const form = new FormData()
        form.append('fullName', formData.fullName)
        form.append('username', formData.username)
        form.append('email', formData.email)
        form.append('avatar', {
            uri: avatar,
            name: 'avatar.jpg',
            type: 'image/jpeg',
        } as any)

        const response = await updateProfile(form)
        if (response.success) {
            Toaster({
                type: 'success',
                message: response.message,
                position: 'top',
                heading: 'Success!'
            })
            dispatch(setUserData(response.data))
        } else {
            Toaster({
                type: 'error',
                message: response.message,
                position: 'top',
                heading: 'Error!'
            })
        }

        setIsEditing(false)
    }

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        router.dismissAll()
                        dispatch(logout())
                    }
                }
            ]
        );
    }

    return (
        <ScreenWrapper bg={colors.background}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <BackButton router={router} />
                    <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
                </View>
                {!isEditing && (
                    <TouchableOpacity onPress={toggleEditMode} style={[styles.iconButton, { backgroundColor: colors.surface }]}>
                        <Feather name="edit-2" size={20} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
                            <Image
                                style={styles.image}
                                source={{ uri: avatar?.replace('http', 'https') }}
                                contentFit="cover"
                                transition={200}
                            />
                            {isEditing && (
                                <TouchableOpacity
                                    style={[styles.editIcon, { backgroundColor: colors.primary }]}
                                    onPress={handleEditAvatar}
                                >
                                    <Feather name="camera" size={18} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {!isEditing && (
                            <Text style={[styles.userName, { color: colors.text }]}>{formData.fullName}</Text>
                        )}
                    </View>

                    {/* User Details */}
                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <View style={styles.detailsContainerItem}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                            <Input
                                icon={<Feather name="user" size={20} color={colors.textSecondary} />}
                                value={formData.fullName}
                                editable={isEditing}
                                onChangeText={(value) => handleChange('fullName', value)}
                                style={{
                                    color: colors.text,
                                    backgroundColor: isDark ? colors.card : '#F9FAFB',
                                    borderColor: colors.border,
                                }}
                            />
                        </View>

                        <View style={styles.detailsContainerItem}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Username</Text>
                            <Input
                                icon={<Feather name="at-sign" size={20} color={colors.textSecondary} />}
                                value={formData.username}
                                editable={isEditing}
                                onChangeText={(value) => handleChange('username', value)}
                                style={{
                                    color: colors.text,
                                    backgroundColor: isDark ? colors.card : '#F9FAFB',
                                    borderColor: colors.border,
                                }}
                            />
                        </View>

                        <View style={styles.detailsContainerItem}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                            <Input
                                icon={<Feather name="mail" size={20} color={colors.textSecondary} />}
                                value={formData.email}
                                editable={isEditing}
                                onChangeText={(value) => handleChange('email', value)}
                                style={{
                                    color: colors.text,
                                    backgroundColor: isDark ? colors.card : '#F9FAFB',
                                    borderColor: colors.border,
                                }}
                            />
                        </View>
                    </View>

                    {/* Settings Card */}
                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>

                        <TouchableOpacity
                            style={[styles.settingRow, { borderBottomColor: colors.border }]}
                            onPress={() => setTheme(isDark ? 'light' : 'dark')}
                        >
                            <View style={styles.settingLeft}>
                                <Feather name={isDark ? "moon" : "sun"} size={22} color={colors.text} />
                                <Text style={[styles.settingText, { color: colors.text }]}>
                                    {isDark ? 'Dark Mode' : 'Light Mode'}
                                </Text>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor="white"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={() => router.push('/changePassword' as any)}
                        >
                            <View style={styles.settingLeft}>
                                <Feather name="lock" size={22} color={colors.text} />
                                <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    {isEditing ? (
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={handleCancel}
                                style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                            >
                                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveProfile}
                                style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
                            >
                                <Text style={[styles.buttonText, { color: 'white' }]}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handleLogout}
                            style={[styles.button, styles.logoutButton, { borderColor: colors.error }]}
                        >
                            <Feather name="log-out" size={18} color={colors.error} />
                            <Text style={[styles.buttonText, { color: colors.error }]}>Logout</Text>
                        </TouchableOpacity>
                    )}

                    <View style={{ height: hp(5) }} />
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default Profile

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: wp(4),
        gap: 20,
    },
    avatarSection: {
        alignItems: 'center',
        gap: 12,
        paddingVertical: hp(2),
    },
    avatarContainer: {
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 4,
        position: 'relative',
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 60,
    },
    editIcon: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
    },
    card: {
        borderRadius: 16,
        padding: 16,
        gap: 16,
    },
    detailsContainerItem: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1.5,
    },
    saveButton: {
        flex: 2,
    },
    logoutButton: {
        borderWidth: 1.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
