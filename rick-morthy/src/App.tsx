import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useQuery, gql } from '@apollo/client';

// GraphQL query
const GET_DATA = gql`
  query getCharacters($page: Int, $status: String, $species: String) {
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
      info {
        next
      }
    }
  }
`;

function App() {
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState<any[]>([]);
  const [status, setStatus] = useState('Alive');
  const [species, setSpecies] = useState('Human');
  const { loading, error, data } = useQuery(GET_DATA, {
    variables: { page, status, species },
    fetchPolicy: 'network-only', // Force fetching fresh data
  });

  const observer = useRef<IntersectionObserver | null>(null);

  // Handle fetching new characters when data changes
  useEffect(() => {
    if (data && data.characters.results) {
      setCharacters((prevCharacters) => [
        ...prevCharacters,
        ...data.characters.results,
      ]);
    }
  }, [data]);

  const loadMore = () => {
    if (data && data.characters.info.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const lastCharacterRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    if (node) observer.current.observe(node);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
    setCharacters([]);
  };

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecies(e.target.value);
    setPage(1);
    setCharacters([]);
  };

  return (
    <div className="App">
      <div className="filters">
        <label>
          Status:
          <select value={status} onChange={handleStatusChange}>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label>
          Species:
          <select value={species} onChange={handleSpeciesChange}>
            <option value="Human">Human</option>
            <option value="Alien">Alien</option>
            <option value="Humanoid">Humanoid</option>
          </select>
        </label>
      </div>

      <div className="characters-container">
        {characters.map((character: any, index: number) => {
          const isLastCharacter = characters.length === index + 1;
          return (
            <div
              ref={isLastCharacter ? lastCharacterRef : null}
              key={character.id}
              className="character-card"
            >
              <h3>{character.name}</h3>
              <p>Status: {character.status}</p>
              <p>Species: {character.species}</p>
              <p>Gender: {character.gender}</p>
              <p>Origin: {character.origin.name}</p>
            </div>
          );
        })}
      </div>

      {loading && <p className="loading">Loading more characters...</p>}
      {error && <p className="error">Error loading characters.</p>}
    </div>
  );
}

export default App;
