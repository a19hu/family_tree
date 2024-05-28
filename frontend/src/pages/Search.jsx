import React from 'react';
import { useQuery, gql, from } from "@apollo/client";
import "../Style/serachreasult.css";
import IitjTree from './IitjTree';
import { useData } from '../context/DataContext';
const Search = () => {
  const { searchtexts } = useData()
  const FILMS_QUERY = gql`
 query Query($searchtexts: String!) {

  student_search(search_query: $searchtexts) {
        name
        roll_no
      }
  
      
      children(roll_number:$searchtexts) {
     roll_no
    name
  }
  parent(roll_number:$searchtexts) {
     roll_no
    name
  }
  sibling(roll_number:$searchtexts) {
     roll_no
    name
  }
  student(roll_number:$searchtexts) {
     roll_no
    name
  }

  
    }
  `;

  const { loading, error, data } = useQuery(FILMS_QUERY, {
    variables: { searchtexts},
  });
  console.log('data', data)

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
