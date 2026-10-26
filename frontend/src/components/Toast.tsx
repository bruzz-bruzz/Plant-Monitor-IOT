type Data ={
    msg:string,
    ok:boolean
}
export default function Toast({msg,ok}:Data){
    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${ok ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            <span className="font-bold">{ok ? '✓' : '!'}</span>
            <span className="font-medium">{msg}</span>
        </div>
    )
}