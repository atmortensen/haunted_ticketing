import React from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'
import {
	createRouter,
	NavigationProvider,
	StackNavigation
} from '@expo/ex-navigation'

import Login from './components/Login'
import Scanner from './components/Scanner'
import Dashboard from './components/Dashboard'

const Wrapper = styled.View`
	margin-top: ${ StatusBar.currentHeight }px;
	flex: 1;
`

const Router = createRouter(() => ({
	login: () => Login,
	dashboard: () => Dashboard,
	scanner: () => Scanner
}))

export default class App extends React.Component {

	render() {
		return (
			<Wrapper behavior="padding"> 
				<NavigationProvider router={Router}>
					<StackNavigation initialRoute="login" />
				</NavigationProvider>
			</Wrapper>
		)
	}

}
