document.addEventListener("DOMContentLoaded", () => {
    carregarVacinasPendentes();
});

async function carregarVacinasPendentes() {

    try {
        const response = await fetch("http://localhost:3000/vacinas/pendentes");
        const dados = await response.json();

        const tbody = document.getElementById("tbodyVacinas");
        const totalAtrasadas = document.getElementById("totalAtrasadas");
        const totalProximas = document.getElementById("totalProximas");

        if (dados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        Nenhuma vacina pendente ou próxima do vencimento.
                    </td>
                </tr>`;
            return;
        }

        let atrasadas = 0;
        let proximas = 0;

        tbody.innerHTML = dados.map(v => {

            const hoje = new Date();
            const dataRevac = new Date(v.data_revacinacao);

            let status = "";
            let classe = "";

            if (dataRevac < hoje) {
                status = "Pendente";
                classe = "expired";
                atrasadas++;
            } else {
                status = "Próxima";
                classe = "warning";
                proximas++;
            }

            return `
                <tr>
                    <td>${v.animal}</td>
                    <td>${v.tutor}</td>
                    <td>${v.nome}</td>
                    <td>${formatarData(v.data_revacinacao)}</td>
                    <td>
                        <span class="status ${classe}">
                            ${status}
                        </span>
                    </td>
                    <td>
                        <a href="AplicarVacina.html?id=${v.id_vacina}" class="icon-btn vacina">
                            Vacinar
                        </a>

                        <a href="#" class="icon-btn delete"
                           onclick="excluirVacina(${v.id_vacina})">
                            Excluir
                        </a>
                    </td>
                </tr>
            `;

        }).join("");

        totalAtrasadas.textContent = atrasadas;
        totalProximas.textContent = proximas;

    } catch (error) {
        console.error("Erro ao carregar vacinas:", error);
    }
}

function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR");
}

async function excluirVacina(id) {

    if (!confirm("Tem certeza que deseja excluir esta vacina?"))
        return;

    await fetch(`http://localhost:3000/vacinas/${id}`, {
        method: "DELETE"
    });

    carregarVacinasPendentes();
}