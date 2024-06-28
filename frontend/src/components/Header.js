import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>Crowdsourced Data Visualization Platform</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dataset">Datasets</Link></li>
          <li><Link to="/visualization">Visualizations</Link></li>
          <li><Link to="/collaboration">Collaboration</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
