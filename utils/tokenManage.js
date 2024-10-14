import AsyncStorage from "@react-native-async-storage/async-storage";

const setToken = async (token) => {
    try {
        await AsyncStorage.setItem('accessToken', token);
    }
    catch (error) {
        console.log('something went wrong while setting token', error);
    }
}

const getToken = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        return accessToken;
    } catch (error) {
        console.log('something went wrong while getting token', error);
        return null;
    }
}

export { setToken, getToken };