import axios from "axios";
import { getToken } from "./tokenManage"

// create new album
const createNemAlbum = async (albumName, albumDescription) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/albums/create-album`,
            'method': 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                name: albumName,
                description: albumDescription
            }
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

// delete album from the server
export const deleteAlbum = async (albumId) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/albums/album/${albumId}`,
            'method': 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
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

// edit album details like name and description
export const editAlbumDetails = async (albumId, albumName, albumDescription) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/albums/edit-album/${albumId}`,
            'method': 'PATCH',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                name: albumName,
                description: albumDescription
            }
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

// add image to album
export const addImageToAlbum = async (albumId, imageIdArray) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/albums/add-photo-to-album/${albumId}`,
            'method': 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                photoIdArray: imageIdArray
            }
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

// get all albums
const getAlbums = async () => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/albums/album`,
            'method': 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
        })
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message,
                data: response.data.data
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// get all images from album
const getImagesFromAlbum = async (albumId) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/albums/album/${albumId}`,
            'method': 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            }
        })
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message,
                data: response.data.data
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

// add album cover image 
export const addAlbumCoverImage = async (albumId, imageId) => {
    const accessToken = await getToken();
    try {
        const response = await axios({
            'url': `${process.env.EXPO_PUBLIC_API_URL}/albums/add-album-cover-image/${albumId}`,
            'method': 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                imageId
            }
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
    createNemAlbum,
    deleteAlbum,
    editAlbumDetails,
    addImageToAlbum,
    getAlbums,
    getImagesFromAlbum
}