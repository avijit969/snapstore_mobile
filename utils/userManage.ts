import axios from "axios"
import { getToken } from "./tokenManage"

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    statusCode?: number;
}

interface UserData {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

const signUp = async (email: string, password: string, fullName: string, username: string): Promise<UserData | null> => {
    // Note: detailed error handling seems missing in original, but it returned response.data.data
    try {
        const response = await axios({
            method: "POST",
            url: `${process.env.EXPO_PUBLIC_API_URL}/users/registerUser`,
            data: {
                email,
                password,
                fullName,
                username
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Sign up error:", error);
        throw error; // Or handle gracefully as per original usage
    }
}

const changePassword = async (oldPassword: string, newPassword: string): Promise<ApiResponse> => {
    try {
        const accessToken = await getToken()
        const response = await axios({
            method: "PATCH",
            url: `${process.env.EXPO_PUBLIC_API_URL}/users/changePassword`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            data: {
                oldPassword,
                newPassword
            }

        })
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message
            }
        }
        else {
            return {
                success: false,
                message: response.data.message
            }
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message
            }
        } else {
            return {
                success: false,
                message: error.message
            }
        }
    }

}
// update user profile

const updateProfile = async (formData: FormData): Promise<ApiResponse> => {
    console.log("test", formData)
    console.log("update profile")
    const accessToken = await getToken()
    try {
        const response = await axios({
            method: "PATCH",
            url: `${process.env.EXPO_PUBLIC_API_URL}/users/update-profile`,
            headers: {
                "Content-Type": 'multipart/form-data',
                "Authorization": `Bearer ${accessToken}`
            },
            data: formData
        })
        console.log("response", response)
        if (response.data.success) {
            console.log("updated user data", JSON.stringify(response.data.data, null, 2))
            return {
                success: true,
                message: response.data.message,
                data: response.data.data
            }
        }
        else {
            return {
                success: false,
                message: response.data.message
            }
        }

    } catch (error: any) {
        console.log(error)
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message
            }
        } else {
            return {
                success: false,
                message: error.message
            }
        }
    }
}
export {
    signUp,
    changePassword,
    updateProfile
}
