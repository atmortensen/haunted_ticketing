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

const stripe = 'pk_live_YbdtcLkM4j45CIyF2mvy3HRm'
// const stripe = 'pk_test_Xtcazoby80szFrp5F8YQd75B'

ReactDOM.render(
  <StripeProvider apiKey={stripe}>
    <Provider store={myStore(rootReducer)}>
      <Routes />
    </Provider>
  </StripeProvider>,
  document.getElementById('root')
)
