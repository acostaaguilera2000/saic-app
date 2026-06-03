window.addEventListener('load', function () {
    if (typeof jQuery !== 'undefined') {
        $('#tabla-members').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[3, 'desc']], // Ordenar por fecha descendente
            language: {
                processing: "Procesando...",
                search: "Buscar miembros:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando del registro _START_ al _END_ de un total de _TOTAL_ miembros",
                infoEmpty: "Mostrando 0 registros de 0",
                infoFiltered: "(filtrado de un total de _MAX_ registros)",
                loadingRecords: "Cargando ...",
                zeroRecords: "No se encontraron resultados que coincidan con la búsqueda",
                emptyTable: "No hay miembros registrados en este momento",
                paginate: {
                    first: "<<",
                    previous: "<",
                    next: ">",
                    last: ">"
                }
            },
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    searchable: false
                }
            ]
        });
    } else {
        console.error("SAIC Error: jQuery no se cargó a tiempo en el navegador.");
    }
});

/**
 * Despliega una alerta estética con SweetAlert2 para confirmar la activación/inactivación
 * @param {string|number} id - ID del miembro
 * @param {string} nombreCompleto - Nombre y apellido del miembro
 * @param {number} estadoActual - 1 si está Activo, 0 si está Inactivo
 */
function confirmarCambioEstado(id, nombreCompleto, estadoActual) {
    // Configuramos visualmente la alerta dependiendo de la acción
    const esInactivar = estadoActual === 1;

    const titulo = esInactivar ? '¿Inactivar miembro?' : '¿Activar miembro?';
    const texto = esInactivar
        ? `¿Estás seguro de inactivar a ${nombreCompleto}? No aparecerá disponible para asignaciones de cultos ni creación de usuarios.`
        : `¿Deseas activar nuevamente a ${nombreCompleto} en el sistema SAIC?`;

    const icon = esInactivar ? 'warning' : 'question';
    const confirmButtonColor = esInactivar ? '#f43f5e' : '#16a34a'; // Rojo rosa para alertar, verde para activar
    const confirmButtonText = esInactivar ? 'Sí, inactivar' : 'Sí, activar';

    Swal.fire({
        title: titulo,
        text: texto,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: confirmButtonColor,
        cancelButtonColor: '#64748b', // Gris institucional sutil
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Cancelar',
        background: '#ffffff',
        customClass: {
            popup: 'rounded-4 shadow-sm', // Sincronizado con tus bordes suaves tipo Bento
            title: 'fw-bold text-dark'
        }
    }).then((result) => {
        // Si el usuario presiona el botón de confirmación, redirigimos al backend
        if (result.isConfirmed) {
            window.location.href = `/members/status/${id}`;
        }
    });
}