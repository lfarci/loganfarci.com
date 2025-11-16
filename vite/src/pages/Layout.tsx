import React from 'react';
import {Outlet, Link} from 'react-router-dom';

const Layout: React.FC = () => {
  return <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>;
};

export default Layout;
