import styled, { injectGlobal } from 'styled-components'
import '../node_modules/font-awesome/css/font-awesome.min.css'

// Global styles to be used sparingly...
// eslint-disable-next-line
injectGlobal`
  * {
    font-family: sans-serif;
    box-sizing: border-box;
    font-family: 'Alegreya', serif;
  }
  body {
    margin: 0;
    color: #e6e6e6;
    font-size: 20px;
  }
  p {
    margin: 0;
  }
  a {
    color: #e6e6e6;
  }
`

export const Input = styled.input`
  padding: 5px;
  margin: 0 5px 5px 0;
  font-size: 18px;
  text-align: ${props => props.center ? 'center' : 'left'}
`
export const Button = styled.button`
  padding: 5px 8px;
  margin: 0 5px 5px 0;
  font-size: 18px;
`
