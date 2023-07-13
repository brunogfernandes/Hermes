import { connection } from "../database/databaseConnection.js";

export const AdController = {
    async inserir_anuncio (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando inserção de anúncio");

            const { tipo_anuncio, status_anuncio } = req.body;
            const produtoId = req.params.idProduto;

            if (!validateAdFields(tipo_anuncio, status_anuncio, res)) {
                console.log("[INFO] Dados Validados. Inserindo anúncio no banco de dados");

                await connection("anuncios").insert({
                    ANU_TIPO_ANUNCIO: tipo_anuncio,
                    ANU_STATUS: status_anuncio,
                    FK_PRODUTOS_PRO_ID: produtoId
                });

                console.log("[INFO] Dados de anúncio inseridos com sucesso!");
                return res.status(200).send({
                    message_pt: "Criação de anúncio realizado com sucesso!",            
                });
            }
            
        } catch (err) {
            console.log("[ERROR] [AdController] Erro no método inserir_anuncio: " + err);
        }
    },

    async listar_anuncios (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando listagem de anúncios");

            const vendedorId = req.params.idVendedor;

            const anunciosBanco = await connection("anuncios")
            .join("produtos", "produtos.PRO_ID", "=", "anuncios.FK_PRODUTOS_PRO_ID")
            .join("metricas", "anuncios.ANU_ID", "=", "metricas.FK_ANUNCIOS_ANU_ID")
            .select("anuncios.*", "metricas.*", "produtos.*")
            .where("produtos.FK_VENDEDORES_FK_USUARIOS_USU_ID", vendedorId)
            .orderBy("metricas.MET_DATA", "DESC")
            .limit(1);

            console.log("[INFO] Serializando dados dos anúncios selecionados");
            const anunciosSerializados = anunciosBanco.map(anuncio => {
                return {
                    tipo_anuncio: anuncio.ANU_TIPO_ANUNCIO,
                    anuncio_status: anuncio.ANU_STATUS,
                    produto_id: anuncio.FK_PRODUTOS_PRO_ID,
                    produto_nome: anuncio.PRO_NOME,
                    impressoes: anuncio.MET_IMPRESSOES,
                    cliques: anuncio.MET_CLIQUES,
                    conversoes: anuncio.MET_CONVERSOES,
                    despesas: anuncio.MET_DESPESAS,
                    vendidos: anuncio.MET_VENDIDOS,
                    data: anuncio.MET_DATA,
                    orcamento: anuncio.MET_ORCAMENTO_DIARIO,
                    id_anuncio: anuncio.FK_ANUNCIOS_ANU_ID
                }
            });

            console.log("[INFO] Retornanado anúncios selecionados");
            return res.json(anunciosSerializados);

        } catch (err) {
            console.log("[ERROR] [AdController] Erro no método listar_anuncio: " + err);
        }
    },

    async atualizar_anuncio (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando atualização de anúncio");

            const { tipo_anuncio, status_anuncio } = req.body;
            const anuncioId = req.params.idAnuncio;
            const produtoId = req.params.idProduto;

            console.log(anuncioId, produtoId)

            if (!validateAdFields(tipo_anuncio, status_anuncio, res)) {
                console.log("[INFO] Dados Validados. Atualizando anúncio no banco de dados");

                await connection("anuncios").where("ANU_ID", anuncioId).andWhere("FK_PRODUTOS_PRO_ID", produtoId).update({
                    ANU_TIPO_ANUNCIO: tipo_anuncio,
                    ANU_STATUS: status_anuncio
                });

                console.log("[INFO] Dados de anúncio atualizados com sucesso!");
                return res.status(200).send({
                    message_pt: "Edição de anúncio realizado com sucesso!",               
                });

            }   
        } catch (err) {
            console.log("[ERROR] [AdController] Erro no método atualizar_anuncio: " + err);
        }
    },

    async desativar_anuncio (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando desativação de anúncio");

            const anuncioId = req.params.idAnuncio;
            const produtoId = req.params.idProduto;

            console.log("[INFO] Desativando anúncio com anuncioId={"+ anuncioId +"} e produtoId={" + produtoId + "}");
            await connection("anuncios").where("ANU_ID", anuncioId).andWhere("FK_PRODUTOS_PRO_ID", produtoId).update({
                ANU_STATUS: "Desativado"
            });

            console.log("[INFO] Anúncio desativado com sucesso!");
            return res.status(200).send({
                message_pt: "Anúncio desativado com sucesso!",              
            });

        } catch (err) {
            console.log("[ERROR] [AdController] Erro no método remover_anuncio: " + err);
        }
    }
}


function validateAdFields(tipo_anuncio, status_anuncio, res) {
    try {
        console.log("[INFO] Validando dados do anúncio");
        if (!(tipo_anuncio, status_anuncio)) {
            console.log("[WARN] Campos obrigatórios não preenchidos!");

            return res.status(400).send({
                message_pt: "Campos obrigatórios não preenchidos!",
            });
        }

        if (tipo_anuncio != "Pesquisa" && tipo_anuncio != "Descoberta") {
            console.log("[WARN] Tipo de anúncio informado é inválido!");

            return res.status(400).send({
                message_pt: "Tipo de anúncio informado é inválido!",
            }); 
        }

        if (status_anuncio != "Ativo" && status_anuncio != "Pausado") {
            console.log("[WARN] Status de anúncio informado é inválido!");

            return res.status(400).send({
                message_pt: "Status de anúncio informado é inválido!",
            }); 
        }
    } catch (err) {
        console.log("[ERROR] [AdController] Erro no método validateAdFields: " + err);
    }
}

