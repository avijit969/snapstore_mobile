import axios from "axios";
import { getToken } from "./tokenManage";

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

// create new album
const createNewAlbum = async (albumName: string, albumDescription: string): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/albums/create-album`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                name: albumName,
                description: albumDescription
            }
        });
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message,
                data: response.data.data
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

// delete album from the server
const deleteAlbum = async (albumId: string): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/albums/album/${albumId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
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

// edit album details like name and description
const editAlbumDetails = async (albumId: string, albumName: string, albumDescription: string): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/albums/edit-album/${albumId}`,
            method: 'PATCH',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                name: albumName,
                description: albumDescription
            }
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

// add image to album
const addImageToAlbum = async (albumId: string, imageIdArray: string[]): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/albums/add-photo-to-album/${albumId}`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                photoIdArray: imageIdArray
            }
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

// get all albums
const getAlbums = async (): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/albums/album`,
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message,
                data: response.data.data
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

// get all images from album
const getImagesFromAlbum = async (albumId: string): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/albums/all-photos/${albumId}`,
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message,
                data: response.data.data
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

// add album cover image 
const addAlbumCoverImage = async (albumId: string, imageId: string): Promise<ApiResponse> => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            url: `${process.env.EXPO_PUBLIC_API_URL}/albums/add-album-cover-image/${albumId}`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                imageId
            }
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
    createNewAlbum,
    deleteAlbum,
    editAlbumDetails,
    addImageToAlbum,
    getAlbums,
    getImagesFromAlbum,
    addAlbumCoverImage
}
