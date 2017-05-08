import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './app';
import reducer from './redux/reducer';

const store = createStore(reducer);

const Index = () => (
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(
  <Index />,
  document.getElementById('main')
);
