import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Typography } from "@mui/material"

export const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const join = async () => {
        const res = await fetch('http://localhost:3000/user', {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        })

        const data = await res.json()

        if (data.signup) {
            localStorage.setItem('token', data.password)
            navigate('/chat/' + email)
        } 
        else alert(data.message)
    }

    const login = async () => {
        const res = await fetch(`http://localhost:3000/user?email=${email}&password=${password}`, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json'
            }
        })

        const data = await res.json()

        if (data.login) {
            localStorage.setItem('token', data.password)
            navigate('/chat/' + email)
        }
        else alert(data.message)
    }    

    return (
        <div>
            <div style={{display:'flex', justifyContent: 'center', padding:50}}>
                <Typography variant='h2'>Join the community</Typography>
            </div> 
            <div style={{display:'flex', justifyContent: 'center', paddingTop:50}}>
                <TextField onChange={e => { setEmail(e.target.value) }} id="fullWidth" label="Email" variant="outlined" style={{width:400}}/>
            </div>
            <div style={{display:'flex', justifyContent: 'center', paddingTop:20}}>
                <TextField onChange={e => { setPassword(e.target.value) }} id="fullWidth" label="Password" type="password" variant="outlined" style={{width:400}}/>
            </div>
            <div style={{display:'flex', justifyContent: 'center', paddingTop:40}}>
                <Button onClick={join} variant="contained" style={{width:75, marginRight:20}}>Join</Button>
                <Button onClick={login} variant="outlined">Login</Button>
            </div>
        </div>

    )
}