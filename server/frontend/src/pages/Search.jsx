import React from 'react';
import { useQuery, gql, } from "@apollo/client";
import "../Style/serachreasult.css";
import IitjTree from './IitjTree';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const { searchtexts } = useData()
  const navigate = useNavigate();

  
  const FILMS_QUERY = gql`
 query Query($searchtexts: String!) {

  student_search(search_query: $searchtexts) {
        name
        roll_no
        year
        picture
        parentId
      }
  
      
      children(roll_number:$searchtexts) {
     name
        roll_no
        year
        picture
  }
  parent(roll_number:$searchtexts) {
      name
        roll_no
        year
        picture
  }
  sibling(roll_number:$searchtexts) {
     name
        roll_no
        year
        picture
  }
  student(roll_number:$searchtexts) {
      name
        roll_no
        year
        picture
  }

  
    }
  `;

  const { loading, error, data } = useQuery(FILMS_QUERY, {
    variables: { searchtexts},
  });
  if(!loading){

    const datas = data.student_search[0].parentId
    if(datas == null){
     return  navigate('/');
    }
  }


  if (loading) return <p>Loading...</p>;
  if (error) return <p> connection error...</p>;
  return (
    <div className='topmargin'>
      <div className="text">
        <div className='treediv'>
          <IitjTree data={data} />
        </div>

      </div>

    </div>
  )
}

export default Search
