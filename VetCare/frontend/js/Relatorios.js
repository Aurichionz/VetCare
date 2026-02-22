document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    atualizarDatas();
});

function atualizarDatas() {
    const hoje = new Date().toLocaleDateString("pt-BR");
    document.querySelectorAll(".data-geracao").forEach(span => span.textContent = hoje);
}

function formatarDataBR(dataISO) {
    if (!dataISO) return "---";
    const data = new Date(dataISO);
    return new Date(data.getTime() + data.getTimezoneOffset() * 60000).toLocaleDateString("pt-BR");
}

async function carregarDados() {
    // Carregar Animais
    try {
        const resA = await fetch("http://localhost:3000/relatorios/animais");
        const animais = await resA.json();
        document.getElementById("tbodyAnimais").innerHTML = animais.map(a => `
            <div class="report-item-card">
                <div class="card-title">${a.nome}</div>
                <div class="data-row"><span class="label">ESPÉCIE</span><span class="value">${a.especie}</span></div>
                <div class="data-row"><span class="label">RAÇA</span><span class="value">${a.raca}</span></div>
                <div class="data-row"><span class="label">TUTOR</span><span class="value">${a.tutor}</span></div>
            </div>
        `).join("");
    } catch (e) { console.error("Erro animais:", e); }

    // Carregar Vacinas
    try {
        const resV = await fetch("http://localhost:3000/relatorios/vacinas");
        const vacinas = await resV.json();
        const hoje = new Date().setHours(0,0,0,0);

        document.getElementById("tbodyVacinas").innerHTML = vacinas.map(v => {
            const isPendente = new Date(v.data_revacinacao).getTime() < hoje;
            return `
                <div class="report-item-card">
                    <div class="card-title">${v.animal}</div>
                    <div class="data-row"><span class="label">VACINA</span><span class="value">${v.nome_vacina}</span></div>
                    <div class="data-row"><span class="label">TUTOR</span><span class="value">${v.tutor}</span></div>
                    <div class="data-row"><span class="label">APLICAÇÃO</span><span class="value">${formatarDataBR(v.data_aplicacao)}</span></div>
                    <div class="data-row"><span class="label">PRÓXIMA DOSE</span><span class="value">${formatarDataBR(v.data_revacinacao)}</span></div>
                    <div class="data-row"><span class="label">STATUS</span><span class="value" style="color:${isPendente ? 'red' : 'green'}; font-weight:bold">${isPendente ? 'Pendente' : 'Em dia'}</span></div>
                </div>`;
        }).join("");
    } catch (e) { console.error("Erro vacinas:", e); }
}

function gerarPDF(elementId) {

    const element = document.getElementById(elementId);

    window.scrollTo(0, 0);

    const opt = {
        margin: 10,
        filename: 'Relatorio_VetCare.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { mode: ['css', 'legacy'] } // ❗ removido avoid-all
    };

    html2pdf().set(opt).from(element).save();
}