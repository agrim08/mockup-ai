'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from '@/context/UserContext'
import { SettingContext } from '@/context/SettingContext'

function Provider({children}: any) {
    const [userDetail, setUserDetail] = useState<any>(null)
    const [settingDetails, setSettingDetails] = useState<any>(null)

    useEffect(() => {
        CreateNewUser()
    }, [])

    const CreateNewUser = async () => {
        const res = await axios.post('/api/user', {})
        setUserDetail(res.data)
    }

    return (
    <UserContext.Provider value={{userDetail, setUserDetail}}>
        <SettingContext.Provider value={{settingDetails, setSettingDetails}}>
            <div>{children}</div>
        </SettingContext.Provider>
    </UserContext.Provider>
  )
}

export default Provider