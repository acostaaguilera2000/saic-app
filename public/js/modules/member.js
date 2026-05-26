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
window.confirmarEliminacion = function (id, nombreCompleto) {
    if (confirm(`¿Estás seguro de que deseas dar de baja del sistema al miembro "${nombreCompleto}"?\nEsta acción restringirá su vinculación a nuevas cuentas.`)) {
        window.location.href = `/members/delete/${id}`;
    }
};