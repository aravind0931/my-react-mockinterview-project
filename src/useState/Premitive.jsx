import { useState } from "react"

const Premitive = ()=>{
    const [count , setcount] = useState(20)

    function increase(){
        setcount(count + 1)
    }
    function decrease(){
        if(count > 0){
            setcount(count - 1)
        }
        
    }

    return (
        <div>
        <h1>{count}</h1>
        <button onClick={()=>{
         increase()
        }}>Increase</button>
        <button onClick={()=>{
            decrease()
        }}>decrease</button>
        

        </div>
    )
}

export default Premitive