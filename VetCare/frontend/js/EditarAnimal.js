document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const form = document.getElementById("formEditarAnimal");

    if (!id) {
        window.location.href = "ListarAnimais.html";
        return;
    }

    async function carregarTutores(tutorSelecionadoId) {
        try {
            const res = await fetch("http://localhost:3000/tutores");
            const tutores = await res.json();
            const select = document.getElementById("tutorId");
            
            select.innerHTML = '<option value="">Selecione um tutor</option>';
            tutores.forEach(tutor => {
                const opt = document.createElement("option");
                opt.value = tutor.id_tutor;
                opt.textContent = tutor.nome;
                if (tutor.id_tutor == tutorSelecionadoId) opt.selected = true;
                select.appendChild(opt);
            });
        } catch (e) { console.error("Erro tutores:", e); }
    }

    try {
        const response = await fetch(`http://localhost:3000/animais/${id}`);
        const animal = await response.json();

        form.nome.value = animal.nome;
        form.especie.value = animal.especie;
        form.raca.value = animal.raca;
        form.idade.value = animal.idade;
        form.peso.value = animal.peso;

        // --- AJUSTE PARA O SEXO ---
        // Pegamos o valor do banco e normalizamos (removemos acentos e espaços)
        const sexoDoBanco = animal.sexo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
        
        // Percorremos as opções do select para encontrar a correta
        Array.from(form.sexo.options).forEach(option => {
            const valorOpcao = option.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
            if (valorOpcao === sexoDoBanco) {
                option.selected = true;
            }
        });

        await carregarTutores(animal.id_tutor);

    } catch (error) {
        console.error("Erro ao carregar animal:", error);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const dados = {
            nome: form.nome.value,
            especie: form.especie.value,
            raca: form.raca.value,
            sexo: form.sexo.value,
            idade: form.idade.value,
            peso: form.peso.value,
            tutorId: form.tutorId.value
        };

        const res = await fetch(`http://localhost:3000/animais/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            alert("✅ Animal atualizado!");
            window.location.href = "ListarAnimais.html";
        }
    });
});