// Função para carregar brechós do localStorage
function loadBrechos() {
    const savedBrechos = localStorage.getItem('brechos');
    if (savedBrechos) {
        return JSON.parse(savedBrechos);
    }
    // Retorna dados iniciais se não houver nada salvo
    return [
        {
            id: 1,
            nome: "Brechó da Maria",
            endereco: "Rua das Flores, 123",
            cidade: "Santa Cruz do Sul",
            telefone: "(51) 9999-8888",
            descricao: "Peças vintage e modernas com preços acessíveis",
            roupas: [
                {
                    nome: "Vestido Floral",
                    preco: 45.00,
                    imagem: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=300&fit=crop"
                },
                {
                    nome: "Blusa Vintage",
                    preco: 25.00,
                    imagem: "https://images.unsplash.com/photo-1564584217132-2271339881b4?w=200&h=300&fit=crop"
                }
            ]
        },
        {
            id: 2,
            nome: "Closet Sustentável",
            endereco: "Av. Central, 456",
            cidade: "Santa Cruz do Sul",
            telefone: "(51) 8877-6655",
            descricao: "Moda consciente e sustentável para todos os estilos",
            roupas: [
                {
                    nome: "Jaqueta Jeans",
                    preco: 35.00,
                    imagem: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=300&fit=crop"
                },
                {
                    nome: "Saia Midi",
                    preco: 30.00,
                    imagem: "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=200&h=300&fit=crop"
                }
            ]
        }
    ];
}

// Função para salvar brechós no localStorage
function saveBrechos() {
    localStorage.setItem('brechos', JSON.stringify(brechos));
}

// Inicializar brechós com dados do localStorage
let brechos = loadBrechos();

function showSection(sectionName) {
    // Ocultar todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover classe active de todos os botões
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Adicionar classe active ao botão clicado
    event.target.classList.add('active');
}

// Função para renderizar brechós
function renderBrechos() {
    const container = document.getElementById('brechos-container');
    if (!container) return; // Verifica se o elemento existe
    
    container.innerHTML = '';

    brechos.forEach(brecho => {
        const card = document.createElement('div');
        card.className = 'brecho-card';
        
        const roupasHtml = brecho.roupas.map(roupa => `
            <div class="roupa-item">
                <img src="${roupa.imagem}" alt="${roupa.nome}" class="roupa-img">
                <div class="roupa-nome">${roupa.nome}</div>
                <div class="roupa-preco">R$ ${roupa.preco.toFixed(2)}</div>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="brecho-header">
                <div>
                    <div class="brecho-name">${brecho.nome}</div>
                    <div class="brecho-location">📍 ${brecho.endereco}, ${brecho.cidade}</div>
                    <div style="color: #b0b0b0; margin-bottom: 10px;">📞 ${brecho.telefone}</div>
                    <div style="color: #b0b0b0; margin-bottom: 20px; font-style: italic;">${brecho.descricao}</div>
                </div>
                <div class="brecho-actions">
                    <button class="edit-btn" onclick="editBrecho(${brecho.id})">✏️ Editar</button>
                    <button class="delete-btn" onclick="deleteBrecho(${brecho.id})">🗑️ Excluir</button>
                </div>
            </div>
            <div class="roupas-grid">
                ${roupasHtml}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Função para adicionar nova roupa no formulário
function addRoupa() {
    const container = document.getElementById('roupas-container');
    const newItem = document.createElement('div');
    newItem.className = 'roupa-form-item';
    newItem.innerHTML = `
        <div>
            <label>Nome da Peça</label>
            <input type="text" name="roupa-nome" placeholder="Ex: Vestido Floral" required>
        </div>
        <div>
            <label>Preço (R$)</label>
            <input type="number" name="roupa-preco" placeholder="25.00" step="0.01" required>
        </div>
        <div>
            <label>URL da Imagem</label>
            <input type="url" name="roupa-imagem" placeholder="https://exemplo.com/imagem.jpg" required>
        </div>
        <button type="button" class="remove-btn" onclick="removeRoupa(this)">Remover</button>
    `;
    container.appendChild(newItem);
}

// Função para remover roupa do formulário
function removeRoupa(button) {
    const container = document.getElementById('roupas-container');
    if (container.children.length > 1) {
        button.parentNode.remove();
    }
}

// Função para gerar ID único
function generateUniqueId() {
    return brechos.length > 0 ? Math.max(...brechos.map(b => b.id)) + 1 : 1;
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar brechós ao carregar a página
    renderBrechos();
    
    // Configurar event listener do formulário
    const form = document.getElementById('brecho-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const newBrecho = {
                id: generateUniqueId(),
                nome: formData.get('nome'),
                endereco: formData.get('endereco'),
                cidade: formData.get('cidade'),
                telefone: formData.get('telefone'),
                descricao: formData.get('descricao'),
                roupas: []
            };

            // Coletar dados das roupas
            const roupasNomes = formData.getAll('roupa-nome');
            const roupasPrecos = formData.getAll('roupa-preco');
            const roupasImagens = formData.getAll('roupa-imagem');

            for (let i = 0; i < roupasNomes.length; i++) {
                if (roupasNomes[i] && roupasPrecos[i] && roupasImagens[i]) {
                    newBrecho.roupas.push({
                        nome: roupasNomes[i],
                        preco: parseFloat(roupasPrecos[i]),
                        imagem: roupasImagens[i]
                    });
                }
            }

            // Adicionar novo brechó
            brechos.push(newBrecho);
            
            // Salvar no localStorage
            saveBrechos();
            
            // Mostrar mensagem de sucesso
            const successMessage = document.getElementById('success-message');
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // Limpar formulário
            this.reset();
            
            // Resetar roupas para apenas uma
            const roupasContainer = document.getElementById('roupas-container');
            if (roupasContainer) {
                roupasContainer.innerHTML = `
                    <div class="roupa-form-item">
                        <div>
                            <label>Nome da Peça</label>
                            <input type="text" name="roupa-nome" placeholder="Ex: Vestido Floral" required>
                        </div>
                        <div>
                            <label>Preço (R$)</label>
                            <input type="number" name="roupa-preco" placeholder="25.00" step="0.01" required>
                        </div>
                        <div>
                            <label>URL da Imagem</label>
                            <input type="url" name="roupa-imagem" placeholder="https://exemplo.com/imagem.jpg" required>
                        </div>
                        <button type="button" class="remove-btn" onclick="removeRoupa(this)">Remover</button>
                    </div>
                `;
            }
            
            // Re-renderizar brechós
            renderBrechos();
            
            // Ocultar mensagem após 3 segundos
            if (successMessage) {
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        });
    }
});

// Função adicional para limpar dados (útil para desenvolvimento/teste)
function clearAllData() {
    localStorage.removeItem('brechos');
    brechos = loadBrechos();
    renderBrechos();
    console.log('Dados limpos e resetados para o padrão');
}

// Função para editar brechó
function editBrecho(id) {
    const brecho = brechos.find(b => b.id === id);
    if (!brecho) return;
    
    // Preencher modal de edição
    document.getElementById('edit-nome').value = brecho.nome;
    document.getElementById('edit-endereco').value = brecho.endereco;
    document.getElementById('edit-cidade').value = brecho.cidade;
    document.getElementById('edit-telefone').value = brecho.telefone;
    document.getElementById('edit-descricao').value = brecho.descricao;
    
    // Preencher roupas
    const editRoupasContainer = document.getElementById('edit-roupas-container');
    editRoupasContainer.innerHTML = '';
    
    brecho.roupas.forEach((roupa, index) => {
        const roupaItem = document.createElement('div');
        roupaItem.className = 'roupa-form-item';
        roupaItem.innerHTML = `
            <div>
                <label>Nome da Peça</label>
                <input type="text" name="edit-roupa-nome" value="${roupa.nome}" required>
            </div>
            <div>
                <label>Preço (R$)</label>
                <input type="number" name="edit-roupa-preco" value="${roupa.preco}" step="0.01" required>
            </div>
            <div>
                <label>URL da Imagem</label>
                <input type="url" name="edit-roupa-imagem" value="${roupa.imagem}" required>
            </div>
            <button type="button" class="remove-btn" onclick="removeEditRoupa(this)">Remover</button>
        `;
        editRoupasContainer.appendChild(roupaItem);
    });
    
    // Se não há roupas, adicionar uma vazia
    if (brecho.roupas.length === 0) {
        addEditRoupa();
    }
    
    // Mostrar modal e salvar ID do brechó sendo editado
    document.getElementById('edit-modal').style.display = 'flex';
    document.getElementById('edit-modal').dataset.brechoId = id;
}

// Função para excluir brechó
function deleteBrecho(id) {
    if (confirm('Tem certeza que deseja excluir este brechó?')) {
        brechos = brechos.filter(b => b.id !== id);
        saveBrechos();
        renderBrechos();
    }
}

// Função para fechar modal de edição
function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// Função para adicionar roupa no modal de edição
function addEditRoupa() {
    const container = document.getElementById('edit-roupas-container');
    const newItem = document.createElement('div');
    newItem.className = 'roupa-form-item';
    newItem.innerHTML = `
        <div>
            <label>Nome da Peça</label>
            <input type="text" name="edit-roupa-nome" placeholder="Ex: Vestido Floral" required>
        </div>
        <div>
            <label>Preço (R$)</label>
            <input type="number" name="edit-roupa-preco" placeholder="25.00" step="0.01" required>
        </div>
        <div>
            <label>URL da Imagem</label>
            <input type="url" name="edit-roupa-imagem" placeholder="https://exemplo.com/imagem.jpg" required>
        </div>
        <button type="button" class="remove-btn" onclick="removeEditRoupa(this)">Remover</button>
    `;
    container.appendChild(newItem);
}

// Função para remover roupa do modal de edição
function removeEditRoupa(button) {
    const container = document.getElementById('edit-roupas-container');
    if (container.children.length > 1) {
        button.parentNode.remove();
    }
}

// Event listener para o modal de edição
document.addEventListener('DOMContentLoaded', function() {
    // ... código anterior ...
    
    // Configurar event listener do formulário de edição
    const editForm = document.getElementById('edit-brecho-form');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const brechoId = parseInt(document.getElementById('edit-modal').dataset.brechoId);
            const brechoIndex = brechos.findIndex(b => b.id === brechoId);
            
            if (brechoIndex === -1) return;
            
            const formData = new FormData(this);
            
            // Atualizar dados do brechó
            brechos[brechoIndex].nome = formData.get('edit-nome');
            brechos[brechoIndex].endereco = formData.get('edit-endereco');
            brechos[brechoIndex].cidade = formData.get('edit-cidade');
            brechos[brechoIndex].telefone = formData.get('edit-telefone');
            brechos[brechoIndex].descricao = formData.get('edit-descricao');
            
            // Atualizar roupas
            brechos[brechoIndex].roupas = [];
            const roupasNomes = formData.getAll('edit-roupa-nome');
            const roupasPrecos = formData.getAll('edit-roupa-preco');
            const roupasImagens = formData.getAll('edit-roupa-imagem');
            
            for (let i = 0; i < roupasNomes.length; i++) {
                if (roupasNomes[i] && roupasPrecos[i] && roupasImagens[i]) {
                    brechos[brechoIndex].roupas.push({
                        nome: roupasNomes[i],
                        preco: parseFloat(roupasPrecos[i]),
                        imagem: roupasImagens[i]
                    });
                }
            }
            
            // Salvar e atualizar interface
            saveBrechos();
            renderBrechos();
            closeEditModal();
            
            // Mostrar mensagem de sucesso
            alert('Brechó atualizado com sucesso!');
        });
    }
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('edit-modal');
        if (e.target === modal) {
            closeEditModal();
        }
    });
});