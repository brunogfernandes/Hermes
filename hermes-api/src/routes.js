import express from 'express';
const routes = express.Router();

import {AdController} from './controllers/AdController.js';
import {AdMetricsController} from './controllers/AdMetricsController.js';
import {LoginController} from './controllers/LoginController.js';
import {ProductController} from './controllers/ProductController.js';
import {ProfileController} from './controllers/ProfileController.js';
import {UserController} from './controllers/UserController.js';

// Rotas de Anúncio
routes.post("/:idProduto/inserir-anuncio", AdController.inserir_anuncio);
routes.get("/:idVendedor/listar-anuncios", AdController.listar_anuncios);
routes.post("/:idProduto/editar-anuncio/:idAnuncio", AdController.atualizar_anuncio);
routes.get("/:idProduto/desativar-anuncio/:idAnuncio", AdController.desativar_anuncio);

// Rotas de Métricas
routes.post("/:idAnuncio/inserir-metricas", AdMetricsController.inserir_metricas);
routes.get("/:idAnuncio/listar-metricas", AdMetricsController.listar_metricas);
routes.post("/editar-metrica/:idMetrica", AdMetricsController.editar_metrica);
routes.delete("/excluir-metrica/:idMetrica", AdMetricsController.excluir_metrica);

// Rotas de Login
routes.post("/login", LoginController.login_usuario);
routes.post("/recuperar-senha", LoginController.recuperar_senha);
routes.post("/cadastrar-nova-senha/:idUsuario", LoginController.cadastrar_nova_senha);

// Rotas de Produto
routes.post("/:idUsuario/inserir-produto", ProductController.criar_produto);
routes.get("/:idUsuario/listar-produtos", ProductController.listar_produtos);
routes.post("/:idUsuario/atualizar-produto/:idProduto", ProductController.atualizar_produto);
routes.delete("/:idUsuario/excluir-produto/:idProduto", ProductController.remover_produto);

// Rotas de Perfil
routes.get("/gerenciar-perfil/:idUsuario", ProfileController.detalhar_perfil);
routes.post("/editar-cadastro/:idUsuario", ProfileController.editar_dados_cadastrais);

// Rotas de Usuario
routes.post("/cadastro-usuario", UserController.cadastrar_usuario);
routes.get("/listar-solicitacoes-cadastro", UserController.listar_solicitacoes);
routes.get("/detalhes-solicacao/:id", UserController.detalhar_solicitacao_cadastro);
routes.get("/aprovar-cadastro/:id", UserController.aprovar_cadastro);
routes.post("/recusar-cadastro/:id", UserController.recusar_cadastro);
routes.get("/listar-usuarios-cadastrados", UserController.listar_usuarios_cadastros);
routes.post("/desativar-usuario/:id", UserController.desativar_usuario);
routes.get("/detalhes-cadastro/:idUsuario", UserController.detalhar_dados_usuario);
routes.post("/tipo-usuario", UserController.tipo_usuario);

export const allRoutes = routes;