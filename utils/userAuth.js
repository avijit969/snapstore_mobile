import axios from "axios"

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
