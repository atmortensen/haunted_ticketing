import styled, { injectGlobal } from 'styled-components'
import '../node_modules/font-awesome/css/font-awesome.min.css'

// Global styles to be used sparingly...
// eslint-disable-next-line
injectGlobal`
  * {
    font-family: sans-serif;
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
  p {
    margin: 0;
  }
`

export const Input = styled.input`
  padding: 5px;
  margin: 0 5px 5px 0;
`
export const Button = styled.button`
  padding: 5px;
  margin: 0 5px 5px 0;
`
