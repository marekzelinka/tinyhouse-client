import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { render } from 'react-dom'
import './styles/index.css'
import { Listings } from './sections'

const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
})

render(
  <ApolloProvider client={client}>
    <Listings title="TinyHouse Listings" />
  </ApolloProvider>,
  document.getElementById('root')
)
