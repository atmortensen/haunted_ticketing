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

const stripe =
  process.env.NODE_ENV === "development"
    ? "pk_test_zbL3x777xQn2hWTWag6P6a1N"
    : "pk_test_zbL3x777xQn2hWTWag6P6a1N";

ReactDOM.render(
	<StripeProvider apiKey={stripe}>
		<Provider store={myStore(rootReducer)}>
			<Routes />
		</Provider>
	</StripeProvider>,
	document.getElementById('root')
)
