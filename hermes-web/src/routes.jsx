import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import Home from './layouts/home'
import Dashboard from './layouts/dashboard'

// Home Pages
import Login from './pages/home/login'
import Cadastro from './pages/home/cadastro'
import RecuperarSenha from './pages/home/recuperar-senha'
import CadastrarSenha from './pages/home/cadastrar-senha'

// Dashboard Pages
import SolicitacoesCadastro from './pages/dashboard/solicitacoes-cadastro'
import Perfil from './pages/dashboard/perfil'
import Usuarios from './pages/dashboard/usuarios'
import Produtos from './pages/dashboard/produtos'
import InserirProduto from './pages/dashboard/inserir-produto'
import Anuncios from './pages/dashboard/anuncios'
import InserirAnuncio from './pages/dashboard/inserir-anuncio'
import MetricasAnuncio from './pages/dashboard/metricas-anuncio'
import InserirMetricas from './pages/dashboard/inserir-metricas'
import HomeAnalista from './pages/dashboard/home-analista'

function AppRoutes(){
    const tipo_usuario = window.localStorage.getItem("tipo_usuario");

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home />}>
                    <Route path="/" element={<Navigate to="/login" replace/>} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                    <Route path="/cadastrar-senha/:id" element={<CadastrarSenha />} />
                </Route>

                <Route element={<Dashboard />}>
                    <Route path="/dashboard" element={
                        
                        tipo_usuario === "Administrador" ? <Navigate to="/solicitacoes-cadastro" replace/> 
                        : tipo_usuario === "Vendedor" ? <Navigate to="/produtos" replace/> : <Navigate to="/home-analista" replace/>
                    
                    } />

                    <Route path="/solicitacoes-cadastro" element={<SolicitacoesCadastro />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/inserir-produto" element={<InserirProduto />} />
                    <Route path="/anuncios" element={<Anuncios />} />
                    <Route path="/inserir-anuncio" element={<InserirAnuncio />} />
                    <Route path="/metricas-anuncio/:anuncio_id" element={<MetricasAnuncio />} />
                    <Route path="/inserir-metricas/:anuncio_id" element={<InserirMetricas />} />
                    <Route path="/home-analista" element={<HomeAnalista />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;