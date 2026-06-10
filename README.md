# SAIC - Sistema Administrativo para Iglesias Cristianas

Bienvenido al repositorio oficial de **SAIC**. Este sistema está diseñado para centralizar, automatizar y optimizar la gestión de membresías, la planificación de actividades litúrgicas y la auditoría interna de finanzas (diezmos, ofrendas y egresos).

Este documento funciona como una guía técnica completa y detallada paso a paso para configurar, instalar e inicializar el entorno de desarrollo de manera local en su equipo.

---

## 🚀 Guía Completa de Instalación Local

Siga minuciosamente cada uno de los siguientes pasos para desplegar la aplicación en su entorno local:

### Paso 1: Descargar e Instalar las Herramientas Requeridas
Antes de manipular el código, asegúrese de descargar e instalar los siguientes componentes de software en su sistema operativo:

1. **Node.js:** Descargue e instale la versión LTS recomendada desde su sitio oficial -> [https://nodejs.org/](https://nodejs.org/). (Esto proveerá el entorno de ejecución para Javascript y el gestor de paquetes `npm`).
2. **XAMPP:** Descargue e instale el paquete desde -> [https://www.apachefriends.org/](https://www.apachefriends.org/). Asegúrese de incluir los módulos de **Apache** y **MySQL** durante la instalación.
3. **Git:** Descargue e instale el controlador de versiones desde -> [https://git-scm.com/](https://git-scm.com/).
4. **Editor de Código:** Se recomienda utilizar **Visual Studio Code** para explorar la arquitectura del proyecto.

### Paso 2: Descargar el Proyecto e Inicializar el Repositorio
Abra su terminal, consola de comandos (CMD) o la terminal integrada de Git (Git Bash) y ejecute las siguientes instrucciones para clonar los archivos del maquetado y acceder a la carpeta:

```bash
# 1. Clonar el repositorio oficial del proyecto
git clone [https://github.com/acostaaguilera2000/saic-app.git](https://github.com/acostaaguilera2000/saic-app.git)

# 2. Ingresar a la carpeta raíz que se acaba de crear
cd saic-app

# 3. Inicializar Git en el directorio local en caso de ser necesario
git init
Paso 3: Instalar las Dependencias del Backend
SAIC utiliza diversos módulos de Node.js (tales como express, mysql2, bcrypt, connect-flash, entre otros). Para descargar e instalar de forma automática todas las dependencias listadas en el archivo package.json, ejecute el siguiente comando en su terminal:

Bash
npm install
Paso 4: Configurar la Base de Datos con XAMPP
Abra el panel de control de XAMPP en su computadora.

Encienda los servicios de Apache y MySQL haciendo clic en sus respectivos botones "Start".

Abra su navegador web preferido e ingrese a la dirección de administración local: http://localhost/phpmyadmin/.

Cree una nueva base de datos vacía haciendo clic en la opción "Nueva" en el panel izquierdo. Asígnele estrictamente el nombre: saic_db.

Seleccione la base de datos saic_db que acaba de crear y haga clic en la pestaña "Importar" ubicada en el menú superior.

Haga clic en el botón Seleccionar archivo. Nota importante: Diríjase a la carpeta del proyecto que clonó en el Paso 2; allí, en la raíz principal, encontrará el archivo de respaldo listo para usar llamado saic_db.sql. Selecciónelo.

Vaya al fondo de la página de phpMyAdmin y presione el botón "Importar" (o "Continuar") para cargar de manera automática la estructura de las tablas, relaciones, roles y datos iniciales del sistema.

Paso 5: Parámetros y Credenciales de Conexión de Fábrica
Para el correcto enlace entre el servidor backend y la base de datos en su entorno local, el código utiliza las siguientes credenciales preconfiguradas:

Servidor (Host): localhost

Usuario de login al sistema : root@gmail.com

Contraseña de login al sitema: root123 

🏃‍♂️ Ejecución del Servidor
Una vez completados con éxito todos los pasos de la instalación y la base de datos, proceda a encender el servidor web local. Ejecute el siguiente comando en la terminal de Visual Studio Code:

Bash
npm start
El servidor backend se levantará inmediatamente y se quedará escuchando las peticiones. Para interactuar con las interfaces del sistema, abra su navegador web e ingrese a la siguiente URL:
👉 http://localhost:3000

🔒 Nota de Seguridad y Escalabilidad
Nota técnica para evaluación: Esta configuración y exposición de credenciales está diseñada exclusivamente para fines de revisión académica en la Fase de Ejecución del SENA. En la fase posterior de despliegue real en producción, todos los datos de acceso, variables de entorno y claves de la base de datos se trasladarán a un archivo protegido .env que se excluirá del control de versiones mediante .gitignore para salvaguardar la privacidad de la iglesia.

👤 Autor
Manuel Andrés Acosta Aguilera - Aprendiz en Análisis y Desarrollo de Software (SENA) - Fase de Ejecución.