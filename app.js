// Funcionalidades principais do aplicativo
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    // Elementos do Dashboard
    const maquinasCount = document.getElementById('maquinas-count');
    const operacoesCount = document.getElementById('operacoes-count');
    const pecasCount = document.getElementById('pecas-count');
    const manutencoesCount = document.getElementById('manutencoes-count');
    const alertasCount = document.getElementById('alertas-count');
    const alertasRecentesList = document.getElementById('alertas-recentes-list');
    
    // Elementos de Máquinas
    const maquinaNome = document.getElementById('maquina-nome');
    const maquinaModelo = document.getElementById('maquina-modelo');
    const maquinaFabricante = document.getElementById('maquina-fabricante');
    const maquinaDataAquisicao = document.getElementById('maquina-data-aquisicao');
    const maquinaStatus = document.getElementById('maquina-status');
    const maquinaSalvar = document.getElementById('maquina-salvar');
    const maquinasList = document.getElementById('maquinas-list');
    
    // Elementos de Operações
    const operacaoMaquina = document.getElementById('operacao-maquina');
    const operacaoTipo = document.getElementById('operacao-tipo');
    const operacaoData = document.getElementById('operacao-data');
    const operacaoDuracao = document.getElementById('operacao-duracao');
    const operacaoOperador = document.getElementById('operacao-operador');
    const operacaoObservacoes = document.getElementById('operacao-observacoes');
    const operacaoSalvar = document.getElementById('operacao-salvar');
    const operacoesList = document.getElementById('operacoes-list');
    
    // Elementos de Peças
    const pecaNome = document.getElementById('peca-nome');
    const pecaCodigo = document.getElementById('peca-codigo');
    const pecaMaquina = document.getElementById('peca-maquina');
    const pecaVidaUtil = document.getElementById('peca-vida-util');
    const pecaUltimaTroca = document.getElementById('peca-ultima-troca');
    const pecaEstoque = document.getElementById('peca-estoque');
    const pecaSalvar = document.getElementById('peca-salvar');
    const pecasList = document.getElementById('pecas-list');
    
    // Elementos de Manutenções
    const manutencaoMaquina = document.getElementById('manutencao-maquina');
    const manutencaoTipo = document.getElementById('manutencao-tipo');
    const manutencaoData = document.getElementById('manutencao-data');
    const manutencaoResponsavel = document.getElementById('manutencao-responsavel');
    const manutencaoDescricao = document.getElementById('manutencao-descricao');
    const manutencaoCusto = document.getElementById('manutencao-custo');
    const manutencaoSalvar = document.getElementById('manutencao-salvar');
    const manutencoesList = document.getElementById('manutencoes-list');
    
    // Elementos de Alertas
    const alertasList = document.getElementById('alertas-list');
    
    // Variáveis para edição
    let editandoMaquinaId = null;
    let editandoOperacaoId = null;
    let editandoPecaId = null;
    let editandoManutencaoId = null;
    
    // Navegação entre páginas
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe ativa de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe ativa ao link clicado
            this.classList.add('active');
            
            // Esconder todas as páginas
            pages.forEach(page => page.classList.add('hidden'));
            
            // Mostrar a página correspondente
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).classList.remove('hidden');
        });
    });
    
    // CORREÇÃO: Tornar a função carregarDados global para que auth.js possa acessá-la
    window.carregarDados = function() {
        console.log("Carregando dados do Firebase...");
        carregarMaquinas();
        carregarOperacoes();
        carregarPecas();
        carregarManutencoes();
        carregarAlertas();
        atualizarDashboard();
    };
    
    // Funções para Máquinas
    function carregarMaquinas() {
        console.log("Tentando carregar máquinas do Firebase...");
        maquinasRef.get().then((snapshot) => {
            console.log("Resposta do Firebase para máquinas:", snapshot.size, "documentos");
            if (snapshot.empty) {
                maquinasList.innerHTML = '<p class="empty-message">Nenhuma máquina cadastrada.</p>';
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const maquina = doc.data();
                html += `
                    <div class="list-item" data-id="${doc.id}">
                        <h4>${maquina.nome}</h4>
                        <p><strong>Modelo:</strong> ${maquina.modelo}</p>
                        <p><strong>Fabricante:</strong> ${maquina.fabricante}</p>
                        <p><strong>Data de Aquisição:</strong> ${formatarData(maquina.dataAquisicao)}</p>
                        <p><strong>Status:</strong> ${maquina.status}</p>
                        <div class="actions">
                            <button class="edit-btn" onclick="editarMaquina('${doc.id}')">Editar</button>
                            <button class="delete-btn" onclick="excluirMaquina('${doc.id}')">Excluir</button>
                        </div>
                    </div>
                `;
            });
            
            maquinasList.innerHTML = html;
            
            // Atualizar selects de máquinas em outros formulários
            atualizarSelectsMaquinas();
        }).catch(error => {
            console.error("Erro ao carregar máquinas:", error);
            maquinasList.innerHTML = '<p class="empty-message">Erro ao carregar máquinas. Verifique o console para mais detalhes.</p>';
        });
    }
    
    function atualizarSelectsMaquinas() {
        // Limpar selects
        if (operacaoMaquina) operacaoMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        if (pecaMaquina) pecaMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        if (manutencaoMaquina) manutencaoMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        
        // Preencher com máquinas cadastradas
        maquinasRef.get().then((snapshot) => {
            snapshot.forEach(doc => {
                const maquina = doc.data();
                const option = `<option value="${doc.id}">${maquina.nome}</option>`;
                
                if (operacaoMaquina) operacaoMaquina.innerHTML += option;
                if (pecaMaquina) pecaMaquina.innerHTML += option;
                if (manutencaoMaquina) manutencaoMaquina.innerHTML += option;
            });
        }).catch(error => {
            console.error("Erro ao atualizar selects de máquinas:", error);
        });
    }
    
    // Salvar máquina
    if (maquinaSalvar) {
        maquinaSalvar.addEventListener('click', function() {
            const nome = maquinaNome.value.trim();
            const modelo = maquinaModelo.value.trim();
            const fabricante = maquinaFabricante.value.trim();
            const dataAquisicao = maquinaDataAquisicao.value;
            const status = maquinaStatus.value;
            
            if (!nome || !modelo || !fabricante || !dataAquisicao) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const maquinaData = {
                nome,
                modelo,
                fabricante,
                dataAquisicao,
                status,
                dataCadastro: new Date().toISOString()
            };
            
            console.log("Tentando salvar máquina:", maquinaData);
            
            if (editandoMaquinaId) {
                // Atualizar máquina existente
                maquinasRef.doc(editandoMaquinaId).update(maquinaData)
                    .then(() => {
                        console.log("Máquina atualizada com sucesso!");
                        limparFormularioMaquina();
                        carregarMaquinas();
                        atualizarDashboard();
                        alert('Máquina atualizada com sucesso!');
                    })
                    .catch(error => {
                        console.error("Erro ao atualizar máquina:", error);
                        alert('Erro ao atualizar máquina. Tente novamente. Erro: ' + error.message);
                    });
            } else {
                // Adicionar nova máquina
                maquinasRef.add(maquinaData)
                    .then(() => {
                        console.log("Máquina adicionada com sucesso!");
                        limparFormularioMaquina();
                        carregarMaquinas();
                        atualizarDashboard();
                        alert('Máquina adicionada com sucesso!');
                    })
                    .catch(error => {
                        console.error("Erro ao adicionar máquina:", error);
                        alert('Erro ao adicionar máquina. Tente novamente. Erro: ' + error.message);
                    });
            }
        });
    }
    
    function limparFormularioMaquina() {
        if (maquinaNome) maquinaNome.value = '';
        if (maquinaModelo) maquinaModelo.value = '';
        if (maquinaFabricante) maquinaFabricante.value = '';
        if (maquinaDataAquisicao) maquinaDataAquisicao.value = '';
        if (maquinaStatus) maquinaStatus.value = 'Ativa';
        editandoMaquinaId = null;
        if (maquinaSalvar) maquinaSalvar.textContent = 'Salvar';
    }
    
    // Funções para editar e excluir máquina
    window.editarMaquina = function(id) {
        maquinasRef.doc(id).get().then(doc => {
            if (doc.exists) {
                const maquina = doc.data();
                if (maquinaNome) maquinaNome.value = maquina.nome;
                if (maquinaModelo) maquinaModelo.value = maquina.modelo;
                if (maquinaFabricante) maquinaFabricante.value = maquina.fabricante;
                if (maquinaDataAquisicao) maquinaDataAquisicao.value = maquina.dataAquisicao;
                if (maquinaStatus) maquinaStatus.value = maquina.status;
                
                editandoMaquinaId = id;
                if (maquinaSalvar) maquinaSalvar.textContent = 'Atualizar';
                
                // Rolar para o formulário
                const formularioHeading = document.querySelector('#maquinas h3');
                if (formularioHeading) {
                    formularioHeading.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }).catch(error => {
            console.error("Erro ao carregar máquina para edição:", error);
        });
    };
    
    window.excluirMaquina = function(id) {
        if (confirm('Tem certeza que deseja excluir esta máquina? Esta ação não pode ser desfeita.')) {
            maquinasRef.doc(id).delete()
                .then(() => {
                    carregarMaquinas();
                    atualizarDashboard();
                    alert('Máquina excluída com sucesso!');
                })
                .catch(error => {
                    console.error("Erro ao excluir máquina:", error);
                    alert('Erro ao excluir máquina. Tente novamente.');
                });
        }
    };
    
    // Funções para Operações
    function carregarOperacoes() {
        console.log("Tentando carregar operações do Firebase...");
        operacoesRef.get().then((snapshot) => {
            if (!operacoesList) return;
            
            if (snapshot.empty) {
                operacoesList.innerHTML = '<p class="empty-message">Nenhuma operação registrada.</p>';
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const operacao = doc.data();
                html += `
                    <div class="list-item" data-id="${doc.id}">
                        <h4>${operacao.tipo}</h4>
                        <p><strong>Máquina:</strong> <span class="maquina-nome" data-id="${operacao.maquinaId}">Carregando...</span></p>
                        <p><strong>Data:</strong> ${formatarData(operacao.data)}</p>
                        <p><strong>Duração:</strong> ${operacao.duracao} horas</p>
                        <p><strong>Operador:</strong> ${operacao.operador}</p>
                        <p><strong>Observações:</strong> ${operacao.observacoes || 'Nenhuma'}</p>
                        <div class="actions">
                            <button class="edit-btn" onclick="editarOperacao('${doc.id}')">Editar</button>
                            <button class="delete-btn" onclick="excluirOperacao('${doc.id}')">Excluir</button>
                        </div>
                    </div>
                `;
            });
            
            operacoesList.innerHTML = html;
            
            // Carregar nomes das máquinas
            document.querySelectorAll('.maquina-nome').forEach(span => {
                const maquinaId = span.getAttribute('data-id');
                maquinasRef.doc(maquinaId).get().then(doc => {
                    if (doc.exists) {
                        span.textContent = doc.data().nome;
                    } else {
                        span.textContent = 'Máquina não encontrada';
                    }
                }).catch(error => {
                    console.error("Erro ao carregar nome da máquina:", error);
                    span.textContent = 'Erro ao carregar';
                });
            });
        }).catch(error => {
            console.error("Erro ao carregar operações:", error);
            if (operacoesList) {
                operacoesList.innerHTML = '<p class="empty-message">Erro ao carregar operações. Verifique o console para mais detalhes.</p>';
            }
        });
    }
    
    // Salvar operação
    if (operacaoSalvar) {
        const operacaoData = {
            maquinaId,
            tipo,
            data,
            duracao,
            operador,
            observacoes,
            dataCadastro: new Date().toISOString()
        };
        
        operacaoSalvar.addEventListener('click', function() {
            const maquinaId = operacaoMaquina.value;
            const tipo = operacaoTipo.value.trim();
            const data = operacaoData.value;
            const duracao = operacaoDuracao.value;
            const operador = operacaoOperador.value.trim();
            const observacoes = operacaoObservacoes.value.trim();
            
            if (!maquinaId || !tipo || !data || !duracao || !operador) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            
            
            if (editandoOperacaoId) {
                // Atualizar operação existente
                operacoesRef.doc(editandoOperacaoId).update(operacaoData)
                    .then(() => {
                        limparFormularioOperacao();
                        carregarOperacoes();
                        atualizarDashboard();
                        alert('Operação atualizada com sucesso!');
                    })
                    .catch(error => {
                        console.error("Erro ao atualizar operação:", error);
                        alert('Erro ao atualizar operação. Tente novamente.');
                    });
            } else {
                // Adicionar nova operação
                operacoesRef.add(operacaoData)
                    .then(() => {
                        limparFormularioOperacao();
                        carregarOperacoes();
                        atualizarDashboard();
                        alert('Operação adicionada com sucesso!');
                    })
                    .catch(error => {
                        console.error("Erro ao adicionar operação:", error);
                        alert('Erro ao adicionar operação. Tente novamente.');
                    });
            }
        });
    }
    
    function limparFormularioOperacao() {
        if (operacaoMaquina) operacaoMaquina.value = '';
        if (operacaoTipo) operacaoTipo.value = '';
        if (operacaoData) operacaoData.value = '';
        if (operacaoDuracao) operacaoDuracao.value = '';
        if (operacaoOperador) operacaoOperador.value = '';
        if (operacaoObservacoes) operacaoObservacoes.value = '';
        editandoOperacaoId = null;
        if (operacaoSalvar) operacaoSalvar.textContent = 'Salvar';
    }
    
    // Funções para editar e excluir operação
    window.editarOperacao = function(id) {
        operacoesRef.doc(id).get().then(doc => {
            if (doc.exists) {
                const operacao = doc.data();
                if (operacaoMaquina) operacaoMaquina.value = operacao.maquinaId;
                if (operacaoTipo) operacaoTipo.value = operacao.tipo;
                if (operacaoData) operacaoData.value = operacao.data;
                if (operacaoDuracao) operacaoDuracao.value = operacao.duracao;
                if (operacaoOperador) operacaoOperador.value = operacao.operador;
                if (operacaoObservacoes) operacaoObservacoes.value = operacao.observacoes || '';
                
                editandoOperacaoId = id;
                if (operacaoSalvar) operacaoSalvar.textContent = 'Atualizar';
                
                // Rolar para o formulário
                const formularioHeading = document.querySelector('#operacoes h3');
                if (formularioHeading) {
                    formularioHeading.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }).catch(error => {
            console.error("Erro ao carregar operação para edição:", error);
        });
    };
    
    window.excluirOperacao = function(id) {
        if (confirm('Tem certeza que deseja excluir esta operação? Esta ação não pode ser desfeita.')) {
            operacoesRef.doc(id).delete()
                .then(() => {
                    carregarOperacoes();
                    atualizarDashboard();
                    alert('Operação excluída com sucesso!');
                })
                .catch(error => {
                    console.error("Erro ao excluir operação:", error);
                    alert('Erro ao excluir operação. Tente novamente.');
                });
        }
    };
    
    // Funções para Peças
    function carregarPecas() {
        pecasRef.get().then((snapshot) => {
            if (!pecasList) return;
            
            if (snapshot.empty) {
                pecasList.innerHTML = '<p class="empty-message">Nenhuma peça cadastrada.</p>';
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const peca = doc.data();
                html += `
                    <div class="list-item" data-id="${doc.id}">
                        <h4>${peca.nome} (${peca.codigo})</h4>
                        <p><strong>Máquina Compatível:</strong> <span class="maquina-nome" data-id="${peca.maquinaId}">Carregando...</span></p>
                        <p><strong>Vida Útil:</strong> ${peca.vidaUtil} horas</p>
                        <p><strong>Última Troca:</strong> ${formatarData(peca.ultimaTroca)}</p>
                        <p><strong>Estoque:</strong> ${peca.estoque} unidades</p>
                        <div class="actions">
                            <button class="edit-btn" onclick="editarPeca('${doc.id}')">Editar</button>
                            <button class="delete-btn" onclick="excluirPeca('${doc.id}')">Excluir</button>
                        </div>
                    </div>
                `;
            });
            
            pecasList.innerHTML = html;
            
            // Carregar nomes das máquinas
            document.querySelectorAll('.maquina-nome').forEach(span => {
                const maquinaId = span.getAttribute('data-id');
                maquinasRef.doc(maquinaId).get().then(doc => {
                    if (doc.exists) {
                        span.textContent = doc.data().nome;
                    } else {
                        span.textContent = 'Máquina não encontrada';
                    }
                }).catch(error => {
                    console.error("Erro ao carregar nome da máquina:", error);
                    span.textContent = 'Erro ao carregar';
                });
            });
            
            // Verificar peças com vida útil próxima do fim
            verificarAlertasPecas();
        }).catch(error => {
            console.error("Erro ao carregar peças:", error);
            if (pecasList) {
                pecasList.innerHTML = '<p class="empty-message">Erro ao carregar peças. Verifique o console para mais detalhes.</p>';
            }
        });
    }
    
    // Salvar peça
    if (pecaSalvar) {
        pecaSalvar.addEventListener('click', function() {
            const nome = pecaNome.value.trim();
            const codigo = pecaCodigo.value.trim();
            const maquinaId = pecaMaquina.value;
            const vidaUtil = pecaVidaUtil.value;
            const ultimaTroca = pecaUltimaTroca.value;
            const estoque = pecaEstoque.value;
            
            if (!nome || !codigo || !maquinaId || !vidaUtil || !ultimaTroca || !estoque) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const pecaData = {
                nome,
                codigo,
                maquinaId,
                vidaUtil,
                ultimaTroca,
                estoque,
                dataCadastro: new Date().toISOString()
            };
            
            if (editandoPecaId) {
                // Atualizar peça existente
                pecasRef.doc(editandoPecaId).update(pecaData)
                    .then(() => {
                        limparFormularioPeca();
                        carregarPecas();
                        atualizarDashboard();
                        alert('Peça atualizada com sucesso!');
                    })
                    .catch(error => {
                        console.error("Erro ao atualizar peça:", error);
                        alert('Erro ao atualizar peça. Tente novamente.');
                    });
            } else {
                // Adicionar nova peça
                pecasRef.add(pecaData)
                    .then(() => {
                        limparFormularioPeca();
                        carregarPecas();
                        atualizarDashboard();
                        alert('Peça adicionada com sucesso!');
                    })
                    .catch(error => {
                        console.error("Erro ao adicionar peça:", error);
                        alert('Erro ao adicionar peça. Tente novamente.');
                    });
            }
        });
    }
    
    function limparFormularioPeca() {
        if (pecaNome) pecaNome.value = '';
        if (pecaCodigo) pecaCodigo.value = '';
        if (pecaMaquina) pecaMaquina.value = '';
        if (pecaVidaUtil) pecaVidaUtil.value = '';
        if (pecaUltimaTroca) pecaUltimaTroca.value = '';
        if (pecaEstoque) pecaEstoque.value = '';
        editandoPecaId = null;
        if (pecaSalvar) pecaSalvar.textContent = 'Salvar';
    }
    
    // Funções para editar e excluir peça
    window.editarPeca = function(id) {
        pecasRef.doc(id).get().then(doc => {
            if (doc.exists) {
                const peca = doc.data();
                if (pecaNome) pecaNome.value = peca.nome;
                if (pecaCodigo) pecaCodigo.value = peca.codigo;
                if (pecaMaquina) pecaMaquina.value = peca.maquinaId;
                if (pecaVidaUtil) pecaVidaUtil.value = peca.vidaUtil;
                if (pecaUltimaTroca) pecaUltimaTroca.value = peca.ultimaTroca;
                if (pecaEstoque) pecaEstoque.value = peca.estoque;
                
                editandoPecaId = id;
                if (pecaSalvar) pecaSalvar.textContent = 'Atualizar';
                
                // Rolar para o formulário
                const formularioHeading = document.querySelector('#pecas h3');
                if (formularioHeading) {
                    formularioHeading.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }).catch(error => {
            console.error("Erro ao carregar peça para edição:", error);
        });
    };
    
    window.excluirPeca = function(id) {
        if (confirm('Tem certeza que deseja excluir esta peça? Esta ação não pode ser desfeita.')) {
            pecasRef.doc(id).delete()
                .then(() => {
                    carregarPecas();
                    atualizarDashboard();
                    alert('Peça excluída com sucesso!');
                })
                .catch(error => {
                    console.error("Erro ao excluir peça:", error);
                    alert('Erro ao excluir peça. Tente novamente.');
                });
        }
    };
    
    // Funções para Manutenções
    function carregarManutencoes() {
        console.log("Tentando carregar manutencao do Firebase...");
        manutencoesRef.get().then((snapshot) => {
            if (!manutencoesList) return;
            
            if (snapshot.empty) {
                manutencoesList.innerHTML = '<p class="empty-message">Nenhuma manutenção registrada.</p>';
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const manutencao = doc.data();
                html += `
                    <div class="list-item" data-id="${doc.id}">
                        <h4>Manutenção ${manutencao.tipo}</h4>
                        <p><strong>Máquina:</strong> <span class="maquina-nome" data-id="${manutencao.maquinaId}">Carregando...</span></p>
                        <p><strong>Data:</strong> ${formatarData(manutencao.data)}</p>
                        <p><strong>Responsável:</strong> ${manutencao.responsavel}</p>
                        <p><strong>Descrição:</strong> ${manutencao.descricao || 'Nenhuma'}</p>
                        <p><strong>Custo:</strong> R$ ${manutencao.custo}</p>
                        <div class="actions">
                            <button class="edit-btn" onclick="editarManutencao('${doc.id}')">Editar</button>
                            <button class="delete-btn" onclick="excluirManutencao('${doc.id}')">Excluir</button>
                        </div>
                    </div>
                `;
            });
            
            manutencoesList.innerHTML = html;
            
            // Carregar nomes das máquinas
            document.querySelectorAll('.maquina-nome').forEach(span => {
                const maquinaId = span.getAttribute('data-id');
                maquinasRef.doc(maquinaId).get().then(doc => {
                    if (doc.exists) {
                        span.textContent = doc.data().nome;
                    } else {
                        span.textContent = 'Máquina não encontrada';
                    }
                }).catch(error => {
                    console.error("Erro ao carregar nome da máquina:", error);
                    span.textContent = 'Erro ao carregar';
                });
            });
            
            // Verificar próximas manutenções preventivas
            verificarAlertasManutencoes();
        }).catch(error => {
            console.error("Erro ao carregar manutenções:", error);
            if (manutencoesList) {
                manutencoesList.innerHTML = '<p class="empty-message">Erro ao carregar manutenções. Verifique o console para mais detalhes.</p>';
            }
        });
    }
    
    // Salvar manutenção
    if (manutencaoSalvar) {
        manutencaoSalvar.addEventListener('click', function() {
            const maquinaId = manutencaoMaquina.value;
            const tipo = manutencaoTipo.value;
            const data = manutencaoData.value;
            const responsavel = manutencaoResponsavel.value.trim();
            const descricao = manutencaoDescricao.value.trim();
            const custo = manutencaoCusto.value;
            
            if (!maquinaId || !tipo || !data || !responsavel || !custo) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const manutencaoData = {
                maquinaId,
                tipo,
                data,
                responsavel,
                descricao,
                custo,
                dataCadastro: new Date().toISOString()
            };
            
            if (editandoManutencaoId) {
                // Atualizar manutenção existente
                manutencoesRef.doc(editandoManutencaoId).update(manutencaoData)
                    .then(() => {
                        limparFormularioManutencao();
                        carregarManutencoes();
                        atualizarDashboard();
                        alert('Manutenção atualizada com sucesso!');
                    })
                    .catch(error => {
                        console.error("Erro ao atualizar manutenção:", error);
                        alert('Erro ao atualizar manutenção. Tente novamente.');
                    });
            } else {
                // Adicionar nova manutenção
                manutencoesRef.add(manutencaoData)
                    .then(() => {
                        limparFormularioManutencao();
                        carregarManutencoes();
                        atualizarDashboard();
                        alert('Manutenção adicionada com sucesso!');
                    })
                    .catch(error => {
                        console.error("Erro ao adicionar manutenção:", error);
                        alert('Erro ao adicionar manutenção. Tente novamente.');
                    });
            }
        });
    }
    
    function limparFormularioManutencao() {
        if (manutencaoMaquina) manutencaoMaquina.value = '';
        if (manutencaoTipo) manutencaoTipo.value = 'Preventiva';
        if (manutencaoData) manutencaoData.value = '';
        if (manutencaoResponsavel) manutencaoResponsavel.value = '';
        if (manutencaoDescricao) manutencaoDescricao.value = '';
        if (manutencaoCusto) manutencaoCusto.value = '';
        editandoManutencaoId = null;
        if (manutencaoSalvar) manutencaoSalvar.textContent = 'Salvar';
    }
    
    // Funções para editar e excluir manutenção
    window.editarManutencao = function(id) {
        manutencoesRef.doc(id).get().then(doc => {
            if (doc.exists) {
                const manutencao = doc.data();
                if (manutencaoMaquina) manutencaoMaquina.value = manutencao.maquinaId;
                if (manutencaoTipo) manutencaoTipo.value = manutencao.tipo;
                if (manutencaoData) manutencaoData.value = manutencao.data;
                if (manutencaoResponsavel) manutencaoResponsavel.value = manutencao.responsavel;
                if (manutencaoDescricao) manutencaoDescricao.value = manutencao.descricao || '';
                if (manutencaoCusto) manutencaoCusto.value = manutencao.custo;
                
                editandoManutencaoId = id;
                if (manutencaoSalvar) manutencaoSalvar.textContent = 'Atualizar';
                
                // Rolar para o formulário
                const formularioHeading = document.querySelector('#manutencoes h3');
                if (formularioHeading) {
                    formularioHeading.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }).catch(error => {
            console.error("Erro ao carregar manutenção para edição:", error);
        });
    };
    
    window.excluirManutencao = function(id) {
        if (confirm('Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita.')) {
            manutencoesRef.doc(id).delete()
                .then(() => {
                    carregarManutencoes();
                    atualizarDashboard();
                    alert('Manutenção excluída com sucesso!');
                })
                .catch(error => {
                    console.error("Erro ao excluir manutenção:", error);
                    alert('Erro ao excluir manutenção. Tente novamente.');
                });
        }
    };
    
    // Funções para Alertas
    function carregarAlertas() {
        alertasRef.get().then((snapshot) => {
            if (!alertasList || !alertasRecentesList) return;
            
            if (snapshot.empty) {
                alertasList.innerHTML = '<p class="empty-message">Nenhum alerta ativo.</p>';
                alertasRecentesList.innerHTML = '<p class="empty-message">Nenhum alerta recente.</p>';
                return;
            }
            
            let html = '';
            let htmlRecentes = '';
            let count = 0;
            
            snapshot.forEach(doc => {
                const alerta = doc.data();
                const alertaHtml = `
                    <div class="alert-item ${alerta.prioridade === 'Alta' ? 'high' : ''}" data-id="${doc.id}">
                        <h4>${alerta.titulo}</h4>
                        <p><strong>Descrição:</strong> ${alerta.descricao}</p>
                        <p><strong>Data:</strong> ${formatarData(alerta.data)}</p>
                        <p><strong>Prioridade:</strong> ${alerta.prioridade}</p>
                        <div class="actions">
                            <button class="delete-btn" onclick="resolverAlerta('${doc.id}')">Marcar como Resolvido</button>
                        </div>
                    </div>
                `;
                
                html += alertaHtml;
                
                // Adicionar aos alertas recentes (máximo 3)
                if (count < 3) {
                    htmlRecentes += alertaHtml;
                    count++;
                }
            });
            
            alertasList.innerHTML = html;
            alertasRecentesList.innerHTML = htmlRecentes || '<p class="empty-message">Nenhum alerta recente.</p>';
        }).catch(error => {
            console.error("Erro ao carregar alertas:", error);
            if (alertasList) {
                alertasList.innerHTML = '<p class="empty-message">Erro ao carregar alertas. Verifique o console para mais detalhes.</p>';
            }
            if (alertasRecentesList) {
                alertasRecentesList.innerHTML = '<p class="empty-message">Erro ao carregar alertas. Verifique o console para mais detalhes.</p>';
            }
        });
    }
    
    // Resolver alerta
    window.resolverAlerta = function(id) {
        if (confirm('Marcar este alerta como resolvido? Ele será removido da lista.')) {
            alertasRef.doc(id).delete()
                .then(() => {
                    carregarAlertas();
                    atualizarDashboard();
                    alert('Alerta marcado como resolvido!');
                })
                .catch(error => {
                    console.error("Erro ao resolver alerta:", error);
                    alert('Erro ao resolver alerta. Tente novamente.');
                });
        }
    };
    
    // Verificar alertas para peças
    function verificarAlertasPecas() {
        pecasRef.get().then((snapshot) => {
            snapshot.forEach(doc => {
                const peca = doc.data();
                const ultimaTroca = new Date(peca.ultimaTroca);
                const hoje = new Date();
                
                // Calcular horas de uso desde a última troca
                const horasUso = calcularHorasUso(peca.maquinaId, ultimaTroca);
                
                // Verificar se está próximo da vida útil
                if (horasUso >= peca.vidaUtil * 0.8) {
                    // Verificar se já existe um alerta para esta peça
                    alertasRef.where('tipo', '==', 'peca')
                        .where('referenciaId', '==', doc.id)
                        .get()
                        .then((alertaSnapshot) => {
                            if (alertaSnapshot.empty) {
                                // Criar alerta
                                const prioridade = horasUso >= peca.vidaUtil ? 'Alta' : 'Média';
                                const percentual = Math.round((horasUso / peca.vidaUtil) * 100);
                                
                                alertasRef.add({
                                    tipo: 'peca',
                                    referenciaId: doc.id,
                                    titulo: `Troca de Peça: ${peca.nome}`,
                                    descricao: `A peça ${peca.nome} (${peca.codigo}) atingiu ${percentual}% da sua vida útil. Considere programar uma substituição.`,
                                    data: new Date().toISOString().split('T')[0],
                                    prioridade: prioridade
                                }).then(() => {
                                    carregarAlertas();
                                    atualizarDashboard();
                                }).catch(error => {
                                    console.error("Erro ao criar alerta de peça:", error);
                                });
                            }
                        }).catch(error => {
                            console.error("Erro ao verificar alertas existentes:", error);
                        });
                }
                
                // Verificar estoque baixo
                if (peca.estoque <= 1) {
                    // Verificar se já existe um alerta para estoque desta peça
                    alertasRef.where('tipo', '==', 'estoque')
                        .where('referenciaId', '==', doc.id)
                        .get()
                        .then((alertaSnapshot) => {
                            if (alertaSnapshot.empty) {
                                // Criar alerta
                                alertasRef.add({
                                    tipo: 'estoque',
                                    referenciaId: doc.id,
                                    titulo: `Estoque Baixo: ${peca.nome}`,
                                    descricao: `O estoque da peça ${peca.nome} (${peca.codigo}) está baixo (${peca.estoque} unidades). Considere adquirir mais unidades.`,
                                    data: new Date().toISOString().split('T')[0],
                                    prioridade: peca.estoque === 0 ? 'Alta' : 'Média'
                                }).then(() => {
                                    carregarAlertas();
                                    atualizarDashboard();
                                }).catch(error => {
                                    console.error("Erro ao criar alerta de estoque:", error);
                                });
                            }
                        }).catch(error => {
                            console.error("Erro ao verificar alertas de estoque existentes:", error);
                        });
                }
            });
        }).catch(error => {
            console.error("Erro ao verificar peças para alertas:", error);
        });
    }
    
    // Verificar alertas para manutenções
    function verificarAlertasManutencoes() {
        // Obter a última manutenção preventiva de cada máquina
        maquinasRef.get().then((snapshot) => {
            snapshot.forEach(maquinaDoc => {
                const maquinaId = maquinaDoc.id;
                const maquina = maquinaDoc.data();
                
                manutencoesRef.where('maquinaId', '==', maquinaId)
                    .where('tipo', '==', 'Preventiva')
                    .orderBy('data', 'desc')
                    .limit(1)
                    .get()
                    .then((manutencaoSnapshot) => {
                        if (!manutencaoSnapshot.empty) {
                            const ultimaManutencao = manutencaoSnapshot.docs[0].data();
                            const dataUltimaManutencao = new Date(ultimaManutencao.data);
                            const hoje = new Date();
                            
                            // Calcular dias desde a última manutenção
                            const diasDesdeUltimaManutencao = Math.floor((hoje - dataUltimaManutencao) / (1000 * 60 * 60 * 24));
                            
                            // Se passaram mais de 90 dias desde a última manutenção preventiva
                            if (diasDesdeUltimaManutencao >= 90) {
                                // Verificar se já existe um alerta para esta máquina
                                alertasRef.where('tipo', '==', 'manutencao')
                                    .where('referenciaId', '==', maquinaId)
                                    .get()
                                    .then((alertaSnapshot) => {
                                        if (alertaSnapshot.empty) {
                                            // Criar alerta
                                            const prioridade = diasDesdeUltimaManutencao >= 120 ? 'Alta' : 'Média';
                                            
                                            alertasRef.add({
                                                tipo: 'manutencao',
                                                referenciaId: maquinaId,
                                                titulo: `Manutenção Preventiva: ${maquina.nome}`,
                                                descricao: `A máquina ${maquina.nome} está há ${diasDesdeUltimaManutencao} dias sem manutenção preventiva. Recomenda-se agendar uma manutenção.`,
                                                data: new Date().toISOString().split('T')[0],
                                                prioridade: prioridade
                                            }).then(() => {
                                                carregarAlertas();
                                                atualizarDashboard();
                                            }).catch(error => {
                                                console.error("Erro ao criar alerta de manutenção:", error);
                                            });
                                        }
                                    }).catch(error => {
                                        console.error("Erro ao verificar alertas de manutenção existentes:", error);
                                    });
                            }
                        } else {
                            // Nunca teve manutenção preventiva
                            alertasRef.where('tipo', '==', 'manutencao')
                                .where('referenciaId', '==', maquinaId)
                                .get()
                                .then((alertaSnapshot) => {
                                    if (alertaSnapshot.empty) {
                                        // Criar alerta
                                        alertasRef.add({
                                            tipo: 'manutencao',
                                            referenciaId: maquinaId,
                                            titulo: `Manutenção Preventiva: ${maquina.nome}`,
                                            descricao: `A máquina ${maquina.nome} nunca passou por manutenção preventiva. Recomenda-se agendar uma manutenção.`,
                                            data: new Date().toISOString().split('T')[0],
                                            prioridade: 'Alta'
                                        }).then(() => {
                                            carregarAlertas();
                                            atualizarDashboard();
                                        }).catch(error => {
                                            console.error("Erro ao criar alerta de primeira manutenção:", error);
                                        });
                                    }
                                }).catch(error => {
                                    console.error("Erro ao verificar alertas de primeira manutenção:", error);
                                });
                        }
                    }).catch(error => {
                        console.error("Erro ao verificar última manutenção:", error);
                    });
            });
        }).catch(error => {
            console.error("Erro ao verificar máquinas para alertas de manutenção:", error);
        });
    }
    
    // Função para calcular horas de uso de uma máquina desde uma data
    function calcularHorasUso(maquinaId, dataInicio) {
        // Implementação simplificada - em um sistema real, isso seria calculado com base nas operações registradas
        return 100; // Valor fictício para demonstração
    }
    
    // Atualizar contadores do dashboard
    function atualizarDashboard() {
        console.log("Atualizando dashboard...");
        
        // Contar máquinas
        maquinasRef.get().then((snapshot) => {
            if (maquinasCount) maquinasCount.textContent = snapshot.size;
        }).catch(error => {
            console.error("Erro ao contar máquinas:", error);
            if (maquinasCount) maquinasCount.textContent = "Erro";
        });
        
        // Contar operações
        operacoesRef.get().then((snapshot) => {
            if (operacoesCount) operacoesCount.textContent = snapshot.size;
        }).catch(error => {
            console.error("Erro ao contar operações:", error);
            if (operacoesCount) operacoesCount.textContent = "Erro";
        });
        
        // Contar peças
        pecasRef.get().then((snapshot) => {
            if (pecasCount) pecasCount.textContent = snapshot.size;
        }).catch(error => {
            console.error("Erro ao contar peças:", error);
            if (pecasCount) pecasCount.textContent = "Erro";
        });
        
        // Contar manutenções
        manutencoesRef.get().then((snapshot) => {
            if (manutencoesCount) manutencoesCount.textContent = snapshot.size;
        }).catch(error => {
            console.error("Erro ao contar manutenções:", error);
            if (manutencoesCount) manutencoesCount.textContent = "Erro";
        });
        
        // Contar alertas
        alertasRef.get().then((snapshot) => {
            if (alertasCount) alertasCount.textContent = snapshot.size;
        }).catch(error => {
            console.error("Erro ao contar alertas:", error);
            if (alertasCount) alertasCount.textContent = "Erro";
        });
    }
    
    // Função para formatar data
    function formatarData(dataString) {
        if (!dataString) return 'N/A';
        
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }
    
    // Definir data atual nos campos de data
    const hoje = new Date().toISOString().split('T')[0];
    if (maquinaDataAquisicao) maquinaDataAquisicao.value = hoje;
    if (operacaoData) operacaoData.value = hoje;
    if (pecaUltimaTroca) pecaUltimaTroca.value = hoje;
    if (manutencaoData) manutencaoData.value = hoje;
    
    // CORREÇÃO: Chamar carregarDados explicitamente na inicialização
    // Isso garante que os dados sejam carregados mesmo se a verificação de login já tiver ocorrido
    setTimeout(function() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            window.carregarDados();
        }
    }, 500);
});
