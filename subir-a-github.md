# Instrucciones para subir el proyecto a GitHub

## Opción 1: Usando PowerShell (Recomendado)

1. Abre PowerShell como administrador
2. Navega hasta la carpeta del proyecto:
   ```powershell
   cd "c:\Users\David.Rey\Desktop\WEB_SERVICIOS\proyectos_portfolio\HORA_MUNDIAL"
   ```
3. Ejecuta el script de configuración:
   ```powershell
   .\setup-github.ps1
   ```
4. Si se te solicita autenticación, inicia sesión con tus credenciales de GitHub (usuario: Bazamus)

## Opción 2: Usando el Símbolo del Sistema (CMD)

1. Abre el Símbolo del Sistema como administrador
2. Navega hasta la carpeta del proyecto:
   ```cmd
   cd "c:\Users\David.Rey\Desktop\WEB_SERVICIOS\proyectos_portfolio\HORA_MUNDIAL"
   ```
3. Ejecuta el script de configuración:
   ```cmd
   setup-github.bat
   ```
4. Si se te solicita autenticación, inicia sesión con tus credenciales de GitHub (usuario: Bazamus)

## Opción 3: Comandos manuales

Si prefieres ejecutar los comandos manualmente, sigue estos pasos:

1. Abre una terminal en la carpeta del proyecto
2. Configura tu usuario y correo de Git:
   ```bash
   git config user.name "Bazamus"
   git config user.email "bazamus@gmail.com"
   ```
3. Inicializa el repositorio Git (si no existe):
   ```bash
   git init
   ```
4. Configura el repositorio remoto:
   ```bash
   git remote add origin https://github.com/Bazamus/HORA_MUNDIAL.git
   ```
5. Añade todos los archivos al staging:
   ```bash
   git add .
   ```
6. Crea el commit inicial:
   ```bash
   git commit -m "Versión inicial de la aplicación Hora Mundial"
   ```
7. Sube los cambios al repositorio remoto:
   ```bash
   git push -u origin master
   ```

## Nota importante sobre la autenticación

GitHub ya no acepta autenticación con contraseña a través de la línea de comandos. Deberás usar un token de acceso personal:

1. Ve a [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Genera un nuevo token con los permisos de "repo"
3. Usa este token como contraseña cuando Git te solicite credenciales

Alternativamente, puedes configurar la autenticación con SSH siguiendo [estas instrucciones](https://docs.github.com/es/authentication/connecting-to-github-with-ssh).
