import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LegalResources from './pages/LegalResources';
import PropertyComponent from './components/CivilComponent/PropertyComponent';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LegalResources} />
        <Route exact path="/civil/property" component={PropertyComponent} />
        {/* Add routes for other components */}
      </Switch>
    </Router>
  );
};

export default App;
