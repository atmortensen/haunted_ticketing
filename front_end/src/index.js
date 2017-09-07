import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes'

import './globalStyles'
import { StripeProvider } from 'react-stripe-elements'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducers from './ducks'

const myStore = applyMiddleware(thunk)(createStore)
const rootReducer = combineReducers(reducers)

ReactDOM.render(
  <StripeProvider apiKey="pk_test_Xtcazoby80szFrp5F8YQd75B">
    <Provider store={myStore(rootReducer)}>
      <Routes />
    </Provider>
  </StripeProvider>,
  document.getElementById('root')
)
