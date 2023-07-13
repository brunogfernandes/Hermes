import React from 'react'

function Header(){
    const tipo_usuario = window.localStorage.getItem("tipo_usuario");

    if(tipo_usuario === "Administrador"){
        return (
            <header>
                <nav className="menu">
                    <div className="dropdown">
                        <button className="main-btn"><i className="fa-solid fa-bars"></i></button>
                        <div className="dropdown-content">
                            <ul>
                                <li><span className="menu-link">Resumo</span></li>
                                <li><a className="menu-link" href="/usuarios">Usuários</a></li>
                                <li><a className="menu-link" href="/solicitacoes-cadastro">Solicitações de Cadastro</a></li>
                                <li><a className="menu-link" href="/perfil">Meu Perfil</a></li>
                                <li><a className="menu-link" onClick={
                                    () => {window.localStorage.removeItem("user_id"); window.localStorage.removeItem("tipo_usuario");}
                                }
                                href="/login"><i className="icon fa-solid fa-right-from-bracket"></i>Sair</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="menu-logo">
                        <a className="menu-link" href="home-admin.html"><h1 className="menu-branding">Hermes.</h1></a>
                    </div>
                    <div className="menu-links">
                        <ul>
                            <li className="menu-item"><span className="menu-link">Resumo</span></li>
                            <li className="menu-item"><a className="menu-link" href="/usuarios">Usuários</a></li>
                            <li className="menu-item"><a className="menu-link" href="/solicitacoes-cadastro">Solicitações de Cadastro</a></li>
                            <li className="menu-item"><a className="menu-link" href="/perfil">Meu Perfil</a></li>
                            <li className="menu-item menu-logout"><a className="menu-link logout-link" onClick={
                                () => {window.localStorage.removeItem("user_id"); window.localStorage.removeItem("tipo_usuario");}
                            }
                            href="/login"><i className="icon fa-solid fa-right-from-bracket"></i>Sair</a></li>
                        </ul>
                    </div> 
                </nav>
            </header>
        )
    }

    else if(tipo_usuario === "Vendedor"){
        return (
            <header>
                <nav className="menu">
                    <div className="dropdown">
                        <button className="main-btn"><i className="fa-solid fa-bars"></i></button>
                        <div className="dropdown-content">
                            <ul>
                                <li><span className="menu-link" href="#">Resumo</span></li>
                                <li><a className="menu-link" href="/produtos">Produtos</a></li>
                                <li><a className="menu-link" href="/anuncios">Anúncios</a></li>
                                <li><a className="menu-link" href="/perfil">Meu Perfil</a></li>
                                <li><a className="menu-link" onClick={
                                    () => {window.localStorage.removeItem("user_id"); window.localStorage.removeItem("tipo_usuario");}
                                }
                                href="/login"><i className="icon fa-solid fa-right-from-bracket"></i>Sair</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="menu-logo">
                        <a className="menu-link" href="home-admin.html"><h1 className="menu-branding">Hermes.</h1></a>
                    </div>
                    <div className="menu-links">
                        <ul>
                            <li className="menu-item"><span className="menu-link" href="#">Resumo</span></li>
                            <li className="menu-item"><a className="menu-link" href="/produtos">Produtos</a></li>
                            <li className="menu-item"><a className="menu-link" href="/anuncios">Anúncios</a></li>
                            <li className="menu-item"><a className="menu-link" href="/perfil">Meu Perfil</a></li>
                            <li className="menu-item menu-logout"><a className="menu-link logout-link" onClick={
                                () => {window.localStorage.removeItem("user_id"); window.localStorage.removeItem("tipo_usuario");}
                            }
                            href="/login"><i className="icon fa-solid fa-right-from-bracket"></i>Sair</a></li>
                        </ul>
                    </div> 
                </nav>
            </header>
        );
    }

    else if(tipo_usuario === "Analista"){
        return (
            <header>
                <nav className="menu">
                    <div className="dropdown">
                        <button className="main-btn"><i className="fa-solid fa-bars"></i></button>
                        <div className="dropdown-content">
                            <ul>
                                <li><a className="menu-link" href="/home-analista">Home</a></li>
                                <li><a className="menu-link" onClick={
                                    () => {window.localStorage.removeItem("user_id"); window.localStorage.removeItem("tipo_usuario");}
                                }
                                href="/login"><i className="icon fa-solid fa-right-from-bracket"></i>Sair</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="menu-logo">
                        <a className="menu-link" href="home-admin.html"><h1 className="menu-branding">Hermes.</h1></a>
                    </div>
                    <div className="menu-links">
                        <ul>
                            <li className="menu-item"><a className="menu-link" href="/home-analista">Home</a></li>
                            <li className="menu-item menu-logout"><a className="menu-link logout-link" onClick={
                                () => {window.localStorage.removeItem("user_id"); window.localStorage.removeItem("tipo_usuario");}
                            }
                            href="/login"><i className="icon fa-solid fa-right-from-bracket"></i>Sair</a></li>
                        </ul>
                    </div> 
                </nav>
            </header>
        );
    }
}

export default Header;