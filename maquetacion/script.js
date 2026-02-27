const toggleBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebarMenu');
const overlay = document.getElementById('overlay');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show');
  overlay.classList.toggle('show');
});

// Cerrar sidebar al hacer clic en el overlay
overlay.addEventListener('click', () => {
  sidebar.classList.remove('show');
  overlay.classList.remove('show');
});


//grafico
  const ctx = document.getElementById('financeChart').getContext('2d');
  const financeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ingresos', 'Egresos', 'Balance'],
      datasets: [{
        label: 'Finanzas ($)',
        data: [12500, 8200, 4300],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',  // verde ingresos
          'rgba(220, 53, 69, 0.7)',   // rojo egresos
          'rgba(30, 58, 138, 0.7)'    // azul balance
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(30, 58, 138, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Resumen mensual' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });


