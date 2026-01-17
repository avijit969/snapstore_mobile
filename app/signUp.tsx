import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import Icon from '../assets/icons';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';
import { hp, wp } from '../helpers/common';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

export default function SignUp() {
    const router = useRouter();
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const onSubmit = async () => {
        if (!email || !password || !name || !username) {
            setAlertMessage('Please fill all fields');
            setAlertVisible(true);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/registerUser`, {
                email,
                password,
                fullName: name,
                username
            });

            if (response.data.success) {
                // Navigate to login page after successful signup
                router.push('/login' as any);
            } else {
                // Show server-side error message
                setAlertMessage(response.data.message);
                setAlertVisible(true);
            }
        } catch (error: any) {
            // Handle network or server errors
            if (error.response && error.response.data) {
                setAlertMessage(error.response.data.message || 'An error occurred. Please try again.');
            } else {
                setAlertMessage('An error occurred. Please try again.');
            }
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg={colors.background}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <BackButton router={router} />

                    {/* Welcome message */}
                    <View>
                        <Text style={[styles.welcomeText, { color: colors.text }]}>let's</Text>
                        <Text style={[styles.welcomeText, { color: colors.text }]}>Get Started</Text>
                    </View>

                    {/* Input form */}
                    <View style={styles.form}>
                        <Text style={{ fontSize: hp(2), color: colors.text }}>
                            Please fill the details to create an account
                        </Text>
                        <Input
                            icon={<Icon name={'user'} size={26} strokeWidth={1.6} color={colors.text} />}
                            placeholder="Enter your name"
                            onChangeText={setName}
                            value={name}
                        />
                        <Input
                            icon={<Icon name={'user'} size={26} strokeWidth={1.6} color={colors.text} />}
                            placeholder="Enter your username"
                            onChangeText={setUsername}
                            value={username}
                        />
                        <Input
                            icon={<Icon name={'email'} size={26} strokeWidth={1.6} color={colors.text} />}
                            placeholder="Enter your email"
                            onChangeText={setEmail}
                            value={email}
                        />
                        <Input
                            icon={<Icon name={'lock'} size={26} strokeWidth={1.6} color={colors.text} />}
                            placeholder="Enter your password"
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry
                        />

                        {/* Sign Up button */}
                        <Button title="Sign Up" loading={loading} onPress={onSubmit} />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.text }]}>Already have an account?</Text>
                        <Pressable onPress={() => router.push('login' as any)}>
                            <Text
                                style={[
                                    styles.footerText,
                                    { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold } as any,
                                ]}
                            >
                                Log In
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Custom Alert */}
                <Alert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
            </ScrollView>
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
    },
    form: {
        gap: 25,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        fontSize: hp(2),
    },
});
