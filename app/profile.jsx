import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import Button from '../components/Button'
const profile = () => {
    const dispatch = useDispatch()
    return (
        <ScreenWrapper>
            <Text>This is Profile</Text>
            <Button title='Logout' onPress={() => dispatch(logout())} />

        </ScreenWrapper>
    )
}

export default profile

const styles = StyleSheet.create({})