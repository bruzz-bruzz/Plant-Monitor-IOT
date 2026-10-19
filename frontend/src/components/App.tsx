import './App.css'
import {useState,useEffect} from 'react'
import axios from 'axios'
export default function App(){
  const [plantData,setPlantData] = useState<null | any>(null)
  const [toast,setToast] = useState<{msg:string,ok:boolean}>({msg:"",ok:false})
  function clearToast(){
    setToast({msg:"",ok:false})
  }
  async function fetchData(){
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}`)
      setPlantData(res.data)
      console.log(res.data)
      setToast({msg:"Data fetched successfully.",ok:true})
    }catch(e){
      setToast({msg:"An error occured.",ok:false})
    }
    clearToast()
  }
  return (
    <div>
      <div className='flex justify-center items-center flex-col'>
        <h1>Plant Data Monitor</h1>
        {plantData === null && (
            <h3>Loading...</h3>
        )}
      </div>
    </div>
  )
}