from torch.autograd import Variable
import torch.nn as nn
import torch.nn.functional as F
import torch
import os

class KinderNet(nn.Module):
    def __init__(self,nclasses):
        super(KinderNet, self).__init__()

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
        self.linear= nn.Linear(filt_out,nclasses)
                         
        
        self.optimizer=torch.optim.Adam([{"params": self.model.parameters(),"lr": 1e-4},{"params":self.linear.parameters(),"lr": 1e-4}])        
        self.criterion=torch.nn.CrossEntropyLoss()
        
        
                         
    def forward(self, x):
        x = self.model(x)
        x=self.linear(x.squeeze().unsqueeze(0))
        return x

    def run(self,im,label,train_mode):

        if os.path.isfile("static/model.par"):
            self.load_state_dict(torch.load("static/model.par"))
        
        
        self.train(train_mode)
        if train_mode:
            self.optimizer.zero_grad()
        
        im=torch.tensor(im).permute(2,0,1).unsqueeze(0).float()
        
        out=self.forward(Variable(im))
        print("etiqueta",label,"salida",out)

        if train_mode:
            label=torch.tensor([label],dtype=torch.long)
            loss=self.criterion(out,Variable(label)) 
            loss.backward()
            self.optimizer.step()
            return loss.item()
        return torch.argmax(out)
    def save(self):

        torch.save(self.state_dict(),"static/model.par")
            
