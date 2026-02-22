document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formTutor"); // Verifique se o ID no HTML é este
    const mensagemErro = document.getElementById("mensagemErro");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Captura os valores dos inputs do seu HTML
        const dados = {
            nome: form.nome.value,
            cpf: form.cpf.value,
            telefone: form.telefone.value,
            rua: form.rua.value,
            numero: form.numero.value,
            bairro: form.bairro.value,
            cidade: form.cidade.value,
            estado: form.estado.value
        };

        try {
            const resposta = await fetch("http://localhost:3000/tutores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                alert("✅ Tutor cadastrado com sucesso!");
                window.location.href = "ListarTutores.html";
            } else {
                alert("❌ Erro: " + resultado.erro);
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            alert("Servidor offline ou erro de conexão.");
        }
    });
});