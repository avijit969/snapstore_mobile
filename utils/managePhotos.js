import axios from "axios";
import { getToken } from "./tokenManage"
import * as MediaLibrary from 'expo-media-library';

// delete image from the remote server
export const deleteImage = async (imageId) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/photos/delete/${imageId}`,
            'method': 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
        })

        return {
            success: true,
            message: response.data.message
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// delete image from the device
const deleteImageFromDevice = async (imageId) => {
    try {
        const response = await MediaLibrary.deleteAssetsAsync([imageId]);
        if (response) {
            return {
                success: true,
                message: 'Image deleted successfully'
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// get all photos
const getAllPhotos = async () => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/photos/all-photo`,
            'method': 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
        })
        return {
            success: true,
            message: response.data.message,
            data: response.data.data
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// get all photos by date time range
const getAllPhotosByDateTimeRange = async (startCreationDateTime, endCreationDateTime) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/photos/all-photos-by-date-range`,
            'method': 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                startCreationDateTime,
                endCreationDateTime
            }
        })
        return {
            success: true,
            message: response.data.message,
            data: response.data.data
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// upload a single photo
const uploadSinglePhoto = async (photo) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/photos/upload-single`,
            'method': 'POST',
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': `Bearer ${accessToken}`
            },
            data: photo
        })
        return {
            success: true,
            message: response.data.message
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// upload multiple photos
const uploadMultiplePhotos = async (photos) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/photos/upload`,
            'method': 'POST',
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': `Bearer ${accessToken}`
            },
            data: photos
        })
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export {
    getAllPhotos,
    getAllPhotosByDateTimeRange,
    uploadSinglePhoto,
    uploadMultiplePhotos,
    deleteImage,
    deleteImageFromDevice
}