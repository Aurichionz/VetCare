document.addEventListener("DOMContentLoaded", () => {
    carregarAnimais();
    carregarVacinas();
    atualizarDatas();
});

function atualizarDatas() {
    const hoje = new Date().toLocaleDateString("pt-BR");
    document.querySelectorAll(".data-geracao")
        .forEach(span => span.textContent = hoje);
}

async function carregarAnimais() {
    const tbody = document.getElementById("tbodyAnimais");

    try {
        const response = await fetch("http://localhost:3000/relatorios/animais");
        const dados = await response.json();

        if (dados.length === 0) {
            tbody.innerHTML =
                `<tr><td colspan="4" style="text-align:center;">
                 Nenhum animal cadastrado.
                 </td></tr>`;
            return;
        }

        tbody.innerHTML = dados.map(a => `
            <tr>
                <td>${a.nome}</td>
                <td>${a.especie}</td>
                <td>${a.raca}</td>
                <td>${a.tutor}</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Erro ao carregar animais:", error);
    }
}

async function carregarVacinas() {
    const tbody = document.getElementById("tbodyVacinas");

    try {
        const response = await fetch("http://localhost:3000/relatorios/vacinas");
        const dados = await response.json();

        if (dados.length === 0) {
            tbody.innerHTML =
                `<tr><td colspan="5" style="text-align:center;">
                 Nenhuma vacina cadastrada.
                 </td></tr>`;
            return;
        }

        tbody.innerHTML = dados.map(v => `
            <tr>
                <td>${v.animal}</td>
                <td>${v.tutor}</td>
                <td>${v.nome}</td>
                <td>${formatarData(v.data_aplicacao)}</td>
                <td>${formatarData(v.data_revacinacao)}</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Erro ao carregar vacinas:", error);
    }
}

function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR");
}

function gerarPDF(elementId) {
    const element = document.getElementById(elementId);
    const botoes = element.querySelectorAll('.no-print');

    botoes.forEach(btn => btn.style.display = 'none');

    const opt = {
        margin: 0.5,
        filename: 'relatorio_vetcare.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        botoes.forEach(btn => btn.style.display = 'inline-flex');
    });
}