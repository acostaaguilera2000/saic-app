/**
 * SAIC - Módulo de Consulta de Servicios para Miembros
 * Control de filtros reactivos para la vista de acordeones.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Verificación de seguridad para asegurarse de que jQuery esté disponible
    if (typeof jQuery !== 'undefined') {
        
        const $monthSelect = $('#filter-month-select');
        const $serviceRows = $('.service-row-item');
        const $counter = $('#total-services-count');

        // Validamos que los elementos existan en el DOM actual antes de ejecutar la lógica
        if ($monthSelect.length > 0 && $serviceRows.length > 0) {
            
            console.log("SAIC Info: Módulo independiente cronograma.js cargado correctamente.");

            $monthSelect.on('change', function () {
                const selectedMonth = $(this).val(); // Retorna "todos" o el número de mes (0-11)
                let visibleCount = 0;

                $serviceRows.each(function () {
                    // Extraemos el mes en formato UTC inyectado desde Pug
                    const rowMonth = $(this).attr('data-month');

                    if (selectedMonth === 'todos' || rowMonth === selectedMonth) {
                        $(this).removeClass('d-none'); // Muestra la fila con Bootstrap
                        visibleCount++;
                    } else {
                        $(this).addClass('d-none'); // Oculta la fila con Bootstrap
                    }
                });

                // Actualización reactiva del badge contador en la interfaz
                if ($counter.length > 0) {
                    $counter.text(visibleCount);
                }
            });
        }

    } else {
        console.error("SAIC Error: jQuery no está disponible para el script cronograma.js.");
    }
});