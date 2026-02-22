document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const form = document.getElementById("formEditarTutor");

    if (!id) {
        window.location.href = "ListarTutores.html";
        return;
    }

    // CARREGAR DADOS
    try {
        // Rota baseada no seu app.js: /tutores
        const response = await fetch(`http://localhost:3000/tutores/${id}`);
        
        if (!response.ok) throw new Error("Tutor não encontrado");

        const tutor = await response.json();

        // Preenche os campos usando o ID ou Name do formulário
        form.nome.value = tutor.nome || "";
        form.telefone.value = tutor.telefone || "";
        form.rua.value = tutor.rua || "";
        form.numero.value = tutor.numero || "";
        form.bairro.value = tutor.bairro || "";
        form.cidade.value = tutor.cidade || "";
        form.estado.value = tutor.estado || "";

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar dados do tutor.");
    }

    // SALVAR
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dados = {
            nome: form.nome.value,
            telefone: form.telefone.value,
            rua: form.rua.value,
            numero: form.numero.value,
            bairro: form.bairro.value,
            cidade: form.cidade.value,
            estado: form.estado.value
        };

        try {
            const res = await fetch(`http://localhost:3000/tutores/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            if (res.ok) {
                alert("✅ Tutor atualizado!");
                window.location.href = "ListarTutores.html";
            } else {
                alert("Erro ao salvar alterações.");
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    });
});