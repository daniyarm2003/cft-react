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