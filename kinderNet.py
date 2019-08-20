from torch.autograd import Variable
import torch.nn as nn
import torch.nn.functional as F
import torch
import os
from torchvision import transforms 

class KinderNet(nn.Module):
    def __init__(self,params):
        super(KinderNet, self).__init__()

        ncategories=int(params["ncategories"])
        self.model_dir=params["model_dir"]
        
        filters=[12,24,32]
        model=[]
        for k,f in enumerate(filters):
            if k==0:
                filt_in=3
                filt_out=f
            else:
                filt_in=filt_out
                filt_out=f
            model.append(nn.Conv2d(filt_in, filt_out, kernel_size=5))
            model.append(nn.ELU())
            model.append(nn.BatchNorm2d(filt_out))
            model.append(nn.MaxPool2d((2,2)))
            
        #model.append(nn.Conv2d(filt_out,1,kernel_size=1))
        model.append(nn.AdaptiveAvgPool2d(1))
        self.model = nn.Sequential(*model)
        self.linear= nn.Linear(filt_out,ncategories)
                         
        
        self.optimizer=torch.optim.Adam([{"params": self.model.parameters(),"lr": 1e-4},{"params":self.linear.parameters(),"lr": 1e-4}])        
        self.criterion=torch.nn.CrossEntropyLoss()
        
        
                         
    def forward(self, x):
        x = self.model(x)
        x=self.linear(x.squeeze().unsqueeze(0))
        return x

    def run(self,im,label=0,train_mode=False):
        """
        Realiza una iteración con el modelo, sea para entrenar o evaluar.
        
        :param im: Imagen de entrada de la clase PIL.Image
        :param label: Etiqueta de la clase a entrenar. En predicción se ignora
        :param train_mode: Booleano que indica si se va a entrenar o se hará predicción.
        
        :returns: Valor de la función de costo (loss) en caso de train_mode = True, sino devuelve la clase estimada. 
        """
        # TODO: ver si hay alguna forma de tener una "variable global" en el servidor; para esta aplicacion paraece que no hay problema de bajar y subir del disco
        if os.path.isfile(self.model_dir+"model.par"):
            self.load_state_dict(torch.load(self.model_dir+"model.par"))
        
        self.train(train_mode)
        if train_mode:
            self.optimizer.zero_grad()
        
        im=transforms.ToTensor()(im.convert("RGB")).unsqueeze(0).float()
        
        out=self.forward(Variable(im))

        
        if train_mode:
            label=torch.tensor([label],dtype=torch.long)
            loss=self.criterion(out,Variable(label)) 
            loss.backward()
            self.optimizer.step()

            # debug
            print("Modo train; etiqueta ",int(label),"salida ",out.detach().tolist())

            return loss.item()

        # debug
        output=int(torch.argmax(out.detach()))
        print("Modo test; salida ",out.tolist(), "clase ",output )
        
        return output

    
    def save(self):

        torch.save(self.state_dict(),self.model_dir+"model.par")
            
