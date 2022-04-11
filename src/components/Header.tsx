import * as React from "react";
import Author from "@types";
import * as styles from "./Header.module.scss";

type HeaderProps = Author;

const Header = ({name, picture, role, description}: HeaderProps) => {
    return <header className={styles.header}>
        <div className={styles.introduction}>
            <h1>{name}</h1>
            <p>{role}</p>
            <p>{description}</p>
        </div>
        <img alt={picture.alt} src={picture.src}/>
    </header>;
};

export default Header;