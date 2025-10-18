import { io } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const socket = io(BACKEND_URL, {
    withCredentials: true,
    transports: ['websocket'],
    autoConnect: false,
});

export default socket;