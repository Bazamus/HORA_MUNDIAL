Write-Host "Configurando repositorio Git para HORA_MUNDIAL..." -ForegroundColor Cyan

# Configurar usuario y correo de Git
git config user.name "Bazamus"
git config user.email "bazamus@gmail.com"

# Inicializar repositorio Git si no existe
if (-not (Test-Path .git)) {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "Repositorio Git ya inicializado." -ForegroundColor Green
}

# Añadir el repositorio remoto
Write-Host "Configurando repositorio remoto..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/Bazamus/HORA_MUNDIAL.git

# Añadir todos los archivos al staging
Write-Host "Añadiendo archivos al staging..." -ForegroundColor Yellow
git add .

# Hacer commit inicial
Write-Host "Creando commit inicial..." -ForegroundColor Yellow
git commit -m "Versión inicial de la aplicación Hora Mundial"

# Subir al repositorio remoto
Write-Host "Subiendo al repositorio remoto..." -ForegroundColor Yellow
git push -u origin master

Write-Host "Proceso completado. Verifica si hay algún error en los mensajes anteriores." -ForegroundColor Green
Write-Host "Si el push falló, es posible que necesites autenticarte en GitHub." -ForegroundColor Yellow
