import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import Icon from '../assets/icons';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';
import { hp, wp } from '../helpers/common';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { setToken } from '../utils/tokenManage';

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const onSubmit = async () => {
        if (!username || !password) {
            setAlertMessage('Please fill both fields');
            setAlertVisible(true);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/login`, {
                username,
                password,
            });
            if (response.data.success) {
                // Handle successful login
                await setToken(response.data.data.accessToken);
                dispatch(login(response.data.data)); // Save user data to Redux

                // Reset input fields after login
                setUsername('');
                setPassword('');

                // Navigate to photos
                router.push('/photos' as any);
            } else {
                setAlertMessage(response.data.message);
                setAlertVisible(true);
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                // Handling known error from server response
                setAlertMessage(error.response.data.message || 'An error occurred. Please try again AVI.');
            } else {
                // General error message
                setAlertMessage('An error occurred. Please try again JIT.');
            }
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />

                {/* Welcome message */}
                <View>
                    <Text style={styles.welcomeText}>Hey,</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>

                {/* Input form */}
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(2), color: theme.colors.text }}>Please login to continue</Text>
                    <Input
                        icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                        placeholder="Enter your username"
                        onChangeText={setUsername}
                        value={username} // Keep username in sync with state
                    />
                    <Input
                        icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                        placeholder="Enter your password"
                        onChangeText={setPassword}
                        secureTextEntry
                        value={password} // Keep password in sync with state
                    />
                    <TouchableOpacity onPress={() => router.push('forgotPassword' as any)}>
                        <Text style={styles.forgotPassword}>Forgot password?</Text>
                    </TouchableOpacity>

                    {/* Login button */}
                    <Button title="Login" loading={loading} onPress={onSubmit} />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Pressable onPress={() => router.push('signUp' as any)}>
                        <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>
                            Sign Up
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Custom Alert */}
            <Alert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(2),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form: {
        gap: 25,
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2),
    },
});
