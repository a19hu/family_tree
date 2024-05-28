import React,{useEffect,useState} from 'react'
import '../Style/profile.css'
import '../Style/homeprofile.css'
import { useQuery, gql, } from "@apollo/client";

const Homeprofile = ({rollNo}) => {
  const [imageUrl, setImageUrl] = useState('');

  const FILMS_QUERY = gql`
 query Query($rollNo: String!) {

  student_search(search_query: $rollNo) {
        name
        roll_no
        year
        picture
      }
    }`;

  var { loading, error, data } = useQuery(FILMS_QUERY, {
    variables: { rollNo },
  });
  if (!loading) {
    data = data.student_search[0]
  }
  useEffect(() => {
    if (!loading && data.picture != null) {
      const formattedUrl = `https://drive.google.com/uc?export=view&id=${data.picture.match(/\/d\/(.*?)\//)[1]}`;
      setImageUrl(formattedUrl);
      
      console.log('this is formal',formattedUrl);
      console.log('this is image',imageUrl)
    }

  }, [data]);
  return (
     <div className="modalhprop">
          <div className="modal-contenthomeprofile">
              {loading ? <p>Loading...</p> : 
              <>
            <div className='containerimag'>
              {/* //https://drive.google.com/file/d/1YLh8Y9VaYAyDQ9v9QAiqNnBKT0USMzC3/view */}
              <img src='https://drive.google.com/uc?export=view&id=1YLh8Y9VaYAyDQ9v9QAiqNnBKT0USMzC3' alt="" />
            </div>
            <div className='detailcontainer'> 

            <p><span>NAME : </span>{data.name}</p>
            <p><span>ROLL NUMBER :</span> {data.roll_no}</p>
            <p><span>BATCH OF {parseInt(data.year)+4}</span></p>
            </div>
            </>
              }

          </div>
        </div>
  )
}

export default Homeprofile
