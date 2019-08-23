##### [sinc(i)](http://www.sinc.unl.edu.ar) - Instituto de Investigación en Señales, Sistemas e Inteligencia Computacional.
## KinderNet
Este repositorio es un proyecto de aplicación web para aprender sobre redes neuronales con alumnos de primaria/secundaria. El objetivo es que la aplicación sea interactiva y puedan jugar y experimentar con el proceso de entrenamiento y prueba de algoritmos de aprendizaje automático. 

Autores (por orden alfabético): L. Bugnon, D. Milone, J. Raad, G. Stegmayer, C. Yones.   
### Instalación
Se requiere tener python>=3.5 instalado. Desde la carpeta raiz del repositorio:
- Utilizando el gestor de paquetes pip, instalar los modulos de python con "python -m pip install --user -r requirements.txt". Si se utiliza un gestor basado en Anaconda, instalar con "conda install --file requirements.txt". 
- Instalar [node.js](https://nodejs.org/en/download/)
- Instalar los paquetes necesarios para React con "npm --prefix frontend/ install react-scripts react-webcam @material-ui/core". Estos paquetes se instalarán localmente en el directorio frontend/node_modules.

En caso de que surjan errores en la instalación del paquete torch, seguir las instrucciones en [https://pytorch.org/](https://pytorch.org/).

## Levantar el servidor local (en "modo rápido")
- Levantar el servidor con "python flask_server.py".
- En otra consola, correr "npm start --prefix front/". La aplicación debería abrirse automáticamente en [http://localhost:3000](http://localhost:3000).


### TODO
- Se podria montar en un servidor. Para uso local, React se puede integrar en Electron pero para correr python hay que hacerlo de otra manera (hay que reemplazar flask por el uso de la pc local)
- Ya esta funcionando el entrenamiento y test. Habria que ajustar el modelo para llegar a entrenar con pocos ejemplos. Evaluar si no es necesario hacer batches (por ahora se entrena de a 1 imagen). 
- Interfaz, ordenar los componentes y normalizar el template. 
- Se puede agregar un cartel de confirmación antes de resetear la red
