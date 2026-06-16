document.addEventListener("DOMContentLoaded", () => {
    const sidebarElement = document.getElementById("sidebarMenu");
    const triggerBtn = document.querySelector(".btn-trigger-sidebar");

    if (sidebarElement && typeof bootstrap !== "undefined") {
        // Inicializamos el componente nativo Offcanvas de Bootstrap 5
        const bsOffcanvas = new bootstrap.Offcanvas(sidebarElement, {
            backdrop: true,
            scroll: false
        });

        // Aseguramos el comportamiento responsivo dinámico al cambiar tamaños de pantalla
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 992) {
                bsOffcanvas.hide();
                sidebarElement.style.visibility = "visible";
            }
        });
    }
});