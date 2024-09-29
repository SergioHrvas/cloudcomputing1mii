# HITO 1a - REPOSITORIO

## PREPARACIÓN DEL REPOSITORIO
1. Compruebo que tengo instalado Git.
        $ git -v
    
![Git instalado](/img/git.png)

2. Hago fork del repositorio de la asignatura y creo uno nuevo para el proyecto:
- [Fork](https://github.com/SergioHrvas/CC-24-25)
- [Proyecto](https://github.com/SergioHrvas/CloudComputing1MII)

3. Configurar datos del repositorio
- Cambiamos username: 
        $ git config --global user.name "Sergio Hervás Cobo"
- Cambiamos correo:
        $ git config --global user.email sergiohervas18@gmail.com
-Comprobamos los cambios:
        $ git config --list

![Configuramos los datos](/img/git_data.png)

4. Actualización de los datos de GitHub
![Perfil de GitHub](/img/perfil.png)

5. Creación de clave y subida a GitHub
- Generamos la clave
        $ ssh-keygen -t ed25519 -C "sergiohervas18@gmail.com"
![Obtenemos la clave](/img/git_token.png)

- Buscamos la clave y la copiamos
        cat ~/.ssh/id_ed25519.pub       

- Iniciamos el agente SSH en segundo plano
        eval "$(ssh-agent -s)"
![Iniciamos agente ssh](/img/eval.png)

- Agregamos la clave privada al ssh-agent
                ssh-add ~/.ssh/id_ed25519
![ssh-add](/img/ssh_add.png)

- Subimos la clave a GitHub
![Subimos la clave](/img/github_token.png)

## LICENCIA
- He usado la licencia [MIT](/LICENSE)

