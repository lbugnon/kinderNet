##### [sinc(i)](http://www.sinc.unl.edu.ar) - Instituto de Investigación en Señales, Sistemas e Inteligencia Computacional.
## KinderNet
Este repositorio es un proyecto de aplicación web para aprender sobre redes neuronales con alumnos de primaria/secundaria. El objetivo es que la aplicación sea interactiva y puedan jugar y experimentar con el proceso de entrenamiento y prueba de algoritmos de aprendizaje automático. 

Autores (por orden alfabético): L. Bugnon, D. Milone, J. Raad, G. Stegmayer, C. Yones.   
### Instalación
- En caso de utilizar el gestor de paquetes pip, instalar los modulos de python con "python -m pip install --user -r requirements.txt"
- 
## Levantar el servidor local (en "modo rápido")
- (tal vez no es necesario) en la carpeta del proyecto, "export FLASK_APP=main.py". En Windows '$env:FLASK_APP = "main"'
- Levantar el servidor con "python flask_server.py".
- En otra consola, correr "npm start --prefix front/". La aplicación debería abrirse automáticamente en [http://localhost:3000](http://localhost:3000).


### TODO
- Ya esta funcionando el entrenamiento y test. Habria que ajustar el modelo para llegar a entrenar con pocos ejemplos. Evaluar si no es necesario hacer batches (por ahora se entrena de a 1 imagen). 
- Interfaz, ordenar los componentes y normalizar el template. Eventualmente se podría hacer en Angular para agregar algunos menues, info del lab y demás 
- Revisar las teclas (quedaron muy juntas... se puede agregar un cartel de confirmación en las que borran todo)
- hacer un paquete o subir a pythonanywhere
