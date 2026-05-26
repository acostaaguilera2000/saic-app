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
script.
    window.confirmarEliminacion = function (id, nombre) {
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario "${nombre}"?`)) {
            window.location.href = `/users/delete/${id}`;
        }
    };