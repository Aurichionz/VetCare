document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formAnimal");
    const listaTutores = document.getElementById("listaTutores");

    let tutores = [];
    fetch("http://localhost:3000/tutores")
        .then(response => response.json())
        .then(data => {

            tutores = data;

            data.forEach(tutor => {

                const option = document.createElement("option");
                option.value = tutor.nome;

                listaTutores.appendChild(option);

            });

        })
        .catch(error => console.error("Erro ao buscar tutores:", error));

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const nomeTutor = document.getElementById("tutorInput").value;

        const tutorSelecionado = tutores.find(t => t.nome === nomeTutor);

        if (!tutorSelecionado) {
            alert("Selecione um tutor válido.");
            return;
        }

        const formData = {
            nome: form.nome.value,
            especie: form.especie.value,
            raca: form.raca.value,
            sexo: form.sexo.value,
            idade: parseInt(form.idade.value),
            peso: parseFloat(form.peso.value),
            tutorId: tutorSelecionado.id_tutor
        };

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
                alert("❌ Erro ao cadastrar.");
            }

        })
        .catch(error => {
            console.error("Erro:", error);
        });

    });

});