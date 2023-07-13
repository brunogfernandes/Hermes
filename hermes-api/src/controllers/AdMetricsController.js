import { connection } from "../database/databaseConnection.js";

export const AdMetricsController = {
    async inserir_metricas (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando inserção de métrica");

            const { orcamento_diario, impressoes, cliques, conversoes, despesas, items_vendidos, data_metricas } = req.body;
            const anuncio_id = req.params.idAnuncio;

            if(!validateAdMetrics(orcamento_diario, impressoes, cliques, conversoes, despesas, items_vendidos, data_metricas, res)){
                console.log("[INFO] Inserindo métricas para anúncio com id={" + anuncio_id + "}" );
                await connection("metricas").insert({
                    MET_IMPRESSOES: impressoes,
                    MET_CLIQUES: cliques,
                    MET_CONVERSOES: conversoes,
                    MET_DESPESAS: despesas,
                    MET_VENDIDOS: items_vendidos,
                    MET_DATA: data_metricas,
                    MET_ORCAMENTO_DIARIO: orcamento_diario,
                    FK_ANUNCIOS_ANU_ID: anuncio_id
                });
    
                console.log("[INFO] Cadastro de métricas com sucesso!");
                return res.status(200).send({
                    message_pt: "Criação de métricas realizado com sucesso!"      
                });   
            }

        } catch (err) {
            console.log("[ERROR] [AdMetricsController] Erro no método inserir_metricas: " + err);
        }
    },

    async listar_metricas (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando listagem de métricas");

            const anuncioId = req.params.idAnuncio;
            const {campoPesquisa} = req.body;

            var metricasBanco;
            if (campoPesquisa) {
                console.log("[INFO] Listagem de métricas com filtro de pesquisa={" + campoPesquisa + "}");

                metricasBanco = await connection("metricas")
                .join("anuncios", "anuncios.ANU_ID", "=", "metricas.FK_ANUNCIOS_ANU_ID")
                .select("metricas.*").where("anuncio.FK_ANUNCIOS_ANU_ID", anuncioId)
                .andWhere("metricas.MET_DATA", campoPesquisa);
            } else {
                console.log("[INFO] Listagem de todas as métricas");

                metricasBanco = await connection("metricas")
                .join("anuncios", "metricas.FK_ANUNCIOS_ANU_ID", "=", "anuncios.ANU_ID")
                .select("metricas.*")
                .where("metricas.FK_ANUNCIOS_ANU_ID", anuncioId);
            }
            
            console.log("[INFO] Serializando métricas selecionadas");
            const metricasSerializados = metricasBanco.map(metrica => {
                return {
                    id_metricas: metrica.MET_ID,
                    impressoes: metrica.MET_IMPRESSOES,
                    cliques: metrica.MET_CLIQUES,
                    conversoes: metrica.MET_CONVERSOES,
                    despesas: metrica.MET_DESPESAS,
                    vendidos: metrica.MET_VENDIDOS,
                    data: new Intl.DateTimeFormat('pt-br', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(metrica.MET_DATA),
                    orcamento_diario: metrica.MET_ORCAMENTO_DIARIO,
                    anuncioId: metrica.FK_ANUNCIOS_ANU_ID
                }
            });
        
            console.log("[INFO] Retornando solicitações de cadastro selecionados");
            return res.json(metricasSerializados);
        } catch (err) {
            console.log("[ERROR] [AdMetricsController] Erro no método listar_metricas: " + err);
        }
    },

    async editar_metrica (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando edição de métrica");

            const { orcamento_diario, impressoes, cliques, conversoes, despesas, items_vendidos, data_metricas } = req.body;
            const metricaId = req.params.idMetrica;

            if(!validateAdMetrics(orcamento_diario, impressoes, cliques, conversoes, despesas, items_vendidos, data_metricas, res)){
                console.log("[INFO] Atualizando métrocas com id={"  + metricaId + " }");
                await connection("metricas").where("MET_ID", metricaId).update({
                    MET_IMPRESSOES: impressoes,
                    MET_CLIQUES: cliques,
                    MET_CONVERSOES: conversoes,
                    MET_DESPESAS: despesas,
                    MET_VENDIDOS: items_vendidos,
                    MET_DATA: data_metricas,
                    MET_ORCAMENTO_DIARIO: orcamento_diario,
                });

                console.log("[INFO] Métricas atualizadas com sucesso");
                return res.status(200).send({
                    message_pt: "Edição de métrica realizado com sucesso!"     
                });
            }
        } catch (err) {
            console.log("[ERROR] [AdMetricsController] Erro no método editar_metrica: " + err);
        }
    },

    async excluir_metrica (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando exclusão de métrica");

            const metricaId = req.params.idMetrica;

            console.log("[INFO] Removendo métrica com id={" + metricaId + "}");
            await connection("metricas").where("MET_ID", metricaId).del();

            console.log("[INFO] Métrica removida com sucesso");
            return res.status(200).send({
                message_pt: "Métrica excluid com sucesso!"
            });

        } catch (err) {
            console.log("[ERROR] [AdMetricsController] Erro no método excluir_metrica: " + err);
        }
    }
}

function validateAdMetrics(orcamento_diario, impressoes, cliques, conversoes, despesas, items_vendidos, data_metricas, res) {
    console.log("[INFO] Iniciando a validação dos campos de métricas");

    if (!(orcamento_diario && impressoes && cliques && conversoes && despesas && items_vendidos && data_metricas)) {
        console.log("[WARN] Campos de métricas não preenchidos");

        return res.status(400).send({
            message_pt: "Campos obrigatórios não preenchidos!"
        });
    }

    const isFieldsValid = isValidAdMetricas(orcamento_diario, impressoes, cliques, conversoes, despesas, items_vendidos, data_metricas);
    
    if (!isFieldsValid) {
        console.log("[WARN] Campos não estão seguindo o padrão definido");

        return res.status(400).send({
            message_pt: "Campos preenchidos incorretamente!"
        });
    }
}

function isValidAdMetricas(orcamento_diario, impressoes, cliques, conversoes, despesas, items_vendidos) {
    console.log("[INFO] Validando campos de métrica");

    const isValidOrcamento = orcamento_diario >= 0;
    const isValidImpressoes = impressoes >= 0;
    const isValidCliques = cliques >= 0;
    const isValidConversoes = conversoes >= 0;
    const isValidDespesas = despesas >= 0;
    const isValidItensVendidos = items_vendidos >= 0;

    return isValidOrcamento && isValidImpressoes && isValidCliques && isValidConversoes && isValidDespesas && isValidItensVendidos;
}