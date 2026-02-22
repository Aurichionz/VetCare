const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    carregarVacinasPendentes();
});

async function carregarVacinasPendentes() {
    const tbody = document.getElementById("tbodyVacinas");
    const totalAtrasadasEl = document.getElementById("totalAtrasadas");
    const totalProximasEl = document.getElementById("totalProximas");

    try {
        const response = await fetch(`${API_URL}/vacinas/pendentes`);

        if (!response.ok) {
            throw new Error("Erro na resposta da API");
        }

        const vacinas = await response.json();
        console.log("VACINAS RECEBIDAS:", vacinas); // DEBUG

        if (!tbody) return;
        tbody.innerHTML = "";

        let contAtrasadas = 0;
        let contProximas = 0;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        vacinas.forEach(v => {

            console.log("Registro individual:", v); // DEBUG

            const dataRev = converterParaData(v.data_revacinacao);
            const diff = dataRev ? (dataRev - hoje) / (1000 * 60 * 60 * 24) : null;

            let statusT = "Em dia";
            let statusC = "ok";

            if (diff !== null) {
                if (diff < 0) {
                    statusT = "Pendente";
                    statusC = "expired";
                    contAtrasadas++;
                } else if (diff <= 30) {
                    statusT = "Próxima";
                    statusC = "warning";
                    contProximas++;
                }
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${v.animal_nome || "---"}</strong></td>
                <td>${v.tutor_nome || "---"}</td>
                <td>${v.nome_vacina || "Vacina"}</td>
                <td>${formatarData(v.data_aplicacao)}</td>
                <td>${formatarData(v.data_revacinacao)}</td>
                <td><span class="status ${statusC}">${statusT}</span></td>
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

        if (totalAtrasadasEl) totalAtrasadasEl.textContent = contAtrasadas;
        if (totalProximasEl) totalProximasEl.textContent = contProximas;

    } catch (e) {
        console.error("Erro ao carregar pendentes:", e);
        alert("Erro ao carregar vacinas pendentes.");
    }
}

/* =========================
   FUNÇÕES AUXILIARES
========================= */

function converterParaData(data) {
    if (!data) return null;

    // Formato ISO ou yyyy-mm-dd
    if (data.includes("-")) {
        const partes = data.split("T")[0].split("-");
        return new Date(partes[0], partes[1] - 1, partes[2]);
    }

    // Formato brasileiro dd/mm/yyyy
    if (data.includes("/")) {
        const partes = data.split("/");
        return new Date(partes[2], partes[1] - 1, partes[0]);
    }

    return null;
}

function formatarData(data) {
    const d = converterParaData(data);
    if (!d || isNaN(d.getTime())) return "---";

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

/* =========================
   AÇÕES
========================= */

async function confirmarAplicacao(id) {
    if (!confirm("Confirmar que a vacina foi aplicada hoje?")) return;

    try {
        const res = await fetch(`${API_URL}/vacinas/aplicar/${id}`, {
            method: "PUT"
        });

        if (res.ok) {
            alert("✅ Vacina renovada!");
            carregarVacinasPendentes();
        } else {
            alert("Erro ao atualizar vacina.");
        }

    } catch (e) {
        alert("Erro ao conectar com o servidor.");
    }
}

window.excluirVacina = async function(id) {
    if (!confirm("Deseja realmente excluir este registro?")) return;

    try {
        const res = await fetch(`${API_URL}/vacinas/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            carregarVacinasPendentes();
        } else {
            alert("Erro ao excluir vacina.");
        }

    } catch (e) {
        alert("Erro ao conectar com o servidor.");
    }
};