import { Button } from "react-bootstrap"
import { Dropdown } from "./Dropdown"
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { RoomContext, NewContactContext } from "../context"
import { useContext } from "react"
import { BASE_URL } from "../constants"

export const Contacts = () => {

    const {room, rooms, setRoom, setRooms, socket} = useContext(RoomContext)

    const { email } = useParams()

    const [newContact, setNewContact] = useState('')

    const [newContactList, setNewContactList] = useState([])

    const addNewContact = () => {

       let roomExists = rooms.find(r => r.people.includes(newContact))

        if (newContact !== '' && roomExists === undefined) {

            const roomId = uuidv4()
            
            setRooms(rooms => {
                let newRooms = [...rooms, { roomId, people: [email, newContact], chats: [] }]
                return newRooms
            })

            setNewContactList(newContactList => {
                let contactList = newContactList.filter(contact => contact !== newContact)
                return contactList
            })

            setNewContact('')

            socket.emit('add', email, newContact, roomId)
            
        }
    }

    const Contact = ({ roomId, people, index }) => {

        const personEmail = people.find(person => person !== email)

        return (
        <div style={{ display:'flex', justifyContent: 'center', alignItems:'center',
        borderBottom: '1px solid #bcbcbc', height: 56, 
        backgroundColor: `${ roomId === room ? '#1976D2' : '#FFFFFF'}`, 
        color: `${ roomId === room ? '#FFFFFF' : '#000'}`,
        borderTop: `${ index === 0 ? '1px solid #bcbcbc' : '#000'}` }}
        onClick={() => { setRoom(roomId) }} >
            {personEmail}
        </div>
        )
    }

    useEffect(() => {

        (async () => {

            const responseNewContacts = await fetch(BASE_URL + `/newContacts?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-type' : 'application/json'
                }
            })
            const dataNewContacts = await responseNewContacts.json()

            setNewContactList(dataNewContacts)
            
        })()

    }, [])

    return (
        <div style={{ height: '100vh', borderRight: '1px solid #bcbcbc' }} className='d-flex flex-column flex-grow-1'>
            <h1 style={{ textAlign:'center' }}>Contacts</h1>
            <div>
                <NewContactContext.Provider value={{ newContactList, setNewContact }}>
                    <div style={{ margin: 5 }}>
                        <Dropdown label='' />
                    </div>
                </NewContactContext.Provider>
                <div className="container">
                    <div className="row">
                        <Button className="rounded-0" onClick={addNewContact} style={{ height: 56, backgroundColor:'#1976D2' }} >
                            Add New Contact
                        </Button>
                    </div>
                </div>
            </div>
            <div className='flex-grow-1 overflow-auto'>
                {rooms.map((room, index) => <Contact roomId={room.roomId} people={room.people} index={index} />)}
            </div>


        </div>
    )
}

