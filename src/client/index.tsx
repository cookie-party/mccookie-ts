import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './app';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const Index = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(
  <Index />,
  document.getElementById('main')
);
