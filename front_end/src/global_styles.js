import styled, { injectGlobal } from 'styled-components'

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
`

export const Input = styled.input`
  padding: 5px;
`

export const Button = styled.button`
  padding: 5px;
`
