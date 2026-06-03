
    window.addEventListener('load', function() {
        // 1. Inicialización y Gestión de DataTables
        if (typeof jQuery !== 'undefined') {
            $('#tabla-cronograma-cultos').DataTable({
                pageLength: 10,
                lengthMenu: [5, 10, 25, 50],
                order: [[1, 'desc']],
                dom: "<'row mb-3 align-items-center'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6 d-flex justify-content-md-end'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row mt-3 align-items-center'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 d-flex justify-content-md-end'p>>",
                language: {
                    processing: "Procesando...",
                    search: "Buscar servicios:",
                    lengthMenu: "Mostrar _MENU_ registros",
                    info: "Mostrando del registro _START_ al _END_ de un total de _TOTAL_ servicios",
                    infoEmpty: "Mostrando 0 registros de 0",
                    infoFiltered: "(filtrado de un total de _MAX_ registros)",
                    loadingRecords: "Cargando cronograma...",
                    zeroRecords: "No se encontraron servicios que coincidan con la búsqueda",
                    emptyTable: "No hay reuniones agendadas en este momento",
                    paginate: {
                        first: "«",
                        previous: "‹",
                        next: "›",
                        last: "»"
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

        // 2. Captura y despliegue de mensajes Flash con SweetAlert2
        const successFlash = document.getElementById("success-flash");
        const errorFlash = document.getElementById("error-flash");

        if (successFlash) {
            Swal.fire({
                icon: 'success',
                title: '¡Operación Exitosa!',
                text: successFlash.value,
                timer: 3000,
                showConfirmButton: false,
                confirmButtonColor: '#212529'
            });
        }

        if (errorFlash) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Procesamiento',
                text: errorFlash.value,
                confirmButtonColor: '#d33'
            });
        }

        // 3. Manejador de confirmación avanzada de eliminación por delegación de eventos
        document.addEventListener("click", function(e) {
            const button = e.target.closest(".btn-delete-service");
            if (!button) return;

            const serviceId = button.getAttribute("data-id");
            const serviceName = button.getAttribute("data-name");
            const serviceDate = button.getAttribute("data-date");

            Swal.fire({
                title: '¿Está seguro de eliminarlo?',
                text: `Se borrará la programación del servicio "${serviceName}" fechado el ${serviceDate}. Esta acción es irreversible.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar de la agenda',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `/service/delete/${serviceId}`;
                }
            });
        });
    });