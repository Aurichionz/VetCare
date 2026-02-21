document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAnimal");
    const selectTutor = document.getElementById("selectTutor");

    // ==========================================
    // 1. CARREGAR TUTORES NO SELECT
    // ==========================================
    fetch("http://localhost:3000/tutores")
        .then(response => response.json())
        .then(data => {
            // Limpa o select antes de preencher (mantendo apenas a opção padrão)
            selectTutor.innerHTML = '<option value="">Selecione um tutor</option>';
            
            data.forEach(tutor => {
                const option = document.createElement("option");
                option.value = tutor.id_tutor;
                option.textContent = tutor.nome;
                selectTutor.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao buscar tutores:", error));

    // ==========================================
    // 2. EVENTO DE CADASTRO (SUBMIT)
    // ==========================================
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Criamos o objeto formData APENAS quando o botão é clicado
        const formData = {
            nome: form.nome.value,
            especie: form.especie.value,
            raca: form.raca.value,
            sexo: form.sexo.value,
            idade: parseInt(form.idade.value), 
            peso: parseFloat(form.peso.value),
            tutorId: form.tutorId.value
        };

        console.log("Enviando dados para o servidor:", formData);

        fetch("http://localhost:3000/animais", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                alert("✅ Animal cadastrado com sucesso!");
                form.reset();
            } else {
                alert("❌ Erro ao cadastrar: " + (data.erro || "Verifique os dados."));
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            alert("Erro: Não foi possível conectar ao servidor backend.");
        });
    });
});