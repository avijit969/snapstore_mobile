import React from 'react'
import { Redirect } from 'expo-router'
import { useSelector } from 'react-redux'

const index = () => {
    const authStatus = useSelector((state: any) => state?.auth?.status)

    if (authStatus) {
        return <Redirect href={"/photos" as any} />
    } else {
        return <Redirect href={"/welcome" as any} />
    }
}

export default index