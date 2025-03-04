@echo off
echo Configurando repositorio Git para HORA_MUNDIAL...

REM Configurar usuario y correo de Git
git config user.name "Bazamus"
git config user.email "bazamus@gmail.com"

REM Inicializar repositorio Git si no existe
if not exist .git (
    echo Inicializando repositorio Git...
    git init
) else (
    echo Repositorio Git ya inicializado.
)

REM Añadir el repositorio remoto
echo Configurando repositorio remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/Bazamus/HORA_MUNDIAL.git

REM Añadir todos los archivos al staging
echo Añadiendo archivos al staging...
git add .

REM Hacer commit inicial
echo Creando commit inicial...
git commit -m "Versión inicial de la aplicación Hora Mundial"

REM Subir al repositorio remoto
echo Subiendo al repositorio remoto...
git push -u origin master

echo Proceso completado. Verifica si hay algún error en los mensajes anteriores.
echo Si el push falló, es posible que necesites autenticarte en GitHub.
