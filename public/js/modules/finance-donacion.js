window.addEventListener('load', function () {
    if (typeof jQuery !== 'undefined') {
        $('#tabla-donaciones').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[3, 'desc']], // Ordenar por fecha descendente

            language: {
                processing: "Procesando...",
                search: "Buscar Registros:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando del registro _START_ al _END_ de un total de _TOTAL_ Ingresos",
                infoEmpty: "Mostrando 0 registros de 0",
                infoFiltered: "(filtrado de un total de _MAX_ registros)",
                loadingRecords: "Cargando ...",
                zeroRecords: "No se encontraron resultados que coincidan con la búsqueda",
                emptyTable: "No hay Ingresos registrados en este momento",
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


// confrmar anulacion si hubo error al ingresar el monto para mantener consistencia 

function confirmarAnulacion(idDonacion, aportante, monto) {
    Swal.fire({
        title: 'Anular Transacción',
        text: `¿Estás seguro de que deseas anular permanentemente la donación de ${aportante} por un valor de $${monto}? Esta acción no se puede revertir.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f43f5e',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, anular asiento',
        cancelButtonText: 'Cancelar',
        background: '#ffffff',
        customClass: { popup: 'rounded-4 shadow-sm', title: 'fw-bold text-dark' }
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById(`cancel-form-${idDonacion}`).submit();
        }
    });
}