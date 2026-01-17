import AsyncStorage from "@react-native-async-storage/async-storage";

export const setToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('accessToken', token);
    }
    catch (error) {
        console.log('something went wrong while setting token', error);
    }
}

export const getToken = async (): Promise<string | null> => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        return accessToken;
    } catch (error) {
        console.log('something went wrong while getting token', error);
        return null;
    }
}
