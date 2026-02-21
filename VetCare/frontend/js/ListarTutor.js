document.addEventListener("DOMContentLoaded", () => {
    carregarTutores();
});

async function carregarTutores() {
    try {
        const response = await fetch("http://localhost:3000/tutores");
        const tutores = await response.json();

        const tbody = document.getElementById("tabela-tutores");
        tbody.innerHTML = "";

        tutores.forEach(tutor => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${tutor.nome}</td>
                <td>${tutor.total_animais}</td>
                <td>${tutor.telefone}</td>
                <td>
                    ${tutor.cidade} - 
                    ${tutor.rua}, 
                    ${tutor.numero}
                </td>
                <td>
                    <a href="EditarTutores.html?id=${tutor.id_tutor}" 
                       class="icon-btn edit">
                       Editar
                    </a>

                    <button class="icon-btn delete"
                        onclick="excluirTutor(${tutor.id_tutor})">
                        Excluir
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro ao carregar tutores:", error);
    }
}

async function excluirTutor(id) {
    if (!confirm("Deseja realmente excluir este tutor?")) return;

    try {
        await fetch(`http://localhost:3000/tutores/${id}`, {
            method: "DELETE"
        });

        carregarTutores();

    } catch (error) {
        console.error("Erro ao excluir tutor:", error);
    }
}