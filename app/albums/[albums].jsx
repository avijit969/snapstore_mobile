import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import ScreenWrapper from '../../components/ScreenWrapper'

const Albums = () => {
    const { albums } = useLocalSearchParams()
    return (
        <ScreenWrapper>
            <View>
                <Text>Albums {albums}</Text>
            </View>
        </ScreenWrapper>
    )
}

export default Albums

const styles = StyleSheet.create({})