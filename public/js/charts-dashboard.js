// public/js/charts-dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const chartCanvas = document.getElementById('growthChart');
    if (!chartCanvas) return;

    // Recuperamos y parseamos el array limpio de 12 posiciones inyectado por el backend
    const dbValues = JSON.parse(chartCanvas.getAttribute('data-database-values') || "[]");

    const ctx = chartCanvas.getContext('2d');

    // --- CONFIGURACIÓN DE DEGRADADO PREMIUM (Estilo CalmMind Fresh) ---
    // Creamos un degradado de arriba a abajo para el área rellena del gráfico
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(5, 150, 105, 0.22)');  // Verde Esmeralda translúcido arriba
    gradientFill.addColorStop(0.5, 'rgba(5, 150, 105, 0.06)');// Menta muy suave al medio
    gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');   // Se desvanece a blanco puro abajo

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Donaciones Mensuales',
                data: dbValues,
                backgroundColor: gradientFill,          // Aplicamos el degradado de fondo
                borderColor: '#059669',                  // Verde Esmeralda principal (--calm-green-primary)
                borderWidth: 2.5,                        // Línea sutil pero definida
                tension: 0.38,                           // Curvatura orgánica y suave de la línea
                fill: true,
                pointBackgroundColor: '#ffffff',         // Puntos blancos puros al pasar el cursor
                pointBorderColor: '#059669',             // Borde verde para los puntos
                pointBorderWidth: 2,
                pointRadius: 0,                          // Ocultos por defecto para máxima limpieza visual
                pointHoverRadius: 5,                     // Aparecen elegantemente al hacer hover
                pointHoverBackgroundColor: '#059669',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',          // Tooltip oscuro Slate para alto contraste limpio
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    padding: 10,
                    borderRadius: 8,
                    displayColors: false,
                    font: {
                        family: "'Inter', 'Segoe UI', sans-serif"
                    }
                }
            },
            scales: { 
                y: { 
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(15, 23, 42, 0.04)', // Líneas de cuadrícula milimétricas casi invisibles
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',                // Texto de ejes en gris óptico (--text-disabled)
                        font: { size: 11, weight: 500 }
                    }
                },
                x: {
                    grid: {
                        display: false                   // Eliminamos las líneas verticales para limpiar el Bento Card
                    },
                    ticks: {
                        color: '#94a3b8',                // Texto de ejes en gris óptico (--text-disabled)
                        font: { size: 11, weight: 500 }
                    }
                }
            }
        }
    });
});