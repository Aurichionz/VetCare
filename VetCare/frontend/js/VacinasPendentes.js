document.addEventListener("DOMContentLoaded", () => {
    carregarVacinas();
});

async function carregarVacinas() {
    const tbody = document.getElementById("tbodyVacinas");
    const totalAtrasadasEl = document.getElementById("totalAtrasadas");
    const totalProximasEl = document.getElementById("totalProximas");

    try {
        const response = await fetch("http://localhost:3000/vacinas/pendentes");
        const vacinas = await response.json();

        if (!tbody) return;
        tbody.innerHTML = "";

        // Inicializa os contadores em zero
        let contAtrasadas = 0;
        let contProximas = 0;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        vacinas.forEach(v => {
            const dataRev = new Date(v.data_revacinacao);
            // Ajuste de fuso horário para garantir precisão na comparação
            const dataLocal = new Date(dataRev.getTime() + dataRev.getTimezoneOffset() * 60000);
            
            let statusClass = "";
            let statusTexto = "";

            // Lógica de contabilização e definição de status
            if (dataLocal < hoje) {
                contAtrasadas++; // Soma no card de atrasadas
                statusClass = "expired";
                statusTexto = "Pendente";
            } else {
                contProximas++; // Soma no card de próximas
                statusClass = "warning";
                statusTexto = "Próxima";
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${v.id_vacina}</td>
                <td><strong>${v.nome_vacina}</strong></td>
                <td>${v.animal_nome}</td>
                <td>${v.tutor_nome}</td>
                <td>${dataLocal.toLocaleDateString('pt-BR')}</td>
                <td><span class="status ${statusClass}">${statusTexto}</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="confirmarAplicacao(${v.id_vacina})" class="btn-vacinar" title="Vacinar agora">
                            <span class="material-symbols-outlined">check_circle</span>
                        </button>
                        
                        <button onclick="excluirVacina(${v.id_vacina})" class="btn-vacinar" style="background: #b91c1c;" title="Excluir">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Atualiza os textos dos cards com os valores somados no loop
        if (totalAtrasadasEl) totalAtrasadasEl.textContent = contAtrasadas;
        if (totalProximasEl) totalProximasEl.textContent = contProximas;

    } catch (error) {
        console.error("Erro ao carregar vacinas:", error);
    }
}

// FUNÇÃO PARA DAR BAIXA (ATUALIZAR)
async function confirmarAplicacao(id) {
    if (!confirm("Confirmar que a vacina foi aplicada hoje? Isso renovará o prazo para daqui a 1 ano.")) return;

    try {
        const response = await fetch(`http://localhost:3000/vacinas/aplicar/${id}`, {
            method: "PUT"
        });
        const resultado = await response.json();

        if (resultado.sucesso) {
            alert("✅ Vacina atualizada com sucesso!");
            carregarVacinas(); // Recarrega a lista e os contadores
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
    }
}

// FUNÇÃO PARA EXCLUIR
async function excluirVacina(id) {
    if (!confirm("Tem certeza que deseja excluir permanentemente este registro?")) return;

    try {
        const response = await fetch(`http://localhost:3000/vacinas/${id}`, {
            method: "DELETE"
        });
        const resultado = await response.json();

        if (resultado.sucesso) {
            alert("🗑️ Registro excluído.");
            carregarVacinas(); // Recarrega a lista e os contadores
        }
    } catch (error) {
        alert("Erro ao excluir vacina.");
    }
}