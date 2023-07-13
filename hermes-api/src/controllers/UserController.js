import { connection } from "../database/databaseConnection.js";

export const UserController = {
    async cadastrar_usuario(req, res){
        try {
            console.log("");
            console.log("[INFO] Iniciando cadastro de usuário");

            const {tipo_usuario, nome_usuario, tipo_pessoa_usuario, cpf_cnpj_usuario, email_usuario, senha_usuario, confimar_senha_usuario, celular_usuario, 
                   endereco_usuario, perfil_redes_usuario} = req.body;

            const isValidUser = validateUserFields(tipo_usuario, nome_usuario, tipo_pessoa_usuario, cpf_cnpj_usuario, email_usuario, senha_usuario, confimar_senha_usuario, celular_usuario, 
                endereco_usuario, perfil_redes_usuario, res);
            
            if (!isValidUser) {        
                console.log("[INFO] Pesquisando usuário por CPF/CNPJ e Email");

                const usuarioPorCPF = await connection('usuarios').select('*').where('USU_CPF_CNPJ', cpf_cnpj_usuario);
                const usuarioPorEmail = await connection('usuarios').select('*').where('USU_EMAIL', email_usuario);
                const isRegisteredUser = isUserRegistered(usuarioPorCPF, usuarioPorEmail, res);

                if (!isRegisteredUser) {
                    console.log("[INFO] Inserindo usuário no banco de dados");

                    const date = new Date();
                    await connection('usuarios').insert({
                            USU_NOME_RAZAO_SOCIAL: nome_usuario,
                            USU_TIPO_PESSOA: tipo_usuario,
                            USU_CPF_CNPJ: cpf_cnpj_usuario,
                            USU_TIPO_PESSOA: tipo_pessoa_usuario,
                            USU_EMAIL: email_usuario,
                            USU_SENHA: senha_usuario,
                            USU_CELULAR: celular_usuario,
                            USU_ENDERECO: endereco_usuario,
                            USU_STATUS: "Aguardando Aprovação", 
                            USU_DATA_CADASTRO: date
                    });

                    const usuarioDatabase = await connection("usuarios").select("*").where("USU_CPF_CNPJ", cpf_cnpj_usuario);
                    const usuarioSerializado = usuarioDatabase.map(usuario => {
                        return {
                            usu_id: usuario.USU_ID,
                            nome_usuario: usuario.USU_NOME_RAZAO_SOCIAL,
                            tipo_usuario: usuario.USU_TIPO_PESSOA,
                            cpf_cnpj_usuario: usuario.USU_CPF_CNPJ,
                            email_usuario: usuario.USU_EMAIL,
                            celular_usuario: usuario.USU_CELULAR,
                            endereco_usuario: usuario.USU_ENDERECO,
                            usuario_status: usuario.USU_STATUS, 
                            data_cadastro: new Intl.DateTimeFormat('pt-br', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(usuario.USU_DATA_CADASTRO),
                        }
                    });

                    console.log("[INFO] Criando perfil de " + tipo_usuario + " para usuário.");
                    if (tipo_usuario == "Vendedor") {
                        await connection("vendedores").insert(
                            {
                                VEN_PERFIL_SHOPEE: perfil_redes_usuario,
                                FK_USUARIOS_USU_ID: usuarioSerializado[0].usu_id
                            }
                        );
                    } else if (tipo_usuario == "Analista") {
                        await connection("analistas").insert(
                            {
                                ANA_PERFIL_LINKEDIN: perfil_redes_usuario,
                                FK_USUARIOS_USU_ID: usuarioSerializado[0].usu_id
                            }
                        );
                    }

                    res.status(200).send({
                        message_pt: "Criação de usuário realizado com sucesso!",
                    });
                }
            }
        } catch (err) {
            console.log("[ERROR] [UserController] Erro no método cadastrar_usuario: " + err);
        }
    },

    async listar_solicitacoes (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando listagem de solicitações de cadastro");

            const usuarios = await connection('usuarios')
            .select('*')
            .leftJoin("analistas", "analistas.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
            .leftJoin("vendedores", "vendedores.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
            .where("USU_STATUS", "Aguardando Aprovação");

            console.log("[INFO] Serializando solicitações de cadastro selecionadas");
            const usuariosSerializados = usuarios.map(usuario => {
                return {
                    id_usuario: usuario.USU_ID,
                    nome_usuario: usuario.USU_NOME_RAZAO_SOCIAL,
                    tipo_usuario: usuario.USU_TIPO_PESSOA,
                    cpf_cnpj_usuario: usuario.USU_CPF_CNPJ,
                    email_usuario: usuario.USU_EMAIL,
                    celular_usuario: usuario.USU_CELULAR,
                    endereco_usuario: usuario.USU_ENDERECO,
                    usuario_status: usuario.USU_STATUS, 
                    data_cadastro: new Intl.DateTimeFormat('pt-br', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(usuario.USU_DATA_CADASTRO),
                    analistaPerfilRede: usuario.ANA_PERFIL_LINKEDIN,
                    vendedorPerfilRede: usuario.VEN_PERFIL_SHOPEE
                }
            });

            console.log("[INFO] Retornando solicitações de cadastro selecionados");
            return res.json(usuariosSerializados);
        } catch (err) {
            console.log("[ERROR] [UserController] Erro no método listar_solicitacoes: " + err)
        }
    },

    async detalhar_solicitacao_cadastro (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando detalhamento de solicitação de cadastro.");

            const usuarioId = req.params.id;

            console.log("[INFO] Procurando soliticação de cadastro com id={" + usuarioId + "}");
            const usuarioSelecionado = await connection("usuarios")
            .leftJoin("analistas", "analistas.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
            .leftJoin("vendedores", "vendedores.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
            .where("USU_ID", usuarioId);

            console.log("[INFO] Serializando solicitação de cadastro selecionada");
            const usuarioSerializado = usuarioSelecionado.map(usuario => {
                return {
                    nome_usuario: usuario.USU_NOME_RAZAO_SOCIAL,
                    tipo_usuario: usuario.USU_TIPO_PESSOA,
                    cpf_cnpj_usuario: usuario.USU_CPF_CNPJ,
                    email_usuario: usuario.USU_EMAIL,
                    celular_usuario: usuario.USU_CELULAR,
                    endereco_usuario: usuario.USU_ENDERECO,
                    usuario_status: usuario.USU_STATUS, 
                    data_cadastro: new Intl.DateTimeFormat('pt-br', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(usuario.USU_DATA_CADASTRO),
                    analistaPerfilRede: usuario.ANA_PERFIL_LINKEDIN,
                    vendedorPerfilRede: usuario.VEN_PERFIL_SHOPEE
                }
            });

            
            if (usuarioSerializado.length == 0) {
                console.log("[WARN] Não existem solicitação de cadastro com id={" + usuarioId + "}");

                return res.status(200).send({
                    message_pt: "Solicitação de cadastro não encontrado com id={" + usuarioId + "}.",
                });
            }

            const userUpdated = removeEmptyFilter(usuarioSerializado[0])

            console.log("[INFO] Detalhando solicitação de cadastro.");
            return res.json(userUpdated);
        } catch (err) {
            console.log("[ERROR] [UserController] Erro no método detalhar_solicitacao_cadastro: " + err);
        }
    }, 

    async listar_usuarios_cadastros (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando listagem de usuários cadastrados");

            const usuariosCadastrados = await connection("usuarios")
            .select("*")
            .leftJoin("analistas", "analistas.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
            .leftJoin("vendedores", "vendedores.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
            .where("USU_STATUS", "Ativo");

            console.log("[INFO] Serializando dados dos usuários selecionados");
            const usuariosCadastradosSerializados = usuariosCadastrados.map(usuario =>{
                return {
                    id_usuario: usuario.USU_ID,
                    nome_usuario: usuario.USU_NOME_RAZAO_SOCIAL,
                    tipo_usuario: usuario.USU_TIPO_PESSOA,
                    cpf_cnpj_usuario: usuario.USU_CPF_CNPJ,
                    email_usuario: usuario.USU_EMAIL,
                    celular_usuario: usuario.USU_CELULAR,
                    endereco_usuario: usuario.USU_ENDERECO,
                    data_cadastro: new Intl.DateTimeFormat('pt-br', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(usuario.USU_DATA_CADASTRO),
                    data_aprovacao_cadastro: new Intl.DateTimeFormat('pt-br', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(usuario.USU_DATA_APROVACAO_CADASTRO),
                    status_usuario: usuario.USU_STATUS,
                    perfil_analista: usuario.ANA_PERFIL_LINKEDIN,
                    perfil_vendedor: usuario.VEN_PERFIL_SHOPEE
                }
            });
            
            if (usuariosCadastradosSerializados.length == 0) {
                return res.status(200).send({
                    message_pt: "Não há usuários cadastrados no sistema."
                });
            }

            console.log("[INFO] Retornanado usuários selecionados");
            return res.json(usuariosCadastradosSerializados);
        } catch (err) {
            console.log("[ERROR] [UserController] Erro no método listar_usuarios_cadastros: " + err);
        }
    },
    
    async detalhar_dados_usuario (req, res) {
        try { 
            console.log("");
            console.log("[INFO] Iniciando detalhamento de usuário cadastrado");

            const usuarioId = req.params.idUsuario;

            console.log("[INFO] Procurando usuário com id={" + usuarioId + "}");
            const usuarioSelecionado = await connection('usuarios').select('*').where('USU_ID', usuarioId);
            
            console.log("[INFO] Serializando dados do usuário selecionado");
            const usuarioSerializado = usuarioSelecionado.map(usuario => {
                return {
                    nome_usuario: usuario.USU_NOME_RAZAO_SOCIAL,
                    tipo_usuario: usuario.USU_TIPO_PESSOA,
                    cpf_cnpj_usuario: usuario.USU_CPF_CNPJ,
                    email_usuario: usuario.USU_EMAIL,
                    celular_usuario: usuario.USU_CELULAR,
                    endereco_usuario: usuario.USU_ENDERECO,
                    usuario_status: usuario.USU_STATUS, 
                    data_cadastro: new Intl.DateTimeFormat('pt-br', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(usuario.USU_DATA_CADASTRO),
                    data_aprovacao_cadastro: new Intl.DateTimeFormat('pt-br', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(usuario.USU_DATA_APROVACAO_CADASTRO),
                }
            });

            if (usuarioSerializado.length == 0) {
                return res.status(200).send({
                    message_pt: "Não há usuário cadastrado com id={" + usuarioId + "}.",
                });
            }

            console.log("[INFO] Retornanado usuário selecionado");
            return res.json(usuarioSerializado);
        } catch (err) {
            console.log("[ERROR] [UserController] Erro no método detalhar_dados_usuario: " + err);
        }
    },

    async aprovar_cadastro (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando processo de aprovar cadastro.");

            const usuarioId = req.params.id;

            console.log("[INFO] Procurando usuário com id={" + usuarioId + "}");
            const usuarioSelecionado = await connection("usuarios").select("*").where("USU_ID", usuarioId);
        
            const date = new Date();
            if (usuarioSelecionado.length) {
                console.log("[INFO] Ativando usuário com id={" + usuarioId + "}");
                await connection('usuarios').where('USU_ID', usuarioId).update({
                    USU_STATUS: "Ativo",
                    USU_DATA_APROVACAO_CADASTRO: date 
                });
    
                res.status(200).send({
                    message_pt: "Aprovação de usuário realizado com sucesso!",                
                });                
            } else {
                console.log("[WARN] Usuário com id={" + usuarioId + "} não encontrado");

                return res.status(400).send({
                    message_pt: "Cadastro não encontrado com id={" + usuarioId + "}.",
                });
            }

        } catch (err) {
            console.log("[ERROR] [UserController] Erro no método aprovar_cadastro: " + err);
        }
    },

    async recusar_cadastro (req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando processo de recusar cadastro.");

            var { motivo } = req.body;
            const usuarioId = req.params.id;

            if (!validateCauseField(motivo, res)) {
                console.log("[INFO] Procurando usuário com id={" + usuarioId + "}");
                const usuarioSelecionado = await connection("usuarios").select("*").where("USU_ID", usuarioId);

                if (usuarioSelecionado.length) {
                    console.log("[INFO] Recusando cadastro de usuário com id={" + usuarioId + "}");

                    const date = new Date();
                    await connection('usuarios').where('USU_ID', usuarioId).update({
                        USU_STATUS: "Cadastro Recusado", 
                        USU_DATA_APROVACAO_CADASTRO: date 
                    });

                    res.status(200).send({
                        message_pt: "Cadastro recusado!",
                    });                
                } else {
                    console.log("[WARN] Usuário com id={" + usuarioId + "} não encontrado");

                    return res.status(400).send({
                        message_pt: "Cadastro não encontrado com id={" + usuarioId + "}.",
                    });
                }
            }
        
        } catch (err) {
            console.log("[ERROR] [UserController] Erro no método recusar_cadastro: " + err);
        }
    },

    async desativar_usuario (req, res) {
        try { 
            console.log("");
            console.log("[INFO] Iniciando desativação de usuário.");

            var {motivo} = req.body;
            const usuarioId = req.params.id;

            if (!validateCauseField(motivo, res)) {
                console.log("[INFO] Procurando usuário com id={" + usuarioId + "}");
                const usuarioSelecionado = await connection("usuarios").select("*").where("USU_ID", usuarioId);

                if (usuarioSelecionado.length) {
                    console.log("[INFO] Desativando usuário com id={" + usuarioId + "}");

                    const date = new Date();
                    await connection("usuarios").where("USU_ID", usuarioId).update(
                        {
                            USU_STATUS: "Inativo",
                            USU_DATA_APROVACAO_CADASTRO: date 
                        }
                    );

                    // Enviar no email

                    res.status(200).send({
                        message_pt: "Usuário desativado com sucesso!",
                        message_en: "User deactivated successfully!"
                    });
                } else {
                    console.log("[WARN] Usuário com id={" + usuarioId + "} não encontrado");

                    return res.status(400).send({
                        message_pt: "Cadastro não encontrado com id={" + usuarioId + "}.",
                    });
                }
            }
        } catch (err) {
            console.log("[UserController] Erro no método desativar_usuario: " + err);
        }
    },

    async tipo_usuario(req, res) {
        try { 
            console.log("");
            console.log("[INFO] Iniciando identificação de usuário por ID.");

            var {usuarioId} = req.body;

            if (usuarioId) {
                console.log("[INFO] Procurando usuário com id={" + usuarioId + "}");
                const usuarioSelecionado = await connection("usuarios")
                .leftJoin("analistas", "analistas.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
                .leftJoin("vendedores", "vendedores.FK_USUARIOS_USU_ID", "=", "usuarios.USU_ID")
                .where("USU_ID", usuarioId);
    
                console.log("[INFO] Serializando usuário selecionado");
                const usuarioSerializado = usuarioSelecionado.map(usuario => {
                    return {
                        analistaPerfilRede: usuario.ANA_PERFIL_LINKEDIN,
                        vendedorPerfilRede: usuario.VEN_PERFIL_SHOPEE
                    }
                });

                if (usuarioSerializado.length) {                    
                    const userUpdated = removeEmptyFilter(usuarioSerializado[0]);
                    var tipoUsuario;
                    if (userUpdated.analistaPerfilRede != null) {
                        console.log("[INFO] Usuário do tipo analista encontrado");
                        tipoUsuario = "Analista";
                    } else if (userUpdated.vendedorPerfilRede != null) {
                        console.log("[INFO] Usuário do tipo vendedor encontrado");
                        tipoUsuario = "Vendedor";
                    } else {
                        console.log("[INFO] Usuário do tipo administrador encontrado");
                        tipoUsuario = "Administrador";
                    }
    
                    const tipoUsuarioSerializado = {
                        tipo_usuario: tipoUsuario
                    }

                    console.log("[INFO] Retornando tipo de usuário selecionado");
                    return res.json(tipoUsuarioSerializado);
                } else {
                    console.log("[WARN] Usuário com ID={" + usuarioId + "} não encontrado");

                    return res.status(400).send({
                        message_pt: "Cadastro não encontrado com ID={" + usuarioId + "}.",
                    });
                }
            } else {
                console.log("[WARN] Necessário informar o ID do usuário");

                return res.status(400).send({
                    message_pt: "Necessário informar o ID do usuário",
                });
            }
        } catch (err) {
            console.log("[ERROR] [UserController] Erro no método tipo_usuario: " + err);
        }
    }

}

function validateUserFields(tipo_usuario, nome_usuario, tipo_pessoa_usuario, cpf_cnpj_usuario, email_usuario, senha_usuario, confimar_senha_usuario, celular_usuario, 
        endereco_usuario, perfil_redes_usuario, res) {
    try {
        console.log("[INFO] Validando dados do usuário");

        if (senha_usuario != confimar_senha_usuario) {
            console.log("[WARN] As senhas inseridas devem coincidir.");

            return res.status(400).send({
                message_pt: "As senhas inseridas devem coincidir.",
            });
        }

        const isValid = isUserFieldsValid(tipo_usuario, nome_usuario, tipo_pessoa_usuario, cpf_cnpj_usuario, email_usuario, senha_usuario, confimar_senha_usuario, celular_usuario,
            endereco_usuario, perfil_redes_usuario);

        if (!isValid) {
            console.log("[WARN] Dados de usuário preenchidos incorretamente! Todos os campos são obrigatórios e devem seguir o padrão.");

            return res.status(400).send({
                message_pt: "Dados de usuário preenchidos incorretamente! Todos os campos são obrigatórios e devem seguir o padrão.",
            });
        }
    } catch (err) {
        console.log("[ERROR] [UserController] Erro no método validateUserFields: " + err);
    }
}

function isUserFieldsValid(tipo_usuario, nome_usuario, tipo_pessoa_usuario, cpf_cnpj_usuario, email_usuario, senha_usuario, confimar_senha_usuario, celular_usuario, 
    endereco_usuario, perfil_redes_usuario) {
    try {
        var numeros = /([0-9])/;
        var alfabeto = /([a-zA-Z])/;
        var chEspeciais = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
        const celular_usuario_formatado = celular_usuario.replace(/[^A-Z0-9]/ig, "");

        const isValidTipoUsuario = tipo_usuario == "Analista" || tipo_usuario == "Vendedor";
        console.log("[INFO] Tipo do usuário é válido? " + isValidTipoUsuario);
        const isValidTipoPessoaUsuario = tipo_pessoa_usuario == "Pessoa Física" || tipo_pessoa_usuario == "Pessoa Jurídica";
        console.log("[INFO] Tipo pessoa é válido?" + isValidTipoPessoaUsuario);
        const isValidNome = nome_usuario.length >= 10 && nome_usuario.length <= 250;
        console.log("[INFO] Nome usuário é válido?" + isValidNome);
        const isValidCpfCnpj = cpf_cnpj_usuario.length >= 14;
        console.log("[INFO] CPF/CNPJ é válido?" + isValidCpfCnpj);
        const isValidEmail = email_usuario.length >= 10 && email_usuario.length <= 100 && email_usuario.includes("@");
        console.log("[INFO] Email é válido?" + isValidEmail);
        const isValidSenha = senha_usuario.length >= 6 && senha_usuario.length <= 100 && chEspeciais.test(senha_usuario) && alfabeto.test(senha_usuario) && numeros.test(senha_usuario);
        console.log("[INFO] Senha é válida?" + isValidSenha);
        const isValidConfirmarSenha = (senha_usuario == confimar_senha_usuario) && isValidSenha;
        console.log("[INFO] Confirmar Senha é válido?" + isValidConfirmarSenha);
        const isValidCelular = celular_usuario_formatado.length == 11;
        console.log("[INFO] Celular é válido?" + isValidCelular);
        const isValidEndereco = endereco_usuario.length >= 10 && endereco_usuario.length <= 100;
        console.log("[INFO] Endereço é válido?" + isValidEndereco);
        const isValidPerfilRede = perfil_redes_usuario.length >= 10 && perfil_redes_usuario.length <= 255 && perfil_redes_usuario.includes("https://"); 
        console.log("[INFO] Perfil rede é válido?" + isValidPerfilRede);

        return isValidNome && isValidCpfCnpj && isValidEmail && isValidSenha && isValidConfirmarSenha && isValidCelular && isValidEndereco && isValidPerfilRede
            && isValidTipoUsuario && isValidTipoPessoaUsuario;
    } catch (err) {
        console.log("[ERROR] [UserController] Erro no método isUserFieldsValid: " + err);
    }
}

function isUserRegistered(usuarioPorCPF, usuarioPorEmail, res){
    try {
        console.log("[INFO] Verificando se usuário está cadastrado no sistema");

        if (usuarioPorCPF.length) { 
            console.log("[WARN] CPF/CNPJ já cadastrado.");
            
            return res.status(400).send({
                message_pt: "CPF/CNPJ já cadastrado.",
            });
        }

        if (usuarioPorEmail.length) {
            console.log("[WARN] Email já cadastrado.");

            return res.status(400).send({
                message_pt: "Email já cadastrado.",
            });
        }
    } catch (err) {
        console.log("[ERROR] [UserController] Erro no método isUserRegistered: " + err);
    }
}

function validateCauseField(motivo, res){
    try {
        console.log("[INFO] Verificando se o campo motivo é válido");
        
        if (motivo.length < 10) {
            console.log("[WARN] O preenchimento do campo é obrigatório.");

            return res.status(400).send({
                message_pt: "O preenchimento do campo com ao menos 10 caracteres é obrigatório.",
            });
        }

        if (motivo.length > 300) {
            console.log("[WARN] O campo ultrapassou o limite de caracteres.");

            return res.status(400).send({
                message_pt: "O campo ultrapassou o limite de caracteres.",
            });
        }
    } catch (err) {
        console.log("[ERROR] [UserController] Erro no método validateCauseField: " + err);
    }
}

function validateEmaillField(email, res) {
    try {
        console.log("[INFO] Validando email do usuário");

        if (!email) {
            console.log("[WARN] O campo email deve ser preenchido.");

            return res.status(400).send({
                message_pt: "O campo email deve ser preenchido.",
            });
        }

        const isValid = isEmailValid(email);

        if (!isValid) {
            console.log("[WARN] Email informado deve seguir o padrão estabelecido.");

            return res.status(400).send({
                message_pt: "Email informado deve seguir o padrão estabelecido.",
            });
        }
    } catch (err) {
        console.log("[ERROR] [UserController] Erro no método validateEmaillField: " + err);
    }
}

function isEmailValid(email){
    const isValidEmail = email.length >= 10 && email.length <= 100 && email.includes("@");
    console.log("[INFO] Email é válido?" + isValidEmail);

    return isValidEmail;
}

function removeEmptyFilter(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v != null && v !== "")
    );
}