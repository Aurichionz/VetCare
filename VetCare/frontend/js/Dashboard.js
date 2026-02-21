document.addEventListener('DOMContentLoaded', async () => {
    try {
        // AJUSTE NA URL: Verifique se no seu server.js está app.use('/dashboard', dashboardRoutes)
        // Se estiver, a URL deve ser http://localhost:3000/dashboard
        const resposta = await fetch('http://localhost:3000/dashboard'); 
        
        if (!resposta.ok) throw new Error("Erro ao buscar dados do servidor");
        
        const dados = await resposta.json();

        // Atualizar os Cards Numéricos
        document.querySelector('.card:nth-child(1) h2').textContent = dados.totalAnimais;
        document.querySelector('.card:nth-child(2) h2').textContent = dados.vacinasEmDia;
        document.querySelector('.card:nth-child(3) h2').textContent = dados.vacinasProximas;
        document.querySelector('.card:nth-child(4) h2').textContent = dados.vacinasPendentes;

        const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

        // Preparar arrays de 12 meses zerados
        const vacinasArray = new Array(12).fill(0);
        dados.vacinasMes.forEach(v => {
            vacinasArray[v.mes - 1] = v.total;
        });

        const desempenhoArray = new Array(12).fill(0);
        dados.desempenhoMes.forEach(v => {
            desempenhoArray[v.mes - 1] = v.total;
        });

        // --- Gráfico de Barras (Vacinações) ---
        new Chart(document.getElementById('graficoVacinas'), {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Vacinações',
                    data: vacinasArray,
                    backgroundColor: 'hsl(158, 83%, 30%)',
                    borderColor: 'hsla(158, 83%, 19%, 0.763)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // --- Gráfico de Linha (Cadastros) ---
        new Chart(document.getElementById('graficoDesempenho'), {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Novos Cadastros',
                    data: desempenhoArray,
                    tension: 0.3,
                    borderColor: 'hsl(158, 83%, 30%)',
                    backgroundColor: 'rgba(16,185,129,0.15)',
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#059669',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    } catch (error) {
        console.error("Erro ao renderizar gráficos:", error);
    }
});