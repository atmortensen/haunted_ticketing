import { NavigationActions } from 'react-navigation'

export default (routeName) => {
	return NavigationActions.reset({
		index: 0,
		key: null,
		actions: [ NavigationActions.navigate({ routeName: routeName }) ]
	})
}
