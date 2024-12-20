import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';



let client = new ApolloClient ({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

client.query ({
  query: gql `query {
    characters(page: 1, filter: { status: "Alive", species: "Human" }) {
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
  `
}).then((result) => {console.log(result)});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

