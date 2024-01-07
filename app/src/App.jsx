import { Login } from "./Components/Login"
import { Chat } from "./Components/Chat"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat/:email" element={<Chat />} />
      </Routes>
    </Router>
  )
}

export default App
