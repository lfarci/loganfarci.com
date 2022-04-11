
import * as React from "react";
import Helmet from "react-helmet";

interface LayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const Layout = ({title, description, children}: LayoutProps) => {
  return <>
        <Helmet>
            <html lang="en"/>
            <title>{title}</title>
            <meta name="description" content={description}/>
        </Helmet>
        <main>
            {children}
        </main>
  </>;
};

export default Layout;