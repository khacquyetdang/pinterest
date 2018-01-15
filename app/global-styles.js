import styled, { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
export const Card = styled.div`
background-color: white;
border: 1px solid #c2cfd6;
padding: 20px;
margin-top: 10px;
margin-bottom: 10px;
display: inline-block;
`;

injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #DDDFDF;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;
