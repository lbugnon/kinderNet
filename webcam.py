import cv2 as cv
from config_manager import save_config,load_config,edit_config

def take_pic():
    """
    Take a picture from webcam. 
    """
    # TODO: posiblemente convenga hacer un proceso asincrono

    params=load_config("config")
    params["nimg"]=int(params["nimg"])+1
    save_config(params,"config")
    
    cam = cv.VideoCapture(0) # TODO puede ser que el indice de la camara no sea 1, se puede agregar a configuracion
    ok, img = cam.read()
    if ok:
        cv.imwrite(params["input_img"],img) 
        
        print(params["input_img"])
        return img
    return []
