document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const formVacina = document.getElementById("formVacina");

    if (!id) {
        alert("Animal não identificado!");
        window.location.href = "ListarAnimais.html";
        return;
    }

    // Carregar dados do animal para os cards informativos
    try {
        const response = await fetch(`http://localhost:3000/animais/${id}`);
        const animal = await response.json();

        document.getElementById("animalNome").textContent = animal.nome;
        document.getElementById("animalEspecie").textContent = animal.especie;
        document.getElementById("animalRaca").textContent = animal.raca;
        document.getElementById("animalTutor").textContent = animal.tutor_nome;
        document.getElementById("animalIdade").textContent = animal.idade === 1 ? "1 ano" : `${animal.idade} anos`;
        document.getElementById("animalPeso").textContent = parseFloat(animal.peso).toFixed(2) + " kg";
        document.getElementById("animalSexo").textContent = animal.sexo;
    } catch (error) {
        console.error("Erro ao carregar dados do animal:", error);
    }

    // Ação do Botão Salvar
    formVacina.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Pegamos os valores direto dos nomes (name) dos inputs do seu HTML
        const dadosVacina = {
            id_animal: id,
            nome_vacina: formVacina.nomeVacina.value,
            data_aplicacao: formVacina.dataAplicacao.value,
            data_revacinacao: formVacina.dataRevacinacao.value
        };

        try {
            const res = await fetch("http://localhost:3000/vacinas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosVacina)
            });

            const resultado = await res.json();

            if (res.ok && resultado.sucesso) {
                alert("💉 Vacina registrada com sucesso!");
                window.location.href = `HistoricoVacina.html?id=${id}`;
            } else {
                // Se o erro de 'Unknown column' aparecer aqui, você não reiniciou o servidor!
                alert("Erro ao salvar: " + (resultado.erro || "Erro desconhecido"));
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    });
});