import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DatasetPage from './pages/DatasetPage';
import VisualizationPage from './pages/VisualizationPage';
import CollaborationPage from './pages/CollaborationPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/dataset" component={DatasetPage} />
        <Route path="/visualization" component={VisualizationPage} />
        <Route path="/collaboration" component={CollaborationPage} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
