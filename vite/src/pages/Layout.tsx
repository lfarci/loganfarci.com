import LayoutWrapper from '@/components/LayoutWrapper';
import { Providers } from '@/components/Providers';
import React from 'react';
import {Outlet} from 'react-router-dom';

const Layout: React.FC = () => {
  return <Providers><LayoutWrapper><Outlet /></LayoutWrapper></Providers>;
};

export default Layout;
