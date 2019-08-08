import cv2 as cv
import shutil,os
print("hello from python")

# Se puede usar un archivo de configuración de estados, y armar la lógica en este script.  
shutil.rmtree('data/',ignore_errors=True)
os.mkdir("data/")
cam = cv.VideoCapture(0) # TODO puede ser que el indice de la camara no sea 1, se puede agregar a configuracion
k=0
while 1:
    ok, img = cam.read()
    print(ok)
    k+=1
    if ok and k==10: # Lee el buffer todo el tiempo pero guarda cada tanto 
        cv.imwrite("data/pic.jpg",img) 
        k=0
    
