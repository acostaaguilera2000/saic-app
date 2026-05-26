/**
 * SAIC - Control de Filtrado Institucional para Reportes
 */
window.addEventListener('load', function() {
    if (typeof jQuery !== 'undefined') {
        
        // 1. Inicializar DataTables de forma limpia para el reporte
        const tablaReporte = $('.tabla-institucional').DataTable({
            paging: false,       // Sin paginación para ver todos los cultos del mes juntos
            searching: true,     // Activado para que funcione el filtro por mes
            info: false,         // Ocultar información de registros al pie
            ordering: false,     // Respetar el orden cronológico que viene de la base de datos
            dom: 't'             // Solo dibuja la tabla ("table"), remueve buscadores nativos
        });

        // 2. Capturar el evento de cambio en el selector de meses
        $('#filtro-mes').on('change', function() {
            const mesSeleccionado = $(this).val().toLowerCase();
            
            if (mesSeleccionado === "") {
                // Si selecciona mostrar todos, limpia el filtro de la columna de Fecha (Columna 0)
                tablaReporte.column(0).search('').draw();
            } else {
                // Filtra la columna 0 buscando la cadena de texto del mes (ej: "junio")
                tablaReporte.column(0).search(mesSeleccionado).draw();
            }
        });

    } else {
        console.error("SAIC Error: jQuery o DataTables no se encuentran disponibles para ejecutar el filtro.");
    }
});