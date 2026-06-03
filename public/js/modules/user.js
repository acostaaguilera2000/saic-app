window.addEventListener('load', function () {
    if (typeof jQuery !== 'undefined') {
        $('#tabla-user').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[3, 'desc']], // Ordenar por fecha descendente

            language: {
                processing: "Procesando...",
                search: "Buscar miembros:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando del registro _START_ al _END_ de un total de _TOTAL_ usuarios",
                infoEmpty: "Mostrando 0 registros de 0",
                infoFiltered: "(filtrado de un total de _MAX_ registros)",
                loadingRecords: "Cargando ...",
                zeroRecords: "No se encontraron resultados que coincidan con la búsqueda",
                emptyTable: "No hay usuarios registrados en este momento",
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
 * Dispara una alerta de confirmación crítica antes de eliminar permanentemente un usuario
 * @param {string|number} userId - ID único del usuario a eliminar
 * @param {string} username - Nombre de usuario para contextualizar la alerta
 */
function confirmarEliminacion(userId, username) {
    Swal.fire({
        title: 'Eliminar usuario',
        text: `Estas seguro que quieres eliminar al usuario ${username} permanentemente del sistema  esta acción no se puede revertir `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f43f5e',
        cancelButtonColor: '#64748b', // Gris institucional sutil
        confirmButtonText: 'Sí, eliminar ',
        cancelButtonText: 'Cancelar',
        background: '#ffffff',
        customClass: {
            popup: 'rounded-4 shadow-sm',
            title: 'fw-bold text-dark'
        }
    }).then((result) => {
        // Si el usuario presiona el botón de confirmación, redirigimos al backend
        if (result.isConfirmed) {
            window.location.href = `/users/delete/${userId}`;
        }
    });
}