import './App.css'
type Data ={
    msg:string,
    ok:boolean
}
export default function Toast({msg,ok}:Data){
    return (
        <div className={`absolute right-5 bottom-5 ${ok === true ? 'bg-green-600' : 'bg-red-600'} border border-black rounded-lg p-2`}>
            {msg}
        </div>
    )
}