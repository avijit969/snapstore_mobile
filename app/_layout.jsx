import React, { useEffect } from 'react'
import { Stack, Tabs, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { store } from '../store/store'
import { Provider } from 'react-redux'
import { useSelector } from 'react-redux'
import { login, logout, setUserData } from '../features/auth/authSlice'
import persistStore from 'redux-persist/es/persistStore'
import { PersistGate } from 'redux-persist/integration/react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message'
const _layout = () => {

  const persistor = persistStore(store)
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <StatusBar style='dark' />
            <MainLayout />
            <Toast />
          </PersistGate>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const MainLayout = () => {
  const authStatus = useSelector((state) => state.auth.status)
  const router = useRouter()
  useEffect(() => {
    if (authStatus) {
      router.replace('/photos')
    }
    else {
      router.replace('/welcome')
    }
  }, [authStatus]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name='+not-found' options={{ title: 'Oops!' }} />
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signUp" options={{ headerShown: false }} />
      <Stack.Screen name="upload" options={{ headerShown: false }} />
      <Stack.Screen name='profile' options={{ headerShown: false }} />
      <Stack.Screen name='albums/[albums]' options={{ headerShown: false }} />
      <Stack.Screen name='albums/createNew' options={{ headerShown: false }} />
      <Stack.Screen name='media/[index]' options={{ headerShown: false }} />
      <Stack.Screen name='backedup_images/[particularImg]' options={{ headerShown: false }} />
      <Stack.Screen name='backedup_images/allImages' options={{ headerShown: false }} />
      <Stack.Screen name='changePassword' options={{ headerShown: false }} />
      <Stack.Screen name='forgotPassword' options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout