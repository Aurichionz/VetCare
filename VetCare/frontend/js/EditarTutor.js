const API_URL = "http://localhost:3000/api";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const form = document.getElementById("formEditarTutor");

// ===============================
// CARREGAR TUTOR
// ===============================
async function carregarTutor() {
  try {
    const response = await fetch(`${API_URL}/tutor/${id}`);
    const tutor = await response.json();

    document.getElementById("nome").value = tutor.nome;
    document.getElementById("telefone").value = tutor.telefone;
    document.getElementById("rua").value = tutor.rua;
    document.getElementById("numero").value = tutor.numero;
    document.getElementById("bairro").value = tutor.bairro;
    document.getElementById("cidade").value = tutor.cidade;
    document.getElementById("estado").value = tutor.estado;

  } catch (error) {
    console.error("Erro ao carregar tutor:", error);
  }
}

// ===============================
// ATUALIZAR TUTOR
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value,
    rua: document.getElementById("rua").value,
    numero: document.getElementById("numero").value,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value
  };

  try {
    await fetch(`${API_URL}/tutor/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    window.location.href = "ListarTutores.html";

  } catch (error) {
    console.error("Erro ao atualizar:", error);
  }
});

carregarTutor();