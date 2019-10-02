##### [sinc(i)](http://www.sinc.unl.edu.ar) - Instituto de Investigación en Señales, Sistemas e Inteligencia Computacional.
## KinderNet
Este repositorio es un proyecto de aplicación web para aprender sobre redes neuronales con alumnos de primaria/secundaria. El objetivo es que la aplicación sea interactiva y puedan jugar y experimentar con el proceso de entrenamiento y prueba de algoritmos de aprendizaje automático. 

*Autores (por orden alfabético): L. Bugnon, D. Milone, J. Raad, G. Stegmayer, C. Yones.*   
### Instalación
Desde la carpeta raiz del repositorio:
1. Instalación del servidor
    
    1.1 Instalar [Python>=3.5](https://www.python.org/downloads/). 

    1.2 Instalar los modulos de Python.
    Con pip:
    ```bash
    python -m pip install --user -r requirements.txt
    ```
    Con algun gestor basado en Anaconda:
    ```bash
    conda install --file requirements.txt
    ```
    En caso de que surjan errores en la instalación del paquete torch con los repositorios tradicionales (pip o conda), seguir las instrucciones para su sistema operativo en [https://pytorch.org/](https://pytorch.org/).
    
2. Instalación de la interfaz de usuario:
    
    2.1 Instalar [node.js](https://nodejs.org/en/download/).

    2.2 Instalar los paquetes necesarios con el siguiente comando. Estos paquetes se instalarán localmente en el directorio "frontend/node_modules".
    ``` 
    npm --prefix frontend/ install react-scripts react-webcam @material-ui/core
    ```

3. Explorador web: Por lo pronto funciona bien en Chrome/Chromium > 76 y Opera > 69. En Firefox y Edge esta fallando el dibujo SVG. En IE no anda. 

## Levantar la aplicación (en "modo rápido")
- Levantar el servidor: desde el directorio raiz del proyecto ejecutar 
    ```
    python backend.py
    ```
- En otra consola, correr 
    ```
    npm start --prefix frontend/
    ```
    La aplicación debería abrirse automáticamente en [http://localhost:3000](http://localhost:3000). Si el puerto 3000 esta ocupado, en esta consola se sugerirá otro puerto.

## Controles
- Teclas numéricas para entrenar ("1" entrena con la entrada actual para la clase 1, "2" para la clase 2, ...).
- "a" y "z": Cambia la cantidad de salidas.
- "+" y "-": Cambia el tamaño de la red.
- "c": Clasifica la entrada actual. Por defecto luego de 4 segundos se activa la clasificación automáticamente. 

## TODO
- agregar controles en la imagen
- hacer actividades diferenciales para primaria/secundaria