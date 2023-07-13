import React from 'react'

import Logo from '../../assets/img/Logo_L.png'

function Header(){
    return (
        <header className="login-header">
            <img className="login-header-logo" src={Logo} alt="Hermes Logo"/>
            <h1 className="login-header-title">Fazer Login no Hermes.</h1>
        </header>
    );
}

export default Header;