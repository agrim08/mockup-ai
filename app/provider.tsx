'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from '@/context/UserContext'
import { SettingContext } from '@/context/SettingContext'
import { RefreshDataContext } from '@/context/RefreshDataContext'

function Provider({children}: any) {
    const [userDetail, setUserDetail] = useState<any>(null)
    const [settingDetails, setSettingDetails] = useState<any>(null)
    const [refreshData, setRefreshData] = useState<any>(null)

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
            <RefreshDataContext.Provider value={{refreshData, setRefreshData}}>
            <div>{children}</div>
            </RefreshDataContext.Provider>
        </SettingContext.Provider>
    </UserContext.Provider>
  )
}

export default Provider