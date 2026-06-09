// public/js/charts-dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const chartCanvas = document.getElementById('growthChart');
    if (!chartCanvas) return;

    // Recuperamos y parseamos el array limpio de 12 posiciones inyectado por el backend
    const dbValues = JSON.parse(chartCanvas.getAttribute('data-database-values') || "[]");

    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
        type: 'line', // O 'bar' según tu preferencia de diseño Bento
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Donaciones Mensuales',
                data: dbValues, // ¡Nuestra data del DashboardService mapeada!
                backgroundColor: 'rgba(0, 40, 85, 0.05)',
                borderColor: '#002855',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
});