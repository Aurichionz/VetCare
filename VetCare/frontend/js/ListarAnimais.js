document.addEventListener("DOMContentLoaded", () => {
    carregarAnimais();
});

async function carregarAnimais() {
    try {
        const response = await fetch("http://localhost:3000/animais");
        
        if (!response.ok) {
            console.error("O servidor retornou um erro:", response.status);
            return;
        }

        const animais = await response.json();
        const tbody = document.getElementById("tabela-animais");
        tbody.innerHTML = "";

        animais.forEach(animal => {
            const tr = document.createElement("tr");

            // 1. Lógica de concordância para a idade (Ex: 1 ano vs 2 anos)
            const idadeTexto = animal.idade === 1 ? "1 ano" : `${animal.idade} anos`;

            // 2. Lógica para o peso com 2 casas decimais (Ex: 21.00 kg)
            // parseFloat garante que tratamos o dado como número antes do toFixed
            const pesoFormatado = parseFloat(animal.peso).toFixed(2);

            tr.innerHTML = `
                <td>${animal.nome}</td>
                <td>${animal.tutor_nome || 'Sem Tutor'}</td> 
                <td>${animal.especie}</td>
                <td>${animal.raca}</td>
                <td>${animal.sexo}</td>
                <td>${idadeTexto}</td> 
                <td>${pesoFormatado} kg</td>
                <td>
                    <div class="acoes-lista">
                        <a href="NovaVacina.html?id=${animal.id_animal}" class="icon-btn vacina">Vacinar</a>
                        <a href="HistoricoVacina.html?id=${animal.id_animal}" class="icon-btn details">Detalhar</a>
                        <a href="EditarAnimal.html?id=${animal.id_animal}" class="icon-btn edit">Editar</a>
                        <button class="icon-btn delete" onclick="excluirAnimal(${animal.id_animal})">Excluir</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar animais:", error);
    }
}

async function excluirAnimal(id) {
    if (!confirm("Deseja realmente excluir este animal?")) return;

    try {
        const response = await fetch(`http://localhost:3000/animais/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            carregarAnimais();
        } else {
            alert("Erro ao excluir animal.");
        }

    } catch (error) {
        console.error("Erro ao excluir animal:", error);
    }
}