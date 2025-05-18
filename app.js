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
    
    // Função para carregar todos os dados
    function carregarDados() {
        carregarMaquinas();
        carregarOperacoes();
        carregarPecas();
        carregarManutencoes();
        carregarAlertas();
        atualizarDashboard();
    }
    
    // Funções para Máquinas
    function carregarMaquinas() {
        maquinasRef.get().then((snapshot) => {
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
        });
    }
    
    function atualizarSelectsMaquinas() {
        // Limpar selects
        operacaoMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        pecaMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        manutencaoMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        
        // Preencher com máquinas cadastradas
        maquinasRef.get().then((snapshot) => {
            snapshot.forEach(doc => {
                const maquina = doc.data();
                const option = `<option value="${doc.id}">${maquina.nome}</option>`;
                
                operacaoMaquina.innerHTML += option;
                pecaMaquina.innerHTML += option;
                manutencaoMaquina.innerHTML += option;
            });
        }).catch(error => {
            console.error("Erro ao atualizar selects de máquinas:", error);
        });
    }
    
    // Salvar máquina
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
            dataCadastro: new Date()
        };
        
        if (editandoMaquinaId) {
            // Atualizar máquina existente
            maquinasRef.doc(editandoMaquinaId).update(maquinaData)
                .then(() => {
                    limparFormularioMaquina();
                    carregarMaquinas();
                    atualizarDashboard();
                    alert('Máquina atualizada com sucesso!');
                })
                .catch(error => {
                    console.error("Erro ao atualizar máquina:", error);
                    alert('Erro ao atualizar máquina1. Tente novamente.');
                });
        } else {
            // Adicionar nova máquina
            console.log("dados enviados:",maquinaData);
            console.log("dados enviados:",maquinasRef);
            console.log("dados enviados:",error);
        maquinasRef.add(maquinaData)
            maquinasRef.add(maquinaData)
                .then(() => {
                    limparFormularioMaquina();
                    carregarMaquinas();
                    atualizarDashboard();
                    alert('Máquina adicionada com sucesso!');
                })
                .catch(error => {
                    console.error("Erro ao adicionar máquina:", error);
                    alert('Erro ao adicionar máquina2. Tente novamente.');
                });
        }
    });
    
    function limparFormularioMaquina() {
        maquinaNome.value = '';
        maquinaModelo.value = '';
        maquinaFabricante.value = '';
        maquinaDataAquisicao.value = '';
        maquinaStatus.value = 'Ativa';
        editandoMaquinaId = null;
        maquinaSalvar.textContent = 'Salvar';
    }
    
    // Funções para editar e excluir máquina
    window.editarMaquina = function(id) {
        maquinasRef.doc(id).get().then(doc => {
            if (doc.exists) {
                const maquina = doc.data();
                maquinaNome.value = maquina.nome;
                maquinaModelo.value = maquina.modelo;
                maquinaFabricante.value = maquina.fabricante;
                maquinaDataAquisicao.value = maquina.dataAquisicao;
                maquinaStatus.value = maquina.status;
                
                editandoMaquinaId = id;
                maquinaSalvar.textContent = 'Atualizar';
                
                // Rolar para o formulário
                document.querySelector('#maquinas h3').scrollIntoView({ behavior: 'smooth' });
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
        operacoesRef.get().then((snapshot) => {
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
        });
    }
    
    // Salvar operação
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
        
        const operacaoData = {
            maquinaId,
            tipo,
            data,
            duracao,
            operador,
            observacoes,
            dataCadastro: new Date()
        };
        
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
    
    function limparFormularioOperacao() {
        operacaoMaquina.value = '';
        operacaoTipo.value = '';
        operacaoData.value = '';
        operacaoDuracao.value = '';
        operacaoOperador.value = '';
        operacaoObservacoes.value = '';
        editandoOperacaoId = null;
        operacaoSalvar.textContent = 'Salvar';
    }
    
    // Funções para editar e excluir operação
    window.editarOperacao = function(id) {
        operacoesRef.doc(id).get().then(doc => {
            if (doc.exists) {
                const operacao = doc.data();
                operacaoMaquina.value = operacao.maquinaId;
                operacaoTipo.value = operacao.tipo;
                operacaoData.value = operacao.data;
                operacaoDuracao.value = operacao.duracao;
                operacaoOperador.value = operacao.operador;
                operacaoObservacoes.value = operacao.observacoes || '';
                
                editandoOperacaoId = id;
                operacaoSalvar.textContent = 'Atualizar';
                
                // Rolar para o formulário
                document.querySelector('#operacoes h3').scrollIntoView({ behavior: 'smooth' });
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
        });
    }
    
    // Salvar peça
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
            dataCadastro: new Date()
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
    
    function limparFormularioPeca() {
        pecaNome.value = '';
        pecaCodigo.value = '';
        pecaMaquina.value = '';
        pecaVidaUtil.value = '';
        pecaUltimaTroca.value = '';
        pecaEstoque.value = '';
        editandoPecaId = null;
        pecaSalvar.textContent = 'Salvar';
    }
    
    // Funções para editar e excluir peça
    window.editarPeca = function(id) {
        pecasRef.doc(id).get().then(doc => {
            if (doc.exists) {
                const peca = doc.data();
                pecaNome.value = peca.nome;
                pecaCodigo.value = peca.codigo;
                pecaMaquina.value = peca.maquinaId;
                pecaVidaUtil.value = peca.vidaUtil;
                pecaUltimaTroca.value = peca.ultimaTroca;
                pecaEstoque.value = peca.estoque;
                
                editandoPecaId = id;
                pecaSalvar.textContent = 'Atualizar';
                
                // Rolar para o formulário
                document.querySelector('#pecas h3').scrollIntoView({ behavior: 'smooth' });
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
        manutencoesRef.get().then((snapshot) => {
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
        });
    }
    
    // Salvar manutenção
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
            dataCadastro: new Date()
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
    
    function limparFormularioManutencao() {
        manutencaoMaquina.value = '';
        manutencaoTipo.value = 'Preventiva';
        manutencaoData.value = '';
        manutencaoResponsavel.value = '';
        manutencaoDescricao.value = '';
        manutencaoCusto.value = '';
        editandoManutencaoId = null;
        manutencaoSalvar.textContent = 'Salvar';
    }
    
    // Funções para editar e excluir manutenção
    window.editarManutencao = function(id) {
        manutencoesRef.doc(id).get().then(doc => {
            if (doc.exists) {
                const manutencao = doc.data();
                manutencaoMaquina.value = manutencao.maquinaId;
                manutencaoTipo.value = manutencao.tipo;
                manutencaoData.value = manutencao.data;
                manutencaoResponsavel.value = manutencao.responsavel;
                manutencaoDescricao.value = manutencao.descricao || '';
                manutencaoCusto.value = manutencao.custo;
                
                editandoManutencaoId = id;
                manutencaoSalvar.textContent = 'Atualizar';
                
                // Rolar para o formulário
                document.querySelector('#manutencoes h3').scrollIntoView({ behavior: 'smooth' });
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
                                });
                            }
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
                                });
                            }
                        });
                }
            });
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
                                            });
                                        }
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
                                        });
                                    }
                                });
                        }
                    });
            });
        });
    }
    
    // Função para calcular horas de uso de uma máquina desde uma data
    function calcularHorasUso(maquinaId, dataInicio) {
        // Implementação simplificada - em um sistema real, isso seria calculado com base nas operações registradas
        return 100; // Valor fictício para demonstração
    }
    
    // Atualizar contadores do dashboard
    function atualizarDashboard() {
        // Contar máquinas
        maquinasRef.get().then((snapshot) => {
            maquinasCount.textContent = snapshot.size;
        });
        
        // Contar operações
        operacoesRef.get().then((snapshot) => {
            operacoesCount.textContent = snapshot.size;
        });
        
        // Contar peças
        pecasRef.get().then((snapshot) => {
            pecasCount.textContent = snapshot.size;
        });
        
        // Contar manutenções
        manutencoesRef.get().then((snapshot) => {
            manutencoesCount.textContent = snapshot.size;
        });
        
        // Contar alertas
        alertasRef.get().then((snapshot) => {
            alertasCount.textContent = snapshot.size;
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
});
