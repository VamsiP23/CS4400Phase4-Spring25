import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'
import ViewSwitcher from './ViewSwitcher';

function App() {
  const [count, setCount] = useState(0)
  const [array, setArray] = useState([])

  const fetchAPI = async() => {
    const response = await axios.get("http://127.0.0.1:8080/api/locations");
    console.log(response.data);
  }

  useEffect(() =>{
    fetchAPI()
  }, [])

  return (
    <>
    <div className="App">
      <ViewSwitcher />
    </div>
    </>
  )
}

export default App
