document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const usuaria = document.querySelector("input[name='usuaria']").value;
    const senha = document.querySelector("input[name='senha']").value;

    try {
        const resposta = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuaria, senha })
        });

        // Verifica se a resposta é JSON para evitar erro de token '<'
        const contentType = resposta.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("O servidor não respondeu com JSON. Verifique se o Node está ligado.");
        }

        const dados = await resposta.json();

        if (dados.sucesso) {
            localStorage.setItem("usuarioNome", dados.nome);
            window.location.href = "pages/Dashboard.html"; // Ajuste o caminho se necessário
        } else {
            alert(dados.mensagem);
        }
    } catch (err) {
        console.error("Erro:", err);
        alert("🚨 Erro de conexão: " + err.message);
    }
});