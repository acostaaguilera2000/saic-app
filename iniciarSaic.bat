@echo off
title Iniciando SAIC - Sistema Administrativo
echo ===================================================
echo   Iniciando modulo de Programacion de Cultos...
echo ===================================================

:: 1. Cambiar a la ruta de la carpeta de SAIC (PEGA TU RUTA AQUÍ)
cd /d "C:\Users\isacn\saic-app"

:: 2. Abrir el navegador en el módulo de cultos automáticamente
start http://localhost:3000/cultos

:: 3. Ejecutar el script VBS pasando "npm start" como argumento corregido
wscript.exe invisible.vbs "npm start"