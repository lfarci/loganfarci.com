import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { Providers } from '@/components/Providers';
import React from 'react';
import {Outlet} from 'react-router-dom';

const Layout: React.FC = () => {
  const githubRepositoryUrl = import.meta.env.VITE_GITHUB_REPOSITORY_URL;
  const commitHash = import.meta.env.VITE_COMMIT_HASH;

  return <Providers><LayoutWrapper githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash}><Outlet /></LayoutWrapper></Providers>;
};

export default Layout;
