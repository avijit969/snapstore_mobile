import React, { useEffect, useState } from 'react'
import { Stack, Tabs, useRouter, useRootNavigationState, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { store } from '../store/store'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { View, ActivityIndicator } from 'react-native'
import axios from 'axios'
import { getToken } from '../utils/tokenManage'
import { login } from '../features/auth/authSlice'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const _layout = () => {


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <StatusBar style='dark' />
          <MainLayout />
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const MainLayout = () => {
  const authStatus = useSelector((state: any) => state?.auth?.status)
  const dispatch = useDispatch()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await getToken()
        if (token) {
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/users/get-user`, {
            headers: { Authorization: `Bearer ${token}` }
          })

          if (response.data.success) {
            dispatch(login({ user: response.data.data, accessToken: token }))
          }
        }
      } catch (error) {
        console.log("Auto-login failed:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkUser()
  }, [])

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} redirect={authStatus} />
      <Stack.Screen name="login" options={{ headerShown: false }} redirect={authStatus} />
      <Stack.Screen name="signUp" options={{ headerShown: false }} redirect={authStatus} />
      <Stack.Screen name='changePassword' options={{ headerShown: false }} redirect={authStatus} />
      <Stack.Screen name='forgotPassword' options={{ headerShown: false }} redirect={authStatus} />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} redirect={!authStatus} />
      <Stack.Screen name='+not-found' options={{ title: 'Oops!' }} redirect={!authStatus} />
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name="upload" options={{ headerShown: false }} redirect={!authStatus} />
      <Stack.Screen name='profile' options={{ headerShown: false }} redirect={!authStatus} />
      <Stack.Screen name='albums/[albums]' options={{ headerShown: false }} redirect={!authStatus} />
      <Stack.Screen name='albums/createNew' options={{ headerShown: false }} redirect={!authStatus} />
      <Stack.Screen name='media/[index]' options={{ headerShown: false }} redirect={!authStatus} />
      <Stack.Screen name='backedup_images/[particularImg]' options={{ headerShown: false }} redirect={!authStatus} />
      <Stack.Screen name='backedup_images/allImages' options={{ headerShown: false }} redirect={!authStatus} />
    </Stack>
  )
}

export default _layout