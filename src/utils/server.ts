import axios from 'axios'
import { PORT } from './consts'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const serverURL = process.env.NODE_ENV === 'development' ? `http://${window.location.hostname}:${PORT}/api` : `https://${window.location.hostname}/api`

export const serverAPI = axios.create({
    baseURL: serverURL
})

export const connectWebSocket = (connectCallback: (frame?: Stomp.Frame) => any, errorCallback?: (error: Stomp.Frame | string) => any) => {
    const sockjsClient = SockJS(`${serverURL}/ws/sockjs-endpoint`)
    const stompClient = Stomp.over(sockjsClient)

    stompClient.connect({}, connectCallback, errorCallback)

    return stompClient
}