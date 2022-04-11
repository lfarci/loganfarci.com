import * as React from "react";
import Author from "@types";

type HeaderProps = Author;

const Header = ({name, picture, role, description}: HeaderProps) => {
    return <header>
        <h1>{name}</h1>
        <img alt={picture.alt} src={picture.src} width="64"/>
        <p>{role}</p>
        <p>{description}</p>
    </header>;
};

export default Header;