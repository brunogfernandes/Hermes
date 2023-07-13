USE hermes;

INSERT INTO `usuarios` 
(`USU_ID`, `USU_NOME_RAZAO_SOCIAL`, `USU_TIPO_PESSOA`, `USU_CPF_CNPJ`, `USU_EMAIL`, `USU_SENHA`, `USU_CELULAR`, `USU_ENDERECO`, `USU_STATUS`, `USU_DATA_CADASTRO`, `USU_DATA_APROVACAO_CADASTRO`) 
VALUES 
(NULL, 'Administrador', 'Pessoa Física', '123.456.789-10', 'admin@hermes.com', 'admin', '(19) 99554-2323', 'Rua do Administrador', 'Ativo', '2022-11-01', '2022-11-01'), 
(NULL, 'Vendedor Teste', 'Pessoa Jurídica', '12.345.678/0001-10', 'vendedorteste@gmail.com', 'Senha_123', '(12) 34567-8910', 'Rua do Vendedor', 'Ativo', '2022-11-01', '2022-11-01'), 
(NULL, 'Analista Teste', 'Pessoa Física', '987.654.321-10', 'analistateste@gmail.com', 'Senha_123', '(98) 76543-2109', 'Rua do Analista', 'Ativo', '2022-11-01', '2022-11-01');

INSERT INTO `analistas` (`ANA_ID`, `ANA_PERFIL_LINKEDIN`, `FK_USUARIOS_USU_ID`) 
VALUES 
(NULL, 'https://linkedin.com', '3');

INSERT INTO `vendedores` (`VEN_ID`, `VEN_PERFIL_SHOPEE`, `FK_USUARIOS_USU_ID`) 
VALUES 
(NULL, 'https://shopee.com', '2');

INSERT INTO `produtos` (`PRO_ID`, `PRO_NOME`, `PRO_ESTOQUE`, `PRO_PORC_TAXA`, `PRO_CUSTO_EMBALAGEM`, `PRO_CUSTO`, `PRO_DESCRICAO`, `PRO_VARIACAO`, `FK_VENDEDORES_FK_USUARIOS_USU_ID`) 
VALUES 
(NULL, 'Produto Teste', '100', '2.0', '5.85', '15.60', 'Produto Teste', 'Padrão', '2');

INSERT INTO `anuncios` (`ANU_ID`, `ANU_TIPO_ANUNCIO`, `ANU_STATUS`, `FK_PRODUTOS_PRO_ID`) 
VALUES 
(NULL, 'Pesquisa', 'Ativo', '1'), 
(NULL, 'Descoberta', 'Ativo', '1');

INSERT INTO `metricas` (`MET_ID`, `MET_IMPRESSOES`, `MET_CLIQUES`, `MET_CONVERSOES`, `MET_DESPESAS`, `MET_VENDIDOS`, `MET_DATA`, `MET_ORCAMENTO_DIARIO`, `FK_ANUNCIOS_ANU_ID`) 
VALUES 
(NULL, '100', '45', '23', '8.79', '10', '2022-11-01', '10.68', '1');