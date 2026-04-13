document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('growthChart');
    
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Miembros',
                    data: [1200, 1250, 1300, 1420, 1480, 1520],
                    borderColor: '#D4AF37',
                    borderWidth: 3,
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4
                }]
            },
            options: { 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }, 
                scales: { 
                    y: { beginAtZero: false, grid: { color: '#f0f0f0' } },
                    x: { grid: { display: false } }
                } 
            }
        });
    }
});