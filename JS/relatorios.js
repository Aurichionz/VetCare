// Mock data
const animais = [
  { id: '1', nome: 'Rex', tipo: 'Cão', raca: 'Labrador', sexo: 'M', peso: 25, tutorId: 't1', dataNascimento: '2020-05-10' },
  { id: '2', nome: 'Luna', tipo: 'Gato', raca: 'Siamês', sexo: 'F', peso: 4, tutorId: 't1', dataNascimento: '2021-03-15' }
];

const tutores = [
  { id: 't1', nome: 'João Silva', telefone: '(11) 99999-9999', cidade: 'São Paulo' }
];

const vacinas = [
  { id: 'v1', animalId: '1', nome: 'Antirrábica', dataAplicacao: '2026-01-10', dataRevacinacao: '2026-02-10', status: 'pendente' },
  { id: 'v2', animalId: '2', nome: 'V10', dataAplicacao: '2026-01-12', dataRevacinacao: '2026-02-15', status: 'proxima_vencimento' }
];

// Contadores
document.getElementById('countAnimais').innerText = animais.length;
document.getElementById('countVacinas').innerText = vacinas.length;

const reportContent = document.getElementById('reportContent');

document.querySelectorAll('.report-card').forEach(card => {
  card.addEventListener('click', () => {
    const report = card.dataset.report;
    reportContent.innerHTML = '';

    if(report === 'animais') {
      // Tabela de Animais
      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Nome</th><th>Tipo</th><th>Raça</th><th>Sexo</th><th>Peso</th><th>Tutor</th>
          </tr>
        </thead>
        <tbody>
          ${animais.map(a => {
            const tutor = tutores.find(t => t.id === a.tutorId);
            return `<tr>
              <td>${a.nome}</td>
              <td>${a.tipo}</td>
              <td>${a.raca}</td>
              <td>${a.sexo === 'M' ? 'Macho' : 'Fêmea'}</td>
              <td>${a.peso} kg</td>
              <td>${tutor ? tutor.nome : '-'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      `;
      reportContent.appendChild(table);
    }

    if(report === 'vacinas') {
      // Tabela de Vacinas
      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Animal</th><th>Tutor</th><th>Vacina</th><th>Aplicação</th><th>Revacinação</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${vacinas.map(v => {
            const animal = animais.find(a => a.id === v.animalId);
            const tutor = animal ? tutores.find(t => t.id === animal.tutorId) : null;
            return `<tr>
              <td>${animal ? animal.nome : '-'}</td>
              <td>${tutor ? tutor.nome : '-'}</td>
              <td>${v.nome}</td>
              <td>${new Date(v.dataAplicacao).toLocaleDateString('pt-BR')}</td>
              <td>${new Date(v.dataRevacinacao).toLocaleDateString('pt-BR')}</td>
              <td>${v.status}</td>
            </tr>`;
          }).join('')}
        </tbody>
      `;
      reportContent.appendChild(table);
    }
  });
});

document.getElementById('btnPdf').addEventListener('click', () => {
  // Seleciona a área que será convertida em PDF
  const element = document.getElementById('reportContent');

  // Configurações do PDF
  const opt = {
    margin:       0.5,
    filename:     'relatorio-vetclinic.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 }, // aumenta resolução
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  // Gera e baixa o PDF
  html2pdf().set(opt).from(element).save();
});
