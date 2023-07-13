import {connection} from '../database/databaseConnection.js'; // Importa as rotas existentes

export const ProductController = {
    async criar_produto (req, res){
        try {
            console.log("");
            console.log("[INFO] Iniciando cadastro de produto")

            const {nome_produto, descricao_produto, variacao_produto,
                   qtd_estoque, custo_produto, custo_embalagem, taxas_gov} = req.body;
            const usuarioId = req.params.idUsuario;

            if (!validateProductFields(nome_produto, descricao_produto, variacao_produto, qtd_estoque, custo_produto, custo_embalagem, taxas_gov, res)) {
                console.log("[INFO] Pesquisando Vendedor por usuárioId={" + usuarioId + "}");
                const vendedorUsuarioBanco = await connection("vendedores").select("*").where("FK_USUARIOS_USU_ID", usuarioId);

                console.log("[INFO] Serializando dados de vendedor selecionado");
                const vendedorUsuarioSerializado = vendedorUsuarioBanco.map(vendedorUsuario => {
                return {
                    id_vendedor_usuario: vendedorUsuario.FK_USUARIOS_USU_ID
                }});


                const idVendedorUsuario = vendedorUsuarioSerializado[0].id_vendedor_usuario;
                console.log("[INFO] Inserindo produto para Vendedor com id={" + idVendedorUsuario + "}" );
                await connection('produtos').insert({
                        PRO_NOME: nome_produto,
                        PRO_ESTOQUE: qtd_estoque,
                        PRO_PORC_TAXA: taxas_gov,
                        PRO_CUSTO_EMBALAGEM: custo_embalagem,
                        PRO_CUSTO: custo_produto,
                        PRO_DESCRICAO: descricao_produto,
                        PRO_VARIACAO: variacao_produto,
                        FK_VENDEDORES_FK_USUARIOS_USU_ID: idVendedorUsuario
                });
                    
                console.log("[INFO] Cadastro de produto com sucesso!");
                res.status(200).send({
                    message_pt: "Cadastro de Produto realizado com sucesso!"
                });
            };

        } catch (err) {
            console.log("[ERROR][ProductController] Error at criar_produto: " + err);
        }
    },

    async listar_produtos (req, res){
        try {
            console.log("");
            console.log("[INFO] Iniciando listagem de produtos");

            const idVendedorUsuario = req.params.idUsuario;

            console.log("[INFO] Procurando produto pertencente ao vendedor com id={" + idVendedorUsuario + "}");
            const produtos = await connection("produtos").select("*").where("FK_VENDEDORES_FK_USUARIOS_USU_ID", idVendedorUsuario);

            console.log("[INFO] Serializando dados de produto selecionado");
            const produtosSerializados = produtos.map(produto => {
                return {
                    id_produto: produto.PRO_ID,
                    nome_produto: produto.PRO_NOME,
                    qtd_estoque: produto.PRO_ESTOQUE,
                    custo_embalagem: produto.PRO_CUSTO_EMBALAGEM,
                    descricao_produto: produto.PRO_DESCRICAO,
                    variacao_produto: produto.PRO_VARIACAO,
                    custo_produto: produto.PRO_CUSTO,
                    taxas_gov: produto.PRO_PORC_TAXA
                }
            });

            console.log("[INFO] Retornanado produtos selecionados");
            return res.json(produtosSerializados);
        } catch (err) {
            console.log("[ERROR] [ProductController] Error at listar_produto: " + err);
        }
    },

    async atualizar_produto (req, res){
        try {
            console.log("");
            console.log("[INFO] Iniciando atualização de produto")

            const {nome_produto, descricao_produto, variacao_produto, qtd_estoque, custo_produto, custo_embalagem, taxas_gov} = req.body;
            const produtoId = req.params.idProduto;
            const usuarioId = req.params.idUsuario;

            if (!validateProductFields(nome_produto, descricao_produto, variacao_produto, qtd_estoque, custo_produto, custo_embalagem, taxas_gov, res)) {
                console.log("[INFO] Atualizando produto com id={"  + produtoId + " } pertencente ao vendedor com id={" + usuarioId + "}");
                await connection('produtos').where('PRO_ID', produtoId).andWhere("FK_VENDEDORES_FK_USUARIOS_USU_ID", usuarioId).update({
                    PRO_NOME: nome_produto,
                    PRO_ESTOQUE: qtd_estoque,
                    PRO_CUSTO_EMBALAGEM: custo_embalagem,
                    PRO_DESCRICAO: descricao_produto,
                    PRO_VARIACAO: variacao_produto,
                    PRO_CUSTO: custo_produto,
                    PRO_PORC_TAXA: taxas_gov
                });
                    
                console.log("[INFO] Produto atualizado com sucesso");
                res.status(200).send({
                    message_pt: "Atualização de Produto realizado com sucesso!"
                });
            }
        } catch (err) {
            console.log("[ERROR] [ProductController] Error at atualizar_produto: " + err);
        }
    },

    async remover_produto (req, res){
        try {
            console.log("");
            console.log("[INFO] Iniciando remoção de produto");

            const produtoId = req.params.idProduto;
            const usuarioId = req.params.idUsuario;

            console.log("[INFO] Removendo produto com id={" + produtoId + "}");
            await connection('produtos').where('PRO_ID', produtoId).andWhere("FK_VENDEDORES_FK_USUARIOS_USU_ID", usuarioId).del();

            console.log("[INFO] Produto removido com sucesso");
            res.status(200).send({
                message_pt: "Exclusão de produto realizada com sucesso!"
            });

        } catch (err) {
            console.log("[ERROR] [ProductController] Error at remover_produto: " + err);
        }
    }
}

function validateProductFields(nome_produto, descricao_produto, variacao_produto, qtd_estoque, custo_produto, custo_embalagem, taxas_gov, res) {
    console.log("[INFO] Iniciando a validação dos campos de produto");

    if (!(nome_produto && descricao_produto && variacao_produto && qtd_estoque && custo_produto && custo_embalagem && taxas_gov)) {
        console.log("[WARN] Campos de produto não preenchidos");

        return res.status(400).send({
            message_pt: "Todos os campos são obrigatórios."
        });
    }

    const isFieldsValid = isValidProductFields(nome_produto, descricao_produto, variacao_produto, qtd_estoque, custo_produto, custo_embalagem, taxas_gov);

    if (!isFieldsValid) {
        console.log("[WARN] Campos não estão seguindo o padrão definido");

        return res.status(400).send({
            message_pt: "Dados de produto preenchidos incorretamente!"
        });
    }
}

function isValidProductFields(nome_produto, descricao_produto, variacao_produto, qtd_estoque,
                              custo_produto, custo_embalagem, taxas_gov){
    console.log("[INFO] Validando campos do produto");

    const isValidNomeProduto = nome_produto.length >= 5 && nome_produto.length < 256;
    const isValidDescricaoProduto = descricao_produto.length >= 5 && descricao_produto.length < 256;
    const isValidVariacaoProduto = variacao_produto.length >= 5 && variacao_produto.length < 101;
    const isValidQtdEstoque = qtd_estoque >= 1;
    const isValidCustoEmbalagem = custo_embalagem >= 0;
    const isValidCustoProduto = custo_produto >= 0;
    const isValidTaxasGov = taxas_gov >= 0;

    return isValidNomeProduto && isValidDescricaoProduto && isValidVariacaoProduto && isValidQtdEstoque &&
    isValidCustoEmbalagem && isValidCustoProduto && isValidTaxasGov;         
}