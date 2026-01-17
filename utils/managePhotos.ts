import axios from "axios";
import { getToken } from "./tokenManage";
import * as MediaLibrary from 'expo-media-library';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

// delete image from the remote server
const deleteImage = async (imageId: string): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/photos/delete/${imageId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return {
            success: true,
            message: response.data.message
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
}

// delete image from the device
const deleteImageFromDevice = async (imageId: string): Promise<ApiResponse> => {
    try {
        // MediaLibrary.deleteAssetsAsync returns a boolean directly in some versions or promise of boolean
        // Checking doc or assuming standard behavior. It takes string | string[]
        const response = await MediaLibrary.deleteAssetsAsync([imageId]);
        if (response) {
            return {
                success: true,
                message: 'Image deleted successfully'
            };
        }
        return {
             success: false,
             message: 'Failed to delete image'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
}

// get all photos
const getAllPhotos = async (page: number, limit: number): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/photos/all-photo`,
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                page: page,
                limit: limit
            }
        });
        return {
            success: true,
            message: response.data.message,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
}

// get all photos by date time range
const getAllPhotosByDateTimeRange = async (startCreationDateTime: string | number, endCreationDateTime: string | number): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/photos/all-photos-by-date-range`,
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                startCreationDateTime,
                endCreationDateTime
            }
        });
        return {
            success: true,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
}

// upload a single photo
// photo should be FormData
const uploadSinglePhoto = async (photo: FormData): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            method: 'POST',
            url: `${process.env.EXPO_PUBLIC_API_URL}/photos/upload-single`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
            },
            data: photo
        });
        return {
            success: true,
            message: response.data.message
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
}

// upload multiple photos
const uploadMultiplePhotos = async (photos: FormData): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/photos/upload`,
            method: 'POST',
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': `Bearer ${accessToken}`
            },
            data: photos
        });
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message
            };
        }
         return {
            success: false,
            message: response.data.message || 'Unknown error'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    }
}

export {
    getAllPhotos,
    getAllPhotosByDateTimeRange,
    uploadSinglePhoto,
    uploadMultiplePhotos,
    deleteImage,
    deleteImageFromDevice
};
