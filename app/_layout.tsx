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
const _layout = () => {

  const persistor = persistStore(store)
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <StatusBar style='dark' />
            <MainLayout />
          </PersistGate>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const MainLayout = () => {
  const authStatus = useSelector((state: any) => state.auth.status)
  const userData = useSelector((state: any) => state.auth.userData)
  const router = useRouter()
  useEffect(() => {
    if (authStatus) {
      router.replace('/photos')
    }
    else {
      router.replace('/welcome')
    }
  }, [userData]);

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
    </Stack>
  )
}

export default _layout