import React,{useEffect} from 'react'
import '../Style/profile.css'
import '../Style/homeprofile.css'
const Homeprofile = ({data}) => {
  return (
     <div className="modalhprop">
          <div className="modal-contenthomeprofile">
            <div className='containerimag'>

            <img src={`http://172.31.49.27:8000/${data.picture}`} alt="" />
            </div>
            <div className='detailcontainer'> 

            <p><span>NAME : </span>{data.name}</p>
            <p><span>ROLL NUMBER :</span> {data.roll_no}</p>
            <p><span>BATCH OF {parseInt(data.year)+4}</span></p>
            
             
            </div>

          </div>
        </div>
  )
}

export default Homeprofile
