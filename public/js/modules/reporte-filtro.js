/**
 * SAIC - Control de Filtrado Institucional para Reportes
 */
window.addEventListener('load', function () {
    if (typeof jQuery !== 'undefined') {

        const tablaReporte = $('.tabla-institucional').DataTable({
            paging: false,
            searching: true,
            info: false,
            ordering: false,
            dom: 't'
        });

        $('#filtro-mes').on('change', function () {
            const mesSeleccionado = $(this).val().toLowerCase();
            if (mesSeleccionado === "") {
                tablaReporte.column(0).search('').draw();
            } else {
                tablaReporte.column(0).search(mesSeleccionado).draw();
            }
        });

    } else {
        console.error("SAIC Error: jQuery o DataTables no se encuentran disponibles para ejecutar el filtro.");
    }
});