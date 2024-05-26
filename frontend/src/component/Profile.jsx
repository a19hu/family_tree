import React from 'react'
import '../Style/profile.css'
import { Link } from "react-router-dom";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaLinkedin } from 'react-icons/fa';
import { useQuery, gql } from "@apollo/client";
import { FaChevronRight } from 'react-icons/fa';
import MinLoader from './MinLoader';
import { useData } from '../context/DataContext';
function Profile({ toggleModal, searchId }) {
  const { updatesearch } = useData()
  const FILMS_QUERY = gql`
    query Query($searchId: String!) {
      studentSearch(searchQuery: $searchId) {
        name
        rollNo
        year
        picture
        linkedIn
      }
    }
  `;
  const { loading, error, data } = useQuery(FILMS_QUERY, {
    variables: { searchId },
  });
  if (loading) return <p>Loading...</p>
  if (error) return <p>Connection Error</p>;
  const toggleModals = (Id) => {
    updatesearch(Id)
  }
  console.log('jyotin',data.studentSearch[0].picture)
  return (
    <div className="modalprofile">
      <div className="modal-contentprofile">
        <AiOutlineCloseCircle  onClick={toggleModal} className='closespro' />

        {/* <Link to={data.studentSearch[0].picture} target='_blank' > */}
        <img src={`http://172.31.49.27:8000/media/${data.studentSearch[0].picture}`} alt="" className='imagepro' />
        {/* </Link> */}
        <p><span>Name:</span> {data.studentSearch[0].name}</p>
        <p><span>ROLL NUMBER : </span>{data.studentSearch[0].rollNo}</p>
        <p><span>BATCH OF {parseInt(data.studentSearch[0].year)+4} </span></p>

        <Link to={data.studentSearch[0].linkedIn} target='_blank' >
        <FaLinkedin  className='linkedicon' />
        </Link>
        <Link to='/search' onClick={toggleModal}>
                <FaChevronRight onClick={() => toggleModals(data.studentSearch[0].rollNo)} className='iconbutton' />
        </Link>

      </div>
    </div>
  )
}

export default Profile
