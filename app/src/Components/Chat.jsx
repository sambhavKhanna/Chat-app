import { createContext, useState, useEffect  } from 'react'
import { Tab, Nav } from 'react-bootstrap'
import { Conversations } from './Conversations'
import { Contacts } from './Contacts'
import { useParams } from 'react-router-dom'
import { RoomContext } from '../context'
import { socket } from '../socket'
import { BASE_URL } from '../constants'

export const Chat = () => {

    const [room, setRoom] = useState()

    const [rooms, setRooms] = useState([])

    const { email } = useParams()

    useEffect(() => {

        (async () => {
            const responseRooms = await fetch(BASE_URL + '/rooms', {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({ email })
            })
            const dataRooms = await responseRooms.json()

            socket.emit('re-join rooms', dataRooms)
            
            setRooms(dataRooms)
            
        })()

        socket.on('receive', (senderEmail, senderMessage, roomId) => {

            setRooms(rooms => {
                const roomIndex = rooms.findIndex(room => room.roomId === roomId)
                let newRooms = [...rooms]
                newRooms[roomIndex].chats.push({ sender: senderEmail, message: senderMessage })
                return newRooms
            })
        })

        socket.on('add contact', (sender, newContact, roomId) => {
            if (newContact === email) {
                socket.emit('add receiver', sender, newContact, roomId)
                setRooms(rooms => {
                    let newRooms = [...rooms, { roomId, people: [sender, newContact], chats: [] }]
                    return newRooms
                })
            }
        })

        return () => socket.close()

    }, [])

    return (
    <RoomContext.Provider value={{
        room: room,
        setRoom: setRoom,
        rooms: rooms,
        setRooms: setRooms,
        socket: socket
    }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ flex: 1, height: '100vh' }}>
                    <Contacts />
            </div>
            <div style={{ flex: 3, height:'100vh' }}>
                <Conversations />
            </div>
        </div>
    </RoomContext.Provider>
    )
}