import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, withRouter } from 'react-router-dom'
import 'font-awesome/css/font-awesome.css'
import { Provider } from 'react-redux'
import generateStore from './redux/store'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

let store = generateStore()

let client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql"
})

let WithRouter = () => <BrowserRouter><App /></BrowserRouter>
let WithStore = () => <Provider store={store}><WithRouter/></Provider>
let WithApollo = () => <ApolloProvider client={client}> <WithStore/></ApolloProvider>

ReactDOM.render(<WithApollo />, document.getElementById('root'));


serviceWorker.unregister();
