import { createContext } from "react"
import socketConnect from 'socket.io-client'

const socketContext = createContext(
    { 
      socket: socketConnect('http://localhost:3001/'),
      deleteSocket: socket => {
        socket = {}
      }
    }
)

export default socketContext