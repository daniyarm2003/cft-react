import { serverAPI, connectWebSocket } from '../utils/server'

import { Frame } from 'stompjs'

import { useState, useEffect } from 'react'
import { CFTEvent, WSUpdate } from '../utils/types'

export const useCFTEvent = (uuid: string): [CFTEvent?, boolean?, (() => Promise<void>)?] => {
    const [cftEvent, setCFTEvent] = useState<CFTEvent>()
    const [eventErr, setEventErr] = useState(false)

    const getEvent = async() => {
        try {
            const res = await serverAPI.get(`/events/${uuid}`)
            const resData = res.data as CFTEvent

            setCFTEvent(resData)
        }
        catch(err) {
            setEventErr(true)
            setCFTEvent(undefined)

            console.error(err)
        }
    }

    useEffect(() => {
        getEvent()
    }, [])

    return [cftEvent, eventErr, getEvent]
}

export const useBooleanLocalStorageSetting = (localStorageProperty: string, defaultValue: boolean = true): [boolean, (enabled: boolean) => void] => {
    const [enabled, setEnabled] = useState(window.localStorage.getItem(localStorageProperty) === 'true')

    useEffect(() => {
        if(!window.localStorage.getItem(localStorageProperty)) {
            try {
                window.localStorage.setItem(localStorageProperty, defaultValue.toString())
                setEnabled(defaultValue)
            }
            catch(err) {
                console.error(err)
            }
        }
        
    }, [localStorageProperty, defaultValue])

    const setAndSaveEnabled = (enabled: boolean) => {
        try {
            window.localStorage.setItem(localStorageProperty, enabled.toString())
            setEnabled(enabled)
        }
        catch(err) {
            console.error(err)
        }
    }

    return [ enabled, setAndSaveEnabled ]
}

export const fromWSUpdateObj = <T>(callback: (updateObj: WSUpdate<T>) => void) => {
    return (data: string) => callback(JSON.parse(data) as WSUpdate<T>)
}

export const useStompClient = (subscriptions: Record<string, (data: string) => void>, errorCallback?: (error: Frame | string) => any) => {
    useEffect(() => {
        const stompClient = connectWebSocket(() => {
            for(const endpoint in subscriptions) {
                stompClient.subscribe(endpoint, message => {
                    if(window.localStorage.getItem('disableLiveUpdates') !== 'true')
                        subscriptions[endpoint](message.body)
                })
            }

        }, errorCallback)
    }, [])
}