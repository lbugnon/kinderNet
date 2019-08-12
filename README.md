## KinderNet
Este repositorio es un proyecto de aplicación web para aprender redes neuronales con alumnos de primaria/secundaria mediante ejemplos. El objetivo es que la aplicación sea interactiva y puedan jugar y experimentar con el proceso de entrenamiento y prueba de algoritmos de aprendizaje automático. 

### Instalación
- Instalar los modulos de python con "python -m pip install --user -r requirements.txt"
- en la carpeta del proyecto, "export FLASK_APP=main.py"
- Levantar el servidor con "python -m flask run", se puede ver en "http://127.0.0.1:5000/"

### TODO
- Ya esta funcionando el entrenamiento y test. Habria que ajustar el modelo para llegar a entrenar con pocos ejemplos. Evaluar si no es necesario hacer batches (por ahora se entrena de a 1 imagen). 
- Interfaz, ordenar todo. Eventualmente se podría hacer en Aangular para agregar algunos menues, info del lab y demás 
- hacer un paquete o subir a pythonanywhere
