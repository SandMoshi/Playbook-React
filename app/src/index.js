import React from 'react';
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './index.css';

import App from './components/App';
import TeamPicker from './components/TeamPicker';
import NotFound from './components/NotFound';

const Root = () => {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={TeamPicker} />
        <Route exact path="/team/:playbookName" component={App} />
        {/* The third Route will always work since it has no path */}
        <Route path='*'  component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}

render(
  <Root />,document.querySelector('#root')
);
