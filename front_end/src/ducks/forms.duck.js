// TYPES
const UPDATE_FIELD = 'forms/UPDATE_FIELD'
const CLEAR_FIELD = 'forms/CLEAR_FIELD'

// INITIAL STATE
const initialState = {
  password: ''
}

// REDUCER
export default (state = initialState, payload) => {
  switch (payload.type) {
    case UPDATE_FIELD:
      return {...state, [payload.field]: payload.value}
    case CLEAR_FIELD:
      return {...state, [payload.field]: ''}
    default: 
      return state
  }
}

// UPDATE FIELD ACTION
export function updateField(field, e) {
	return {
    type: UPDATE_FIELD,
    field: field,
    value: e.target.value
  }
}

// UPDATE FIELD ACTION
export function clearField(field) {
	return {
    type: CLEAR_FIELD,
    field: field
  }
}

