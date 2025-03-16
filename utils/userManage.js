import axios from "axios"
import { getToken } from "./tokenManage"

const signUp = async (email, password, fullName, username) => {
    const response = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}users/registerUser`,
        data: {
            email,
            password,
            fullName,
            username
        }
    })

    return response.data.data
}

const changePassword = async (oldPassword, newPassword) => {
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

    } catch (error) {
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

const updateProfile = async (formData) => {
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

    } catch (error) {
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
    changePassword,
    updateProfile
}