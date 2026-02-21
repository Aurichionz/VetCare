document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formTutor");
    const mensagemErro = document.getElementById("mensagemErro");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

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
                mensagemErro.style.display = "block";
                mensagemErro.textContent = resultado.erro || "Erro ao cadastrar tutor.";
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            mensagemErro.style.display = "block";
            mensagemErro.textContent = "Servidor offline ou erro de conexão.";
        }
    });
});