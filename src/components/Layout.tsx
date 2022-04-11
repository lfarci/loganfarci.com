
import * as React from "react";
import Helmet from "react-helmet";
import * as styles from "./Layout.module.scss";

interface LayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const Layout = ({title, description, children}: LayoutProps) => {
  return <div className={styles.layout}>
        <Helmet>
            <html lang="en"/>
            <title>{title}</title>
            <meta name="description" content={description}/>
        </Helmet>
        <main>
            {children}
        </main>
  </div>;
};

export default Layout;