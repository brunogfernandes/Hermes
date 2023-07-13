import { connection } from "../database/databaseConnection.js";

export const LoginController = {
   async login_usuario(req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando login do usuário.");
            const {email, senha} = req.body;
    
            if (!validateUserFields(email, senha)) {
                console.log("[INFO] Buscando usuário no banco de dados com email={" + email + "}");
                const usuarioBanco = await connection("usuarios").select("*").where("USU_EMAIL", email);
                
                if (usuarioBanco.length == 0) {
                    console.log("[WARN] Email informado não está cadastrado no sistema.");

                    return res.status(409).send({
                        message_pt: "Email informado não está cadastrado no sistema!",
                    });
                }

                console.log("[INFO] Serializando dados do usuário selecionado");                
                const usuarioSerializado = usuarioBanco.map(usuario => {
                    return {
                        id_usuario: usuario.USU_ID,
                        senha_usuario: usuario.USU_SENHA,
                        status_usuario: usuario.USU_STATUS
                    }
                });
                
                const statusUsuarioSerializado = usuarioSerializado[0].status_usuario;
                const idUsuarioSerializado = usuarioSerializado[0].id_usuario;
                const senhaUsuarioSerializado = usuarioSerializado[0].senha_usuario;

                if (statusUsuarioSerializado != "Ativo") {
                    console.log("[WARN] Usuário informado não está ativo no sistema!");

                    return res.status(409).send({
                        message_pt: "Usuário informado não está ativo no sistema!",
                    });
                }


                console.log("[INFO] Verificando se usuário já realizou cadastro anteriormente");
                var tentativaUsuarioBanco = await connection("login_control").select("*").where("FK_USUARIO_USU_ID", idUsuarioSerializado);
                if (tentativaUsuarioBanco.length == 0) {
                    console.log("[INFO] Cadastrando primeiro acesso do usuário");

                    await connection("login_control").insert({
                        LOG_TENTATIVAS: 0,
                        FK_USUARIO_USU_ID: idUsuarioSerializado
                    });

                    tentativaUsuarioBanco = await connection("login_control").select("*").where("FK_USUARIO_USU_ID", idUsuarioSerializado);
                }

                console.log("[INFO] Serializando dados de tentativa do usuário selecionado");
                const tentativaUsuario = tentativaUsuarioBanco.map(tentativa => {
                    return {
                        qtd_tentativas: tentativa.LOG_TENTATIVAS,
                        data_desbloqueio: tentativa.LOG_DATA_DESBLOQUEIO,
                        usuario_id: tentativa.FK_USUARIO_USU_ID
                    }
                });
                

                console.log("[INFO] Verificando se as senhas coincidem");
                if (senhaUsuarioSerializado != senha && !tentativaUsuario[0].data_desbloqueio) {
                    console.log("[WARN] Senha incorreta!")
                    const numTentativasUsuario = 3 - Number(tentativaUsuario[0].qtd_tentativas);

                    var date = new Date();
                    date.setMinutes(date.getMinutes() + 10);

                    if ((tentativaUsuario[0].qtd_tentativas <= 3 && !tentativaUsuario[0].data_desbloqueio)) {
                        console.log("[INFO] Adicionando tentativa. Atualizando valor no banco de dados.");

                        const quantidadeTentativas = tentativaUsuario[0].qtd_tentativas + 1;
                        await connection("login_control").where("FK_USUARIO_USU_ID", idUsuarioSerializado).update({
                            LOG_TENTATIVAS: quantidadeTentativas      
                        }); 
                    } else {
                        console.log("[INFO] Usuário ultrapassou número máximo de tentativas. Bloqueando login por 10 min");
                        await connection("login_control").where("FK_USUARIO_USU_ID", idUsuarioSerializado).update({
                            LOG_TENTATIVAS: 0,
                            LOG_DATA_DESBLOQUEIO: date,
                            FK_USUARIO_USU_ID: idUsuarioSerializado    
                        });
                    }

                    return res.status(409).send({
                        message_pt: "Senha informada não corresponde com o email! Você tem mais " + (numTentativasUsuario > 0?numTentativasUsuario:0) +
                        " tentativas",
                    });            
                }

                console.log("Verificando se o usuário está bloqueado:");
                var dataAtual = new Date();
                console.log("[INFO] Data atual: " + dataAtual);
                console.log("[INFO] Data de bloqueio: " + tentativaUsuario[0].data_desbloqueio)
                if (tentativaUsuario[0].data_desbloqueio > dataAtual) {
                    console.log("[WARN] Usuário está com login bloqueado");

                    res.status(401).send({
                        message_pt: "Usuário está com login bloqueado!",
                    });
                } else {
                    console.log("[INFO] Usuário não está bloqueado.");

                    await connection("login_control").where("FK_USUARIO_USU_ID", idUsuarioSerializado).update({
                        LOG_DATA_DESBLOQUEIO: null,
                    });

                    console.log("[INFO] Login realizado com sucesso");
                    res.json(usuarioSerializado);
                }
            }
        } catch (err) {
            console.log("[ERROR] [LoginController] Erro no método login_usuario: " + err);
        }
   },

   async recuperar_senha(req, res) {
        try {
            console.log("");
            console.log("[INFO] Iniciando recuperação de senha.");

            const {email} = req.body;

            if(!validateEmailField(email)) {
                console.log("[INFO] Buscando usuário no banco de dados com email={" + email + "}")
                const usuario = await connection("usuarios").select("*").where("USU_EMAIL", email);

                if (!(usuario.length)) {
                    console.log("[WARN] Email informado não está cadastrado no sistema.");

                    return res.status(409).send({
                        message_pt: "Email informado não cadastrado no sistema!"
                    });
                }
                
                // TODO - Enviar email, o que fazer? Criar uma mensageria?

                console.log("[INFO] Recuperação de senha com sucesso");
            
                const usuarioSerializado = usuario.map(usuario => {
                    return {
                        id_usuario: usuario.USU_ID,
                    }
                });

                return res.json(usuarioSerializado)
            }     
            
        } catch (err) {
            console.log("[LoginController] Erro no método recuperar_senha: " + err);
        }
   },

   async cadastrar_nova_senha (req, res) {
        try {
            console.log("[INFO] Iniciando cadastro de nova senha.");

            const {senha, confirmar_senha} = req.body;
            const usuarioId = req.params.idUsuario;

            if(!validateSenhaField(senha, confirmar_senha)) {
                console.log("[INFO] Atualizando senha do usuário");

                await connection("usuarios").where("USU_ID", usuarioId).update({
                    USU_SENHA: senha
                });
                
                console.log("[INFO] Senha atualizada com sucesso");
                return res.status(200).send({
                    message_pt: "Senha alterada com sucesso.",
                });
            }

        } catch (err) {
            console.log("[ERROR] [LoginController] Erro no método cadastrar_nova_senha: " + err);
        }
   }
}

function validateUserFields(email, senha) {
    console.log("[INFO] Validando campos de login");

    if (!(email && senha)) {
        console.log("[WARN] Campos obrigatórios não preenchidos.");

        return res.status(400).send({
            message_pt: "Campos obrigatórios não preenchidos!",
        });
    }
}

function validateEmailField(email) {
    console.log("[INFO] Validando email de usuário");

    if (!(email)) {
        console.log("[WARN] Campo email não preenchido");

        return res.status(400).send({
            message_pt: "Campos obrigatórios não preenchidos!"
        });
    }

    if (email.length < 10 && email.length > 100 && !email.includes("@")) {
        console.log("[WARN] Campo email não segue o padrão estabelecido");

        return res.status(400).send({
            message_pt: "Email inserido incorretamente!"
        }); 
    }
}

function validateSenhaField(senha, confirmar_senha) {
    console.log("[INFO] Validando campo senha");

    if (!(senha, confirmar_senha)) {
        console.log("[WARN] Campos obrigatórios não preenchidos");

        return res.status(400).send({
            message_pt: "Campos obrigatórios não preenchidos!"
        });
    }

    if(!isSenhaValid(senha, confirmar_senha)){
        console.log("[WARN] Senha não segue os padrões de segurança");
        
        return res.status(400).send({
            message_pt: "Senha informada não segue os padrões de segurança!"
        });
    }
    
    if (senha != confirmar_senha) {
        console.log("[WARN] As senhas inseridas devem coincidir");

        return res.status(400).send({
            message_pt: "As senhas inseridas devem coincidir."
        });
    }
}

function isSenhaValid(senha, confirmar_senha) {
    var numeros = /([0-9])/;
	var alfabeto = /([a-zA-Z])/;
	var chEspeciais = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;

    const isValidSenha = senha.length >= 6 && senha.length <= 100 && chEspeciais.test(senha) && alfabeto.test(senha) && numeros.test(senha);
    const isValidConfirmarSenha = (senha == confirmar_senha) && isValidSenha;
    
    return isValidSenha && isValidConfirmarSenha;
}
