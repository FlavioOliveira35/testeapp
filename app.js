// Funcionalidades principais do aplicativo - Versão modular ES6
import { 
  db, 
  maquinasCollection, 
  operacoesCollection, 
  pecasCollection, 
  manutencoesCollection, 
  alertasCollection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'config.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando aplicativo com Firebase modular...");
    
    // Verificar se o Firebase está disponível
    if (!db) {
        console.error("Firestore não está disponível!");
        alert("Erro: Firebase não está carregado corretamente. Verifique a conexão com a internet e recarregue a página.");
        return;
    }
    
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
    
    // Tornar a função carregarDados global para que auth.js possa acessá-la
    window.carregarDados = async function() {
        console.log("Carregando dados do Firebase...");
        await carregarMaquinas();
        await carregarOperacoes();
        await carregarPecas();
        await carregarManutencoes();
        await carregarAlertas();
        await atualizarDashboard();
    };
    
    // Funções para Máquinas
    async function carregarMaquinas() {
        console.log("Tentando carregar máquinas do Firebase...");
        try {
            const snapshot = await getDocs(maquinasCollection);
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
            await atualizarSelectsMaquinas();
        } catch (error) {
            console.error("Erro ao carregar máquinas:", error);
            maquinasList.innerHTML = '<p class="empty-message">Erro ao carregar máquinas. Verifique o console para mais detalhes.</p>';
        }
    }
    
    async function atualizarSelectsMaquinas() {
        // Limpar selects
        if (operacaoMaquina) operacaoMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        if (pecaMaquina) pecaMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        if (manutencaoMaquina) manutencaoMaquina.innerHTML = '<option value="">Selecione uma máquina</option>';
        
        try {
            // Preencher com máquinas cadastradas
            const snapshot = await getDocs(maquinasCollection);
            snapshot.forEach(doc => {
                const maquina = doc.data();
                const option = `<option value="${doc.id}">${maquina.nome}</option>`;
                
                if (operacaoMaquina) operacaoMaquina.innerHTML += option;
                if (pecaMaquina) pecaMaquina.innerHTML += option;
                if (manutencaoMaquina) manutencaoMaquina.innerHTML += option;
            });
        } catch (error) {
            console.error("Erro ao atualizar selects de máquinas:", error);
        }
    }
    
    // Salvar máquina
    if (maquinaSalvar) {
        maquinaSalvar.addEventListener('click', async function() {
            console.log("Botão salvar máquina clicado");
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
            
            try {
                if (editandoMaquinaId) {
                    // Atualizar máquina existente
                    const docRef = doc(db, 'maquinas', editandoMaquinaId);
                    await updateDoc(docRef, maquinaData);
                    console.log("Máquina atualizada com sucesso!");
                    limparFormularioMaquina();
                    await carregarMaquinas();
                    await atualizarDashboard();
                    alert('Máquina atualizada com sucesso!');
                } else {
                    // Adicionar nova máquina
                    await addDoc(maquinasCollection, maquinaData);
                    console.log("Máquina adicionada com sucesso!");
                    limparFormularioMaquina();
                    await carregarMaquinas();
                    await atualizarDashboard();
                    alert('Máquina adicionada com sucesso!');
                }
            } catch (error) {
                console.error("Erro ao salvar máquina:", error);
                alert('Erro ao salvar máquina. Tente novamente. Erro: ' + error.message);
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
    window.editarMaquina = async function(id) {
        try {
            const docRef = doc(db, 'maquinas', id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const maquina = docSnap.data();
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
        } catch (error) {
            console.error("Erro ao carregar máquina para edição:", error);
        }
    };
    
    window.excluirMaquina = async function(id) {
        if (confirm('Tem certeza que deseja excluir esta máquina? Esta ação não pode ser desfeita.')) {
            try {
                const docRef = doc(db, 'maquinas', id);
                await deleteDoc(docRef);
                await carregarMaquinas();
                await atualizarDashboard();
                alert('Máquina excluída com sucesso!');
            } catch (error) {
                console.error("Erro ao excluir máquina:", error);
                alert('Erro ao excluir máquina. Tente novamente.');
            }
        }
    };
    
    // Funções para Operações
    async function carregarOperacoes() {
        console.log("Tentando carregar operações do Firebase...");
        try {
            const snapshot = await getDocs(operacoesCollection);
            console.log("Resposta do Firebase para operações:", snapshot.size, "documentos");
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
            document.querySelectorAll('.maquina-nome').forEach(async span => {
                const maquinaId = span.getAttribute('data-id');
                try {
                    const docRef = doc(db, 'maquinas', maquinaId);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        span.textContent = docSnap.data().nome;
                    } else {
                        span.textContent = 'Máquina não encontrada';
                    }
                } catch (error) {
                    console.error("Erro ao carregar nome da máquina:", error);
                    span.textContent = 'Erro ao carregar';
                }
            });
        } catch (error) {
            console.error("Erro ao carregar operações:", error);
            if (operacoesList) {
                operacoesList.innerHTML = '<p class="empty-message">Erro ao carregar operações. Verifique o console para mais detalhes.</p>';
            }
        }
    }
    
    // Salvar operação
    if (operacaoSalvar) {
        console.log("Botão de salvar operação encontrado, adicionando event listener");
        operacaoSalvar.addEventListener('click', async function() {
            console.log("Botão salvar operação clicado");
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
                dataCadastro: new Date().toISOString()
            };
            
            console.log("Tentando salvar operação:", operacaoData);
            
            try {
                if (editandoOperacaoId) {
                    // Atualizar operação existente
                    const docRef = doc(db, 'operacoes', editandoOperacaoId);
                    await updateDoc(docRef, operacaoData);
                    console.log("Operação atualizada com sucesso!");
                    limparFormularioOperacao();
                    await carregarOperacoes();
                    await atualizarDashboard();
                    alert('Operação atualizada com sucesso!');
                } else {
                    // Adicionar nova operação
                    await addDoc(operacoesCollection, operacaoData);
                    console.log("Operação adicionada com sucesso!");
                    limparFormularioOperacao();
                    await carregarOperacoes();
                    await atualizarDashboard();
                    alert('Operação adicionada com sucesso!');
                }
            } catch (error) {
                console.error("Erro ao salvar operação:", error);
                alert('Erro ao salvar operação. Tente novamente. Erro: ' + error.message);
            }
        });
    } else {
        console.error("Botão de salvar operação não encontrado!");
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
    window.editarOperacao = async function(id) {
        try {
            const docRef = doc(db, 'operacoes', id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const operacao = docSnap.data();
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
        } catch (error) {
            console.error("Erro ao carregar operação para edição:", error);
        }
    };
    
    window.excluirOperacao = async function(id) {
        if (confirm('Tem certeza que deseja excluir esta operação? Esta ação não pode ser desfeita.')) {
            try {
                const docRef = doc(db, 'operacoes', id);
                await deleteDoc(docRef);
                await carregarOperacoes();
                await atualizarDashboard();
                alert('Operação excluída com sucesso!');
            } catch (error) {
                console.error("Erro ao excluir operação:", error);
                alert('Erro ao excluir operação. Tente novamente.');
            }
        }
    };
    
    // Funções para Peças
    async function carregarPecas() {
        console.log("Tentando carregar peças do Firebase...");
        try {
            const snapshot = await getDocs(pecasCollection);
            console.log("Resposta do Firebase para peças:", snapshot.size, "documentos");
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
            document.querySelectorAll('.maquina-nome').forEach(async span => {
                const maquinaId = span.getAttribute('data-id');
                try {
                    const docRef = doc(db, 'maquinas', maquinaId);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        span.textContent = docSnap.data().nome;
                    } else {
                        span.textContent = 'Máquina não encontrada';
                    }
                } catch (error) {
                    console.error("Erro ao carregar nome da máquina:", error);
                    span.textContent = 'Erro ao carregar';
                }
            });
            
            // Verificar peças com vida útil próxima do fim
            await verificarAlertasPecas();
        } catch (error) {
            console.error("Erro ao carregar peças:", error);
            if (pecasList) {
                pecasList.innerHTML = '<p class="empty-message">Erro ao carregar peças. Verifique o console para mais detalhes.</p>';
            }
        }
    }
    
    // Salvar peça
    if (pecaSalvar) {
        pecaSalvar.addEventListener('click', async function() {
            console.log("Botão salvar peça clicado");
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
            
            console.log("Tentando salvar peça:", pecaData);
            
            try {
                if (editandoPecaId) {
                    // Atualizar peça existente
                    const docRef = doc(db, 'pecas', editandoPecaId);
                    await updateDoc(docRef, pecaData);
                    console.log("Peça atualizada com sucesso!");
                    limparFormularioPeca();
                    await carregarPecas();
                    await atualizarDashboard();
                    alert('Peça atualizada com sucesso!');
                } else {
                    // Adicionar nova peça
                    await addDoc(pecasCollection, pecaData);
                    console.log("Peça adicionada com sucesso!");
                    limparFormularioPeca();
                    await carregarPecas();
                    await atualizarDashboard();
                    alert('Peça adicionada com sucesso!');
                }
            } catch (error) {
                console.error("Erro ao salvar peça:", error);
                alert('Erro ao salvar peça. Tente novamente. Erro: ' + error.message);
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
    window.editarPeca = async function(id) {
        try {
            const docRef = doc(db, 'pecas', id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const peca = docSnap.data();
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
        } catch (error) {
            console.error("Erro ao carregar peça para edição:", error);
        }
    };
    
    window.excluirPeca = async function(id) {
        if (confirm('Tem certeza que deseja excluir esta peça? Esta ação não pode ser desfeita.')) {
            try {
                const docRef = doc(db, 'pecas', id);
                await deleteDoc(docRef);
                await carregarPecas();
                await atualizarDashboard();
                alert('Peça excluída com sucesso!');
            } catch (error) {
                console.error("Erro ao excluir peça:", error);
                alert('Erro ao excluir peça. Tente novamente.');
            }
        }
    };
    
    // Funções para Manutenções
    async function carregarManutencoes() {
        console.log("Tentando carregar manutenções do Firebase...");
        try {
            const snapshot = await getDocs(manutencoesCollection);
            console.log("Resposta do Firebase para manutenções:", snapshot.size, "documentos");
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
            document.querySelectorAll('.maquina-nome').forEach(async span => {
                const maquinaId = span.getAttribute('data-id');
                try {
                    const docRef = doc(db, 'maquinas', maquinaId);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        span.textContent = docSnap.data().nome;
                    } else {
                        span.textContent = 'Máquina não encontrada';
                    }
                } catch (error) {
                    console.error("Erro ao carregar nome da máquina:", error);
                    span.textContent = 'Erro ao carregar';
                }
            });
            
            // Verificar próximas manutenções preventivas
            await verificarAlertasManutencoes();
        } catch (error) {
            console.error("Erro ao carregar manutenções:", error);
            if (manutencoesList) {
                manutencoesList.innerHTML = '<p class="empty-message">Erro ao carregar manutenções. Verifique o console para mais detalhes.</p>';
            }
        }
    }
    
    // Salvar manutenção
    if (manutencaoSalvar) {
        console.log("Botão de salvar manutenção encontrado, adicionando event listener");
        manutencaoSalvar.addEventListener('click', async function() {
            console.log("Botão salvar manutenção clicado");
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
            
            console.log("Tentando salvar manutenção:", manutencaoData);
            
            try {
                if (editandoManutencaoId) {
                    // Atualizar manutenção existente
                    const docRef = doc(db, 'manutencoes', editandoManutencaoId);
                    await updateDoc(docRef, manutencaoData);
                    console.log("Manutenção atualizada com sucesso!");
                    limparFormularioManutencao();
                    await carregarManutencoes();
                    await atualizarDashboard();
                    alert('Manutenção atualizada com sucesso!');
                } else {
                    // Adicionar nova manutenção
                    await addDoc(manutencoesCollection, manutencaoData);
                    console.log("Manutenção adicionada com sucesso!");
                    limparFormularioManutencao();
                    await carregarManutencoes();
                    await atualizarDashboard();
                    alert('Manutenção adicionada com sucesso!');
                }
            } catch (error) {
                console.error("Erro ao salvar manutenção:", error);
                alert('Erro ao salvar manutenção. Tente novamente. Erro: ' + error.message);
            }
        });
    } else {
        console.error("Botão de salvar manutenção não encontrado!");
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
    window.editarManutencao = async function(id) {
        try {
            const docRef = doc(db, 'manutencoes', id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const manutencao = docSnap.data();
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
        } catch (error) {
            console.error("Erro ao carregar manutenção para edição:", error);
        }
    };
    
    window.excluirManutencao = async function(id) {
        if (confirm('Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita.')) {
            try {
                const docRef = doc(db, 'manutencoes', id);
                await deleteDoc(docRef);
                await carregarManutencoes();
                await atualizarDashboard();
                alert('Manutenção excluída com sucesso!');
            } catch (error) {
                console.error("Erro ao excluir manutenção:", error);
                alert('Erro ao excluir manutenção. Tente novamente.');
            }
        }
    };
    
    // Funções para Alertas
    async function carregarAlertas() {
        console.log("Tentando carregar alertas do Firebase...");
        try {
            const snapshot = await getDocs(alertasCollection);
            console.log("Resposta do Firebase para alertas:", snapshot.size, "documentos");
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
        } catch (error) {
            console.error("Erro ao carregar alertas:", error);
            if (alertasList) {
                alertasList.innerHTML = '<p class="empty-message">Erro ao carregar alertas. Verifique o console para mais detalhes.</p>';
            }
            if (alertasRecentesList) {
                alertasRecentesList.innerHTML = '<p class="empty-message">Erro ao carregar alertas. Verifique o console para mais detalhes.</p>';
            }
        }
    }
    
    // Resolver alerta
    window.resolverAlerta = async function(id) {
        if (confirm('Marcar este alerta como resolvido? Ele será removido da lista.')) {
            try {
                const docRef = doc(db, 'alertas', id);
                await deleteDoc(docRef);
                await carregarAlertas();
                await atualizarDashboard();
                alert('Alerta marcado como resolvido!');
            } catch (error) {
                console.error("Erro ao resolver alerta:", error);
                alert('Erro ao resolver alerta. Tente novamente.');
            }
        }
    };
    
    // Verificar alertas para peças
    async function verificarAlertasPecas() {
        try {
            const snapshot = await getDocs(pecasCollection);
            
            snapshot.forEach(async docSnapshot => {
                const peca = docSnapshot.data();
                const ultimaTroca = new Date(peca.ultimaTroca);
                const hoje = new Date();
                
                // Calcular horas de uso desde a última troca
                const horasUso = await calcularHorasUso(peca.maquinaId, ultimaTroca);
                
                // Verificar se está próximo da vida útil
                if (horasUso >= peca.vidaUtil * 0.8) {
                    // Verificar se já existe um alerta para esta peça
                    const alertaQuery = query(
                        alertasCollection,
                        where('tipo', '==', 'peca'),
                        where('referenciaId', '==', docSnapshot.id)
                    );
                    
                    const alertaSnapshot = await getDocs(alertaQuery);
                    
                    if (alertaSnapshot.empty) {
                        // Criar alerta
                        const prioridade = horasUso >= peca.vidaUtil ? 'Alta' : 'Média';
                        const percentual = Math.round((horasUso / peca.vidaUtil) * 100);
                        
                        await addDoc(alertasCollection, {
                            tipo: 'peca',
                            referenciaId: docSnapshot.id,
                            titulo: `Troca de Peça: ${peca.nome}`,
                            descricao: `A peça ${peca.nome} (${peca.codigo}) atingiu ${percentual}% da sua vida útil. Considere programar uma substituição.`,
                            data: new Date().toISOString().split('T')[0],
                            prioridade: prioridade
                        });
                        
                        await carregarAlertas();
                        await atualizarDashboard();
                    }
                }
                
                // Verificar estoque baixo
                if (peca.estoque <= 1) {
                    // Verificar se já existe um alerta para estoque desta peça
                    const alertaQuery = query(
                        alertasCollection,
                        where('tipo', '==', 'estoque'),
                        where('referenciaId', '==', docSnapshot.id)
                    );
                    
                    const alertaSnapshot = await getDocs(alertaQuery);
                    
                    if (alertaSnapshot.empty) {
                        // Criar alerta
                        await addDoc(alertasCollection, {
                            tipo: 'estoque',
                            referenciaId: docSnapshot.id,
                            titulo: `Estoque Baixo: ${peca.nome}`,
                            descricao: `O estoque da peça ${peca.nome} (${peca.codigo}) está baixo (${peca.estoque} unidades). Considere adquirir mais unidades.`,
                            data: new Date().toISOString().split('T')[0],
                            prioridade: peca.estoque === 0 ? 'Alta' : 'Média'
                        });
                        
                        await carregarAlertas();
                        await atualizarDashboard();
                    }
                }
            });
        } catch (error) {
            console.error("Erro ao verificar peças para alertas:", error);
        }
    }
    
    // Verificar alertas para manutenções
    async function verificarAlertasManutencoes() {
        try {
            // Obter a última manutenção preventiva de cada máquina
            const maquinasSnapshot = await getDocs(maquinasCollection);
            
            maquinasSnapshot.forEach(async maquinaDoc => {
                const maquinaId = maquinaDoc.id;
                const maquina = maquinaDoc.data();
                
                // Consultar a última manutenção preventiva
                const manutencaoQuery = query(
                    manutencoesCollection,
                    where('maquinaId', '==', maquinaId),
                    where('tipo', '==', 'Preventiva'),
                    orderBy('data', 'desc'),
                    limit(1)
                );
                
                const manutencaoSnapshot = await getDocs(manutencaoQuery);
                
                if (!manutencaoSnapshot.empty) {
                    const ultimaManutencao = manutencaoSnapshot.docs[0].data();
                    const dataUltimaManutencao = new Date(ultimaManutencao.data);
                    const hoje = new Date();
                    
                    // Calcular dias desde a última manutenção
                    const diasDesdeUltimaManutencao = Math.floor((hoje - dataUltimaManutencao) / (1000 * 60 * 60 * 24));
                    
                    // Se passaram mais de 90 dias desde a última manutenção preventiva
                    if (diasDesdeUltimaManutencao >= 90) {
                        // Verificar se já existe um alerta para esta máquina
                        const alertaQuery = query(
                            alertasCollection,
                            where('tipo', '==', 'manutencao'),
                            where('referenciaId', '==', maquinaId)
                        );
                        
                        const alertaSnapshot = await getDocs(alertaQuery);
                        
                        if (alertaSnapshot.empty) {
                            // Criar alerta
                            const prioridade = diasDesdeUltimaManutencao >= 120 ? 'Alta' : 'Média';
                            
                            await addDoc(alertasCollection, {
                                tipo: 'manutencao',
                                referenciaId: maquinaId,
                                titulo: `Manutenção Preventiva: ${maquina.nome}`,
                                descricao: `A máquina ${maquina.nome} está há ${diasDesdeUltimaManutencao} dias sem manutenção preventiva. Recomenda-se agendar uma manutenção.`,
                                data: new Date().toISOString().split('T')[0],
                                prioridade: prioridade
                            });
                            
                            await carregarAlertas();
                            await atualizarDashboard();
                        }
                    }
                } else {
                    // Nunca teve manutenção preventiva
                    const alertaQuery = query(
                        alertasCollection,
                        where('tipo', '==', 'manutencao'),
                        where('referenciaId', '==', maquinaId)
                    );
                    
                    const alertaSnapshot = await getDocs(alertaQuery);
                    
                    if (alertaSnapshot.empty) {
                        // Criar alerta
                        await addDoc(alertasCollection, {
                            tipo: 'manutencao',
                            referenciaId: maquinaId,
                            titulo: `Manutenção Preventiva: ${maquina.nome}`,
                            descricao: `A máquina ${maquina.nome} nunca passou por manutenção preventiva. Recomenda-se agendar uma manutenção.`,
                            data: new Date().toISOString().split('T')[0],
                            prioridade: 'Alta'
                        });
                        
                        await carregarAlertas();
                        await atualizarDashboard();
                    }
                }
            });
        } catch (error) {
            console.error("Erro ao verificar máquinas para alertas de manutenção:", error);
        }
    }
    
    // Função para calcular horas de uso de uma máquina desde uma data
    async function calcularHorasUso(maquinaId, dataInicio) {
        try {
            // Implementação simplificada - em um sistema real, isso seria calculado com base nas operações registradas
            const operacoesQuery = query(
                operacoesCollection,
                where('maquinaId', '==', maquinaId),
                where('data', '>=', dataInicio.toISOString().split('T')[0])
            );
            
            const operacoesSnapshot = await getDocs(operacoesQuery);
            
            let horasTotal = 0;
            operacoesSnapshot.forEach(doc => {
                const operacao = doc.data();
                horasTotal += parseFloat(operacao.duracao) || 0;
            });
            
            return horasTotal || 100; // Valor mínimo para demonstração
        } catch (error) {
            console.error("Erro ao calcular horas de uso:", error);
            return 100; // Valor padrão para demonstração
        }
    }
    
    // Atualizar contadores do dashboard
    async function atualizarDashboard() {
        console.log("Atualizando dashboard...");
        
        try {
            // Contar máquinas
            const maquinasSnapshot = await getDocs(maquinasCollection);
            if (maquinasCount) maquinasCount.textContent = maquinasSnapshot.size;
            
            // Contar operações
            const operacoesSnapshot = await getDocs(operacoesCollection);
            if (operacoesCount) operacoesCount.textContent = operacoesSnapshot.size;
            
            // Contar peças
            const pecasSnapshot = await getDocs(pecasCollection);
            if (pecasCount) pecasCount.textContent = pecasSnapshot.size;
            
            // Contar manutenções
            const manutencoesSnapshot = await getDocs(manutencoesCollection);
            if (manutencoesCount) manutencoesCount.textContent = manutencoesSnapshot.size;
            
            // Contar alertas
            const alertasSnapshot = await getDocs(alertasCollection);
            if (alertasCount) alertasCount.textContent = alertasSnapshot.size;
        } catch (error) {
            console.error("Erro ao atualizar dashboard:", error);
        }
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
    
    // Importar funções adicionais necessárias
    import('config.js').then(module => {
        // Adicionar getDoc e where ao escopo global para uso nas funções de janela
        window.getDoc = module.getDoc;
        window.where = module.where;
        window.query = module.query;
        window.limit = module.limit;
        window.orderBy = module.orderBy;
        
        // Chamar carregarDados explicitamente na inicialização
        // Isso garante que os dados sejam carregados mesmo se a verificação de login já tiver ocorrido
        setTimeout(function() {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                console.log("Chamando carregarDados após timeout");
                window.carregarDados();
            }
        }, 500);
    }).catch(error => {
        console.error("Erro ao importar módulos adicionais:", error);
    });
});
