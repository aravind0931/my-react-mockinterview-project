import { useState } from "react"

const String = ()=>{
    const [name,setname] = useState("")
    const [inputname,setinputname] = useState("")
    function submit(){
        setname(inputname)
    }

 return (
    <div>
        <h3>name:{name}</h3>
        
        <input type="text" name="u1" placeholder="Enter the Name"  onChange={(e)=>{
          setinputname(e.target.value)
        }}></input>
        <button onClick={()=>{
         submit()
        }}>Submit</button>
    </div>
 )

}
export default String
