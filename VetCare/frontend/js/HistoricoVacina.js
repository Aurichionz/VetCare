const API_URL = "http://localhost:3000"; 
const params = new URLSearchParams(window.location.search);
const idAnimal = params.get("id");

document.addEventListener("DOMContentLoaded", async () => {
    if (!idAnimal) return;
    await carregarAnimal();
    await carregarVacinas();
});

async function carregarAnimal() {
    try {
        const res = await fetch(`${API_URL}/animais/${idAnimal}`);
        const a = await res.json();
        
        // Preenche os cards (IDs exatos do seu HTML)
        document.getElementById("animalNome").textContent = a.nome || "---";
        document.getElementById("animalEspecie").textContent = a.especie || "---";
        document.getElementById("animalRaca").textContent = a.raca || "---";
        document.getElementById("animalTutor").textContent = a.tutor_nome || "Não informado";
        document.getElementById("animalIdade").textContent = (a.idade || 0) + " anos";
        document.getElementById("animalPeso").textContent = (a.peso || 0) + " kg";
        document.getElementById("animalSexo").textContent = a.sexo || "---";
    } catch (e) { console.error("Erro animal:", e); }
}

async function carregarVacinas() {
    try {
        const res = await fetch(`${API_URL}/vacinas/animal/${idAnimal}`);
        const vacinas = await res.json();
        const tabela = document.getElementById("tabelaVacinas");
        tabela.innerHTML = "";

        vacinas.forEach(v => {
            const hoje = new Date();
            const revac = new Date(v.data_revacinacao);
            const diff = (revac - hoje) / (1000 * 60 * 60 * 24);

            let statusT = "Em dia", statusC = "ok";
            if (diff < 0) { statusT = "Pendente"; statusC = "expired"; }
            else if (diff <= 30) { statusT = "Próxima"; statusC = "warning"; }

           tabela.innerHTML += `
            <tr>
                <td>${v.id_vacina}</td> <td><strong>${v.nome_vacina || "Vacina"}</strong></td>
                <td>${formatarData(v.data_aplicacao)}</td>
                <td>${formatarData(v.data_revacinacao)}</td>
                <td><span class="status ${statusC}">${statusT}</span></td>
                <td>
                    <button class="icon-btn delete" onclick="excluirVacina(${v.id_vacina})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            </tr>`;
        });
    } catch (e) { console.error("Erro vacinas:", e); }
}

window.excluirVacina = async (id) => {
    if (!confirm("Excluir esta vacina?")) return;
    await fetch(`${API_URL}/vacinas/${id}`, { method: "DELETE" });
    carregarVacinas();
};
// ==========================================
// 3. FUNÇÕES AUXILIARES
// ==========================================
function formatarData(data) {
  if (!data) return "---";
  const d = new Date(data);
  // Ajuste para evitar que a data mostre um dia a menos devido ao fuso horário
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000).toLocaleDateString("pt-BR");
}

// Deixamos a função global para o 'onclick' do HTML funcionar
window.excluirVacina = async function(id) {
  if (!confirm("Deseja realmente excluir este registro de vacina?")) return;

  try {
    await fetch(`${API_URL}/vacinas/${id}`, {
      method: "DELETE"
    });
    carregarVacinas(); // Recarrega a lista
  } catch (error) {
    alert("Erro ao excluir vacina.");
  }
}