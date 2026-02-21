const API_URL = "http://localhost:3000/api";

async function excluirVacina(id) {

  const confirmar = confirm("Tem certeza que deseja excluir esta vacina?");
  if (!confirmar) return;

  try {

    await fetch(`${API_URL}/vacina/${id}`, {
      method: "DELETE"
    });

    // volta para página atual
    window.location.reload();

  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Erro ao excluir vacina.");
  }
}