import React, { useState } from 'react';
import '../Style/searchbutton.css'
import { Link } from "react-router-dom";
import { useData } from '../context/DataContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, gql } from "@apollo/client";
import MinLoader from './MinLoader';
import Searchsuggestion from './Searchsuggestion';
import { AiOutlineSearch } from 'react-icons/ai';

const Searchbutton = () => {
  const [parentId, setParentId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [final, setfinal] = useState('')
  const { updateData } = useData();
  const handleParentIdChange = (e) => {
    setParentId(e.target.value);
  };
  const FILMS_QUERY = gql`
    query GetChildren($final: String!) {
      studentSearch(searchQuery: $final) {
        name
        rollNo
      }
        }
      `;
  const { loading, error, data } = useQuery(FILMS_QUERY, {
    variables: { final },
  });
  const handleonclick = () => {
    if (parentId != '') {
      updateData(parentId)
      setShowModal(true);
      setfinal(parentId)

    }

  }
  const handleonclicks = () => {
    setShowModal(false);
  }

  if (loading) return <p>Loading...</p>;
  return (

    <div class="searchBox">
      

      {showModal &&
        (
          <Searchsuggestion handleonclicks={handleonclicks} showModal={showModal} data={data} final={final} setShowModal={setShowModal} />
        )
      }
      <input
        type="text"
        class="searchInput"
        placeholder="Search ..."
        value={parentId}
        onChange={handleParentIdChange}
      />
      <ToastContainer />
      {
        parentId &&
        <AiOutlineSearch   onClick={handleonclick} className='searchButton'/>
      }
    </div>




  )
}

export default Searchbutton
