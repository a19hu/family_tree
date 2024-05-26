import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import '../Style/searchsugg.css'
import { useQuery, gql } from "@apollo/client";
import {useData} from '../context/DataContext'
import { Link } from "react-router-dom";

const Searchsuggestion = ({handleonclicks,showModal,final,setShowModal}) => {
  const { updateDataId } = useData();

    const FILMS_QUERY = gql`
    query GetChildren($final: String!) {
      studentSearch(searchQuery: $final) {
        name
        rollNo
      }
        }
      `;
      const { loading, error, data } = useQuery(FILMS_QUERY, {
        variables: {final},
      });
  const toggleModal = (Id) => {
    setShowModal(!showModal)
    
    updateDataId(Id)

  };
  return (
    <div className='modalresult'>
          <div className="modal-contenthelpsu">
          <AiOutlineCloseCircle style={{ fontSize: '2rem', color: 'white' }} onClick={handleonclicks}  className='closes'/>

<div className='searchtext'>

{data.studentSearch.length >0 ?
  data.studentSearch.map((student, index) => (
    <div key={index}> 
      <Link to='/search' onClick={() => toggleModal(student.rollNo)}>{student.name} ({student.rollNo}) </Link>
    </div>
  )) : 'please enter the correct name or roll number'
}
</div>

            </div>
        </div>
  )
}

export default Searchsuggestion
