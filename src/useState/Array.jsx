import { useState } from "react"

const Array = ()=>{
    const [namearr,setnamearr] = useState(["John","michel","Alex"])

    function Change(){
        let newarray =  namearr.map((value)=>{

         if (value == "John"){
            return "kani"
         }else{
           return  value
         }
        }
        
    )
     setnamearr(newarray)
        
    }

     return(
        <div>
            <ul>
                <li>{namearr[0]}</li>
                <li>{namearr[1]}</li>
                <li>{namearr[2]}</li>
            </ul>
          <button onClick={()=>
            Change()
          }>button</button>
        </div>
     )

}
export default Array