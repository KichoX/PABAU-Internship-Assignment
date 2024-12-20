import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import './App.css';

// GraphQL query to fetch characters with pagination, filtering, and sorting
const GET_DATA = gql`
  query GetData($page: Int, $status: String, $species: String) {
    characters(page: $page, filter: { status: $status, species: $species }) {
      results {
        id
        name
        status
        species
        gender
        origin {
          name
        }
      }
    }
  }
`;

const App = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('Alive');
  const [species, setSpecies] = useState('Human');

  const { loading, error, data } = useQuery(GET_DATA, {
    variables: { page, status, species },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="App">
      <h1>Rick and Morty Characters</h1>

      <div className="filters">
        <label>Status: </label>
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="Unknown">Unknown</option>
        </select>

        <label>Species: </label>
        <select onChange={(e) => setSpecies(e.target.value)} value={species}>
          <option value="Human">Human</option>
          <option value="Alien">Alien</option>
          <option value="Humanoid">Humanoid</option>
        </select>
      </div>

      <div className="characters">
        {data.characters.results.map((character: any) => (
          <div key={character.id} className="character-card">
            <h3>{character.name}</h3>
            <p><strong>Status:</strong> {character.status}</p>
            <p><strong>Species:</strong> {character.species}</p>
            <p><strong>Gender:</strong> {character.gender}</p>
            <p><strong>Origin:</strong> {character.origin.name}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <button onClick={() => handlePageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
