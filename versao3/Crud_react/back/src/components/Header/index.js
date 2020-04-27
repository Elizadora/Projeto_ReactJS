import React from 'react';
import './styles.css';
const Header = ({ title }) => (
    <header>
        <h1 className="font-weight-bold text-center"> {title?title:'Escolha um Titulo'} </h1>
    </header>
);

export default Header;
