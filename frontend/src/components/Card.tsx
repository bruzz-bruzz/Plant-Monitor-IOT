import './App.css'
type Data = {
    label:string,
    value:string,
    identifier:string,
    ideal:boolean
}
export default function Card({label,value,identifier,ideal}:Data){
    return (
        <div className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg w-48 h-48 ${ideal === true ? 'text-green-600' : 'text-red-600'}`}>
            <h2 className='text-2xl font-bold'>{label}</h2>
            <p className='text-lg'>{value}{identifier}</p>
        </div>
    )
}