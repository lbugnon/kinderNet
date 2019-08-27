﻿##### [sinc(i)](http://www.sinc.unl.edu.ar) - Instituto de Investigación en Señales, Sistemas e Inteligencia Computacional.
## KinderNet
Este repositorio es un proyecto de aplicación web para aprender sobre redes neuronales con alumnos de primaria/secundaria. El objetivo es que la aplicación sea interactiva y puedan jugar y experimentar con el proceso de entrenamiento y prueba de algoritmos de aprendizaje automático. 

Autores (por orden alfabético): L. Bugnon, D. Milone, J. Raad, G. Stegmayer, C. Yones.   
### Instalación
Desde la carpeta raiz del repositorio:
- Instalar [Python>=3.5](https://www.python.org/downloads/). 
- Utilizando el gestor de paquetes pip, instalar los modulos de python con "python -m pip install --user -r requirements.txt". Si se utiliza un gestor basado en Anaconda, instalar con "conda install --file requirements.txt". 
- Instalar [node.js](https://nodejs.org/en/download/)
- Instalar los paquetes necesarios para la interfaz de usuario con "npm --prefix frontend/ install react-scripts react-webcam @material-ui/core". Estos paquetes se instalarán localmente en el directorio frontend/node_modules.

En caso de que surjan errores en la instalación del paquete torch con los repositorios tradicionales (pip o conda), seguir las instrucciones para su sistema operativo en [https://pytorch.org/](https://pytorch.org/).

## Levantar la aplicación (en "modo rápido")
- Levantar el servidor: desde el directorio raiz del proyecto ejecutar "python backend.py".
- En otra consola, correr "npm start --prefix frontend/". La aplicación debería abrirse automáticamente en [http://localhost:3000](http://localhost:3000).

