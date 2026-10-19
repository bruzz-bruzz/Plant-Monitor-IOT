import './App.css'
import {useState,useEffect} from 'react'
import axios from 'axios'
export default function App(){
  const [plantData,setPlantData] = useState<null | any>(null)
  const [toast,setToast] = useState<{msg:string,ok:boolean}>({msg:"",ok:false})
  async function fetchData(){
    try {
      const res = await axios.get("")
    }catch(e){

    }
  }
  return (
    <div>
      <div className='flex justify-center items-center flex-col'>

      </div>
    </div>
  )
}