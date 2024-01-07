import { useCallback, useContext } from "react"
import { RoomContext } from "../context"
import { TextField, Button, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import { useState } from "react"

export const Conversations = () => {

    const {room, setRoom, socket, rooms} = useContext(RoomContext)

    const [message, setMessage] = useState('')

    const { email } = useParams()

    const setRef = useCallback(node => {
        
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
        
    }, [])

    if (room !== undefined) {

        const myRoom = rooms.find(rm => rm.roomId === room)

        return (
            <div style={{ height: '100vh', padding: 10 }} className="d-flex flex-column flex-grow-1">
                <div className="flex-grow-1 overflow-auto">
                    <div className="d-flex flex-column align-items-start justify-content-end px-3">
                        {myRoom.chats.map((chat, index) => {
                            const lastMessage = myRoom.chats.length - 1 === index
                            return (
                                <div ref={ lastMessage ? setRef : null } className={`my-1 d-flex flex-column ${chat.sender === email ? 'align-self-end align-items' : 'align-items-start'}`}>
                                    <div className={`rounded px-2 py-1 ${chat.sender === email ? 
                                    'text-white' : 'border'}`} style={{ backgroundColor: `${chat.sender === email ? '#1976D2' : '#FFFFFF'}` }}>
                                        {chat.message}
                                    </div>
                                    <div className={`text-muted small ${chat.sender === email ? 'align-self-end' : ''}`}>
                                        {chat.sender === email ? 'You' : chat.sender}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                   
                </div>

                <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <TextField value={message} fullWidth onChange={e => { setMessage(e.target.value) }} ></TextField>
                    <Button onClick={() => {
                        if (message !== '') {
                            socket.emit('send', email, message, room)
                            setMessage('')
                        } 
                        
                        }} variant="outlined" style={{marginLeft: 5}} >send</Button>   
                </div>

            </div>
        )
    }

    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent:'center', alignItems:'center' }}>
            <Typography variant='h2'>Welcome to the Community</Typography>
        </div>
    )
}