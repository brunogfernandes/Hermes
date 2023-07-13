import { connection } from "../database/databaseConnection.js";

export const ProfileController = {
    async detalhar_perfil (req, res) {
        try { 
            console.log("");
            console.log("[INFO] Iniciando detalhamento de perfil de usuário cadastrado");

            const perfilId = req.params.idUsuario;

            console.log("[INFO] Procurando usuário com id={" + perfilId + "}");
            const perfilSelecionado = await connection('usuarios')
            .select('*')
            .leftJoin("analistas", "analistas.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
            .leftJoin("vendedores", "vendedores.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
            .where('USU_ID', perfilId);
            
            console.log("[INFO] Serializando dados do usuário selecionado");
            const perfilSerializado = perfilSelecionado.map(usuario => {
                return {
                    nome_usuario: usuario.USU_NOME_RAZAO_SOCIAL,
                    tipo_usuario: usuario.USU_TIPO_PESSOA,
                    cpf_cnpj_usuario: usuario.USU_CPF_CNPJ,
                    email_usuario: usuario.USU_EMAIL,
                    senha_usuario: usuario.USU_SENHA,
                    celular_usuario: usuario.USU_CELULAR,
                    endereco_usuario: usuario.USU_ENDERECO,
                    data_cadastro: usuario.USU_DATA_CADASTRO,
                    data_aprovacao_cadastro: usuario.USU_DATA_APROVACAO_CADASTRO,
                    perfil_analista: usuario.ANA_PERFIL_LINKEDIN,
                    perfil_vendedor: usuario.VEN_PERFIL_SHOPEE
                }
            });

            if (perfilSerializado.length == 0) {
                console.log("[WARN] Não há perfil cadastrado no sistema com id={" + perfilId + "}.");

                return res.status(200).send({
                    message_pt: "Não há perfil cadastrado no sistema com id={" + perfilId + "}.",
                });
            }

            console.log("[INFO] Retornanado perfil de usuário selecionado");
            return res.json(perfilSerializado);
        } catch (err) {
            console.log("[ProfileController] Erro no método detalhar_perfil: " + err);
        }
    },

    async editar_dados_cadastrais (req, res) {
        try { 
            console.log("");
            console.log("[INFO] Iniciando edição de perfil cadastrado");

            const {nome_usuario, email_usuario, email_usuario_novo, celular_usuario, endereco_usuario, perfil_redes_usuario} = req.body;
            const perfilId = req.params.idUsuario;

            if(!validateProfileFields(nome_usuario, email_usuario_novo, celular_usuario, endereco_usuario, perfil_redes_usuario, res)){

                if(email_usuario != email_usuario_novo){
                    const emailExist = await connection("usuarios").select("*").where("USU_EMAIL", email_usuario);

                    if (emailExist.length > 0) {
                        console.log("[WARN] Email informado já está cadastrado no sistema");
                        
                        return res.status(400).send({
                            message_pt: "Email já cadastrado."
                        });
                    }
                }          

                console.log("[INFO] Atualizando dados de perfil");
                await connection('usuarios').where('USU_ID', perfilId).update({
                        USU_NOME_RAZAO_SOCIAL: nome_usuario,
                        USU_EMAIL: email_usuario,
                        USU_CELULAR: celular_usuario,
                        USU_ENDERECO: endereco_usuario,
                });

                await connection("vendedores").where("FK_USUARIOS_USU_ID", perfilId).update({
                    VEN_PERFIL_SHOPEE: perfil_redes_usuario
                });    

                await connection("analistas").where("FK_USUARIOS_USU_ID", perfilId).update({
                    ANA_PERFIL_LINKEDIN: perfil_redes_usuario
                });  


                console.log("[INFO] Atualização de dados cadastrais com sucesso!");
                res.status(200).send({
                    message_pt: "Atualização de Perfil realizado com sucesso!"
                });
            }
        } catch (err) {
            console.log("[ERROR] [ProfileController] Erro no método editar_dados_cadastrais: " + err);
        }
    }
}

function validateProfileFields(nome_usuario, email_usuario, celular_usuario, endereco_usuario, perfil_redes_usuario, res) {
    console.log("[INFO] Iniciando a validação dos campos de perfil");

    if (!(nome_usuario && email_usuario && celular_usuario && endereco_usuario && perfil_redes_usuario)) {
        console.log("[WARN] Campos de perfil não preenchidos");

        return res.status(400).send({
            message_pt: "Todos os campos são obrigatórios."
        });
    }

    const isFieldsValid = isValidProfileFields(nome_usuario, email_usuario, celular_usuario, endereco_usuario, perfil_redes_usuario);

    if (!isFieldsValid) {
        console.log("[WARN] Campos não estão seguindo o padrão definido");

        return res.status(400).send({
            message_pt: "Dados de perfil preenchidos incorretamente!"
        });
    }
}

function isValidProfileFields(nome_usuario, email_usuario, celular_usuario, 
    endereco_usuario, perfil_redes_usuario) {

    const isValidNome = nome_usuario.length >= 10 && nome_usuario.length <= 250;
    const isValidEmail = email_usuario.length >= 10 && email_usuario.length <= 100 && email_usuario.includes("@");
    const isValidCelular = celular_usuario.length == 15;
    const isValidEndereco = endereco_usuario.length >= 10 && endereco_usuario.length <= 100;
    const isValidPerfilRede = perfil_redes_usuario.length >= 10 && perfil_redes_usuario.length <= 255 && perfil_redes_usuario.includes("https://"); 

    return isValidNome && isValidEmail && isValidCelular && isValidEndereco && isValidPerfilRede;
}
