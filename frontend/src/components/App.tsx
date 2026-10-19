import './App.css'
import {useState,useEffect} from 'react'
import Toast from './Toast'
import Github from './Github'
import axios from 'axios'
export default function App(){
  const [plantData,setPlantData] = useState<null | any>(null)
  const [toast,setToast] = useState<{msg:string,ok:boolean}>({msg:"",ok:false})
  const [page,setPage] = useState(0)
  const [tab,setTab] = useState<'table'|'graph'>("table")
  function clearToast(){
    setToast({msg:"",ok:false})
  }
  async function fetchData(){
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}`)
      setPlantData(res.data.data)
      console.log(res.data)
      setToast({msg:"Data fetched successfully.",ok:true})
    }catch(e){
      setToast({msg:"An error occured.",ok:false})
    }
    clearToast()
  }
  useEffect(()=>{
    fetchData()
  },[])
  return (
    <div>
      <div className='flex justify-center items-center flex-col'>
        <h1>Plant Data Monitor</h1>
        {plantData === null && (
            <h3>Loading...</h3>
        )}
        {plantData !== null && (
          <div>
            <table>
              <thead>
                <tr>
                  <td>Time</td>
                  <td>Soil Moisture (%)</td>
                  <td>Humidity (%)</td>
                  <td>Light Intensity (lux)</td>
                  <td>Temperature (°C)</td>
                  <td>Soil Temperature (°C)</td>
                  <td>Total Dissolved Solids/TDS (ppm)</td>
                </tr>
              </thead>
              <tbody>
                {plantData.slice((page * 10),(page * 10) + 10).map((val:any,idx:any)=>(
                  <tr key={idx}>
                    <td>{new Date(val.created_at).toLocaleDateString() + ' ' + new Date(val.created_at).toLocaleTimeString()}</td>
                    <td>{val.soil_moisture}</td>
                    <td>{val.humidity}</td>
                    <td>{val.light_intensity}</td>
                    <td>{val.temperature}</td>
                    <td>{val.soil_temperature}</td>
                    <td>{val.tds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='grid grid-cols-3 p-4 gap-4'>
              <button onClick={()=>{
                setPage(p => {
                  if(p > 0){
                    return p - 1
                  } return p
                })
              }}>Prev</button>
              <h3>{page + 1}</h3>
              <button onClick={()=>{
                setPage(p => {
                  if(p < Math.floor(plantData.length / 10)){
                    return p + 1
                  } return p 
                })
              }}>Next</button>
            </div>
          </div>
        )}
      </div>
      {toast.msg.length > 0 && (
        <Toast msg={toast.msg} ok={toast.ok} />
      )}
      <Github repoURL='https://github.com/bruzz-bruzz/Plant-Monitor-IOT' profileURL='https://github.com/bruzz-bruzz' />
    </div>
  )
}