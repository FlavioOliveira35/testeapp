const mockUser = {
    email: "supervisor@example.com",
    password: "123456"
  };
  
  let technicians = [
    {
      id: 1,
      name: "João Silva",
      role: "Instalador Sênior",
      tools: [
        {
          id: 101,
          name: "Cabo de Fibra Óptica",
          status: "OK",
          deliveredAt: "2025-01-10",
          dueDate: "2025-04-10",
          comment: "Em bom estado.",
          history: [{ date: "2025-01-10", action: "Marcado como OK", by: "Você" }]
        },
        {
          id: 102,
          name: "Testador de Sinal",
          status: "NOK",
          deliveredAt: "",
          dueDate: "",
          comment: "",
          history: []
        }
      ]
    },
    {
      id: 2,
      name: "Carlos Mendes",
      role: "Instalador Júnior",
      tools: []
    }
  ];
  
  let selectedTechId = null;
  
  function showApp() {
    document.getElementById("app").style.display = "block";
    document.getElementById("login-screen").style.display = "none";
    loadTechnicians();
  }
  
  function showLogin() {
    document.getElementById("app").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
  }
  
  function handleLogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    if (email === mockUser.email && password === mockUser.password) {
      showApp();
    } else {
      document.getElementById("login-error").innerText = "E-mail ou senha inválidos.";
    }
  }
  
  function signOutUser() {
    showLogin();
  }
  
  function switchTab(btn) {
    document.querySelectorAll(".tab-content").forEach(t => t.classList.add("hidden"));
    document.getElementById("tab-" + btn.dataset.tab).classList.remove("hidden");
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  
    if (btn.dataset.tab === "reports") updateReportSummary();
    if (btn.dataset.tab === "checklist") {
      const techSelect = document.getElementById("tech-select");
      if (techSelect.value) loadTools(techSelect.value);
    }
  }
  
  function loadTechnicians() {
    updateTechnicianList();
    populateTechSelect();
    if (!selectedTechId && technicians.length > 0) {
      selectedTechId = technicians[0].id;
      loadTools(selectedTechId);
    }
  }
  
  function addTechnician() {
    const name = document.getElementById("new-tech-name").value.trim();
    const role = document.getElementById("new-tech-role").value.trim();
    if (!name || !role) return;
  
    const tech = {
      id: Date.now(),
      name,
      role,
      tools: []
    };
    technicians.push(tech);
    updateTechnicianList();
    populateTechSelect();
    document.getElementById("new-tech-name").value = "";
    document.getElementById("new-tech-role").value = "";
  }
  
  function updateTechnicianList() {
    const list = document.getElementById("technicians-list");
    list.innerHTML = "";
  
    technicians.forEach(tech => {
      const li = document.createElement("div");
      li.className = "tech-card";
  
      const okCount = tech.tools.filter(t => t.status === "OK").length;
      const nokCount = tech.tools.filter(t => t.status === "NOK").length;
  
      li.innerHTML = `
        <strong>${tech.name}</strong> <small>${tech.role}</small>
        <div class="tool-ok-nok">
          <span class="tool-ok"><svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> ${okCount}</span>
          <span class="tool-nok"><svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${nokCount}</span>
        </div>
        <div class="delete-btn-wrapper">
          <button class="btn red" onclick="deleteTechnician(${tech.id})">Excluir</button>
        </div>
      `;
      list.appendChild(li);
    });
  }
  
  function deleteTechnician(id) {
    technicians = technicians.filter(t => t.id !== id);
    updateTechnicianList();
    populateTechSelect();
    if (selectedTechId === id) {
      selectedTechId = null;
      document.getElementById("tools-list").innerHTML = "";
    }
  }
  
  function populateTechSelect() {
    const select = document.getElementById("tech-select");
    select.innerHTML = "<option value=''>Selecione</option>";
    technicians.forEach(tech => {
      const opt = document.createElement("option");
      opt.value = tech.id;
      opt.textContent = tech.name;
      select.appendChild(opt);
    });
  }
  
  function loadTools(id) {
    selectedTechId = parseInt(id);
    const tech = technicians.find(t => t.id === selectedTechId);
    renderTools(tech?.tools || []);
  }
  
  function renderTools(tools) {
    const container = document.getElementById("tools-list");
    container.innerHTML = "";
  
    if (tools.length === 0) {
      container.innerHTML = "<p style='text-align:center;'>Nenhuma ferramenta cadastrada.</p>";
      return;
    }
  
    tools.forEach(tool => {
      const card = document.createElement("div");
      card.className = "tool-card " + (tool.status === "OK" ? "ok" : "nok");
  
      const today = new Date();
      const dueDate = tool.dueDate ? new Date(tool.dueDate) : null;
      const isOverdue = dueDate && dueDate < today;
      const isExpiring = dueDate && ((dueDate - today) / (1000 * 60 * 60 * 24)) <= 7;
  
      const expiredLabel = isOverdue 
        ? `<span class="tool-expired">⚠ Vencido</span>` 
        : isExpiring 
          ? `<span class="tool-expiring">⏳ Próximo ao vencimento</span>` 
          : '';
  
      card.innerHTML = `
        <div class="tool-card-header">
          <div>
            <div class="tool-name">${tool.name}</div>
            <small>${expiredLabel}</small>
          </div>
        </div>
        <div class="tool-ok-nok">
          <button class="status-btn ${tool.status === 'OK' ? 'ok' : ''}" onclick="updateToolStatus(${tool.id}, 'status', 'OK')">✔</button>
          <button class="status-btn ${tool.status === 'NOK' ? 'nok' : ''}" onclick="updateToolStatus(${tool.id}, 'status', 'NOK')">✘</button>
        </div>
        <div class="form-group">
          <label>Data de Entrega
            <input type="date" value="${tool.deliveredAt}" onchange="updateToolStatus(${tool.id}, 'deliveredAt', this.value)" />
          </label>
          <label>Prazo de Troca
            <input type="date" value="${tool.dueDate}" onchange="updateToolStatus(${tool.id}, 'dueDate', this.value)" />
          </label>
        </div>
      `;
  
      container.appendChild(card);
    });
  
    updateReportSummary();
  }
  
  function updateToolStatus(id, field, value) {
    const tech = technicians.find(t => t.id === selectedTechId);
    const tool = tech.tools.find(t => t.id === id);
    if (tool) {
      tool[field] = value;
      // Atualiza histórico
      tool.history = tool.history || [];
      tool.history.unshift({
        date: new Date().toISOString().split('T')[0],
        action: `Status alterado para ${value}`,
        by: "Você"
      });
      renderTools(tech.tools);
    }
  }
  
  function addTool() {
    const name = document.getElementById("new-tool-name").value.trim();
    if (!name) return;
    const tool = {
      id: Date.now(),
      name,
      status: "NOK",
      deliveredAt: "",
      dueDate: "",
      comment: "",
      history: []
    };
    const tech = technicians.find(t => t.id === selectedTechId);
    tech.tools.push(tool);
    renderTools(tech.tools);
    document.getElementById("new-tool-name").value = "";
  }
  
  function getStats(tools) {
    const stats = {
      ok: 0,
      nok: 0,
      expiring: 0,
      overdue: 0
    };
    const today = new Date();
    tools.forEach(tool => {
      if (tool.status === "OK") stats.ok++;
      if (tool.status === "NOK") stats.nok++;
      if (tool.dueDate) {
        const due = new Date(tool.dueDate);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 7 && diffDays >= 0) stats.expiring++;
        if (due < today) stats.overdue++;
      }
    });
    return stats;
  }
  
  function updateReportSummary() {
    let totalTools = 0, totalOk = 0, totalNok = 0, totalExpiring = 0, totalExpired = 0;
  
    const tableBody = document.getElementById("report-table-body");
    tableBody.innerHTML = "";
  
    technicians.forEach(tech => {
      const stats = getStats(tech.tools);
      totalTools += tech.tools.length;
      totalOk += stats.ok;
      totalNok += stats.nok;
      totalExpiring += stats.expiring;
      totalExpired += stats.overdue;
  
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tech.name}</td>
        <td>${stats.ok}</td>
        <td>${stats.nok}</td>
        <td>${tech.tools.length}</td>
        <td>${stats.expiring}</td>
        <td>${stats.overdue}</td>
        <td><button class="btn yellow" onclick="toggleDetails(${tech.id})">Detalhes</button></td>
      `;
      tableBody.appendChild(tr);
  
      const detailsRow = document.createElement("tr");
      detailsRow.style.display = "none";
      detailsRow.innerHTML = `<td colspan="6" class="details-cell"></td>`;
      tableBody.appendChild(detailsRow);
    });
  
    document.getElementById("total-tools").textContent = totalTools;
    document.getElementById("total-ok").textContent = totalOk;
    document.getElementById("total-nok").textContent = totalNok;
    document.getElementById("total-expiring").textContent = totalExpiring;
    document.getElementById("total-expired").textContent = totalExpired;
  }
  
  function toggleDetails(techId) {
    const rows = document.querySelectorAll(`tr`);
    rows.forEach(row => {
      const cell = row.querySelector("td");
      if (cell && cell.innerText.includes(technicians.find(t => t.id === techId)?.name || '')) {
        const nextRow = row.nextElementSibling;
        if (nextRow && nextRow.querySelector("td")) {
          nextRow.style.display = nextRow.style.display === "none" ? "table-row" : "none";
          const detailCell = nextRow.querySelector("td");
          detailCell.innerHTML = "";
  
          const tech = technicians.find(t => t.id === techId);
          if (!tech || tech.tools.length === 0) {
            detailCell.innerText = "Nenhuma ferramenta encontrada.";
            return;
          }
  
          tech.tools.forEach(tool => {
            const div = document.createElement("div");
            div.className = "tool-details";
            div.innerHTML = `
              <div><strong>${tool.name}</strong> (${tool.status})</div>
              <small>Data de entrega: ${tool.deliveredAt || '-'}, Prazo: ${tool.dueDate || '-'}</small>
              <div class="tool-comment">${tool.comment || ''}</div>
            `;
            detailCell.appendChild(div);
          });
        }
      }
    });
  }
  
  function updateTechnicianList() {
    const list = document.getElementById("technicians-list");
    list.innerHTML = "";
    technicians.forEach(tech => {
      const li = document.createElement("li");
      li.className = "tech-card";
  
      const okCount = tech.tools.filter(t => t.status === "OK").length;
      const nokCount = tech.tools.filter(t => t.status === "NOK").length;
  
      li.innerHTML = `
        <strong>${tech.name}</strong> <small>${tech.role}</small>
        <div class="tool-ok-nok">
          <span class="tool-ok"><svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> ${okCount}</span>
          <span class="tool-nok"><svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${nokCount}</span>
        </div>
        <div class="delete-btn-wrapper">
          <button class="btn red" onclick="deleteTechnician(${tech.id})">Excluir</button>
        </div>
      `;
      list.appendChild(li);
    });
  }
  
  function addTechnician() {
    const name = document.getElementById("new-tech-name").value.trim();
    const role = document.getElementById("new-tech-role").value.trim();
    if (!name || !role) return;
  
    const tech = {
      id: Date.now(),
      name,
      role,
      tools: []
    };
    technicians.push(tech);
    updateTechnicianList();
    populateTechSelect();
    document.getElementById("new-tech-name").value = "";
    document.getElementById("new-tech-role").value = "";
  }
  
  window.onload = () => {
    const saved = localStorage.getItem("technicians");
    if (saved) technicians = JSON.parse(saved);
    showLogin();
  };
  
  function showLogin() {
    document.getElementById("app").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
  }
  
  function showApp() {
    document.getElementById("app").style.display = "block";
    document.getElementById("login-screen").style.display = "none";
    loadTechnicians();
  }
  
  function loadTechnicians() {
    updateTechnicianList();
    populateTechSelect();
    if (!selectedTechId && technicians.length > 0) {
      selectedTechId = technicians[0].id;
      loadTools(selectedTechId);
    }
  }
  