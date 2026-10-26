import './App.css'
import {useState,useEffect,useCallback} from 'react'
import {Link} from 'react-router-dom'
import Toast from './Toast'
import Github from './Github'
import axios from 'axios'
import TypedLineGraph from './Chart'
import MetricCard from './MetricCard'
import type { MetricKey } from '../constants/metrics'
export default function App(){
  const [plantData,setPlantData] = useState<null | any>(null)
  const [toast,setToast] = useState<{msg:string,ok:boolean}>({msg:"",ok:false})
  const [page,setPage] = useState(0)
  const [tab,setTab] = useState<'table'|'graph'|'overview'>("table")
  const [graphData,setGraphData] = useState<null | any>(null)
  const identifierMap:Record<string,string[]> = {
    'soil_moisture':['Soil Moisture','%'],
    'temperature':['Ambient Temperature',"°C"],
    'humidity':['Humidity',"%"],
    'light_intensity':['Light Intensity',"lux"],
    'soil_temperature':['Soil Temperature',"°C"],
    'tds':['Total Dissolved Solids (TDS)','ppm']
  }
  function clearToast(){
    setTimeout(()=>{
      setToast({msg:"",ok:false})
    },3000)
  }
  function compileOverview() {
    let d: Record<string, number> = {
      'soil_moisture': 0,
      'humidity': 0,
      'light_intensity': 0,
      'temperature': 0,
      'soil_temperature': 0,
      'tds': 0
    }
    if (plantData !== null && plantData.length > 0) {
      for (let x = 0; x < plantData.length; x++) {
        d['soil_moisture'] += (plantData[x].soil_moisture)
        d['humidity'] += (plantData[x].humidity)
        d['light_intensity'] += (plantData[x].light_intensity)
        d['temperature'] += (plantData[x].temperature)
        d['soil_temperature'] += (plantData[x].soil_temperature)
        d['tds'] += (plantData[x].tds)
      }
      for (const key of Object.keys(d)) {
        d[key] = parseFloat((d[key] / plantData.length).toFixed(3))
      }
    }
    return [d, {}]
  }

  function compileGraphData() {
    let d: Record<string, number[]> = {
      'soil_moisture': [],
      'humidity': [],
      'light_intensity': [],
      'temperature': [],
      'soil_temperature': [],
      'tds': []
    }
    let dates = []
    if (plantData !== null) {
      for (let x = 0; x < plantData.length; x++) {
        dates.push(new Date(plantData[x].created_at).toLocaleDateString() + ' ' + new Date(plantData[x].created_at).toLocaleTimeString())
        d['soil_moisture'].push(plantData[x].soil_moisture)
        d['humidity'].push(plantData[x].humidity)
        d['light_intensity'].push(plantData[x].light_intensity)
        d['temperature'].push(plantData[x].temperature)
        d['soil_temperature'].push(plantData[x].soil_temperature)
        d['tds'].push(plantData[x].tds)
      }
    }
    let data = []
    for (let key in d) {
      data.push({
        label: key,
        data: d[key],
        borderColor: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
        backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
      })
    }
    setGraphData({ labels: dates, datasets: data });
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}`)
      setPlantData(res.data.data)
      setToast({ msg: "Data fetched successfully.", ok: true })
    } catch (_e) {
      setToast({ msg: "An error occured.", ok: false })
    }
    clearToast()
    compileGraphData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='flex flex-col items-center'>
        <h1 className='text-4xl font-extrabold text-gray-800 mb-8'>Plant Data Monitor</h1>
        <div className='flex gap-4 mb-10 bg-white p-2 rounded-2xl shadow-sm border border-gray-100'>
          <button 
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition ${tab === 'table' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={()=>{
              setTab('table')
            }}>Table</button>
          <button 
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition ${tab === 'graph' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={()=>{
              setTab('graph')
              compileGraphData()
            }}>Graph</button>
            <button 
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={()=>{
              setTab('overview')
            }}>Overview</button>
            <Link 
              to="/about"
              className="px-8 py-3 rounded-xl font-semibold text-lg text-gray-600 hover:bg-gray-100 transition flex items-center"
            >About</Link>
        </div>
        {plantData === null && (
            <h3 className='text-lg text-gray-500'>Loading...</h3>
        )}
        {plantData !== null && graphData !== null && tab === 'graph' && (
          <div className='w-full max-w-4xl bg-white p-6 rounded-xl shadow-md'>
            <TypedLineGraph data={graphData} />
          </div>
        )}
        {plantData !== null && tab === 'overview' && (
          <div className='flex flex-col items-center'>
            <h1 className='text-3xl font-bold mb-6 text-gray-800'>Data Overview</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
              {Object.keys(compileOverview()[0]).map((val,idx)=>(
                <MetricCard 
                    key={idx}
                    metric={val as MetricKey}
                    value={compileOverview()[0][val] as number}
                    label={identifierMap[val][0]}
                    unit={identifierMap[val][1]}
                />
              ))}
            </div>
          </div>
        )}
        {plantData !== null && tab === 'table' && (
          <div className='w-full max-w-5xl bg-white rounded-xl shadow-md overflow-hidden'>
            <table className='w-full text-left'>
              <thead className='bg-gray-100 text-gray-700 uppercase text-sm font-semibold'>
                <tr>
                  <th className='p-4'>Time</th>
                  <th className='p-4'>Soil Moisture (%)</th>
                  <th className='p-4'>Humidity (%)</th>
                  <th className='p-4'>Light Intensity (lux)</th>
                  <th className='p-4'>Temperature (°C)</th>
                  <th className='p-4'>Soil Temperature (°C)</th>
                  <th className='p-4'>TDS (ppm)</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {plantData.slice((page * 10),(page * 10) + 10).map((val:any,idx:any)=>(
                  <tr key={idx} className='hover:bg-gray-50'>
                    <td className='p-4 text-sm text-gray-700'>{new Date(val.created_at).toLocaleString()}</td>
                    <td className='p-4 text-sm text-gray-700'>{val.soil_moisture}</td>
                    <td className='p-4 text-sm text-gray-700'>{val.humidity}</td>
                    <td className='p-4 text-sm text-gray-700'>{val.light_intensity}</td>
                    <td className='p-4 text-sm text-gray-700'>{val.temperature}</td>
                    <td className='p-4 text-sm text-gray-700'>{val.soil_temperature}</td>
                    <td className='p-4 text-sm text-gray-700'>{val.tds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-between items-center p-4 bg-gray-50 border-t'>
              <button 
                className='px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100'
                onClick={()=>{
                setPage(p => {
                  if(p > 0){
                    return p - 1
                  } return p
                })
              }}>Prev</button>
              <h3 className='text-sm font-semibold text-gray-700'>Page {page + 1} / {Math.floor(plantData.length / 10) + (Math.ceil(plantData.length % 10 / 10))}</h3>
              <button 
                className='px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100'
                onClick={()=>{
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