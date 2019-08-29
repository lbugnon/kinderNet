import os
from torch.autograd import Variable
import torch.nn as nn
import torch
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
from PIL import Image


class KinderNet(nn.Module):
    """
    Deep neural network.
    """
    def __init__(self, params):
        super(KinderNet, self).__init__()

        n_cat = int(params["n_categories"])
        self.model_dir = params["model_dir"]
        self.img_dir = params["img_dir"]
        self.batch = params["batch"]
        self.debug = bool(params["debug"])

        filters = [12, 24, 32]
        model = []
        for k, f in enumerate(filters):
            if k == 0:
                filter_in = 3
            else:
                filter_in = filter_out
            filter_out = f
            model.append(nn.Conv2d(filter_in, filter_out, kernel_size=5))
            model.append(nn.ELU())
            model.append(nn.BatchNorm2d(filter_out))
            model.append(nn.MaxPool2d((2, 2)))
            
        model.append(nn.AdaptiveAvgPool2d(1))
        self.model = nn.Sequential(*model)
        self.linear = nn.Linear(filter_out, n_cat)

        conv_conf = {"params": self.model.parameters(), "lr": 1e-4}
        linear_conf = {"params": self.linear.parameters(), "lr": 1e-4}
        self.optimizer = torch.optim.Adam([conv_conf, linear_conf])
        self.criterion = torch.nn.CrossEntropyLoss()

        if os.path.isfile(self.model_dir + "model.par"):
            print("load model")
            self.load_state_dict(torch.load(self.model_dir + "model.par"))

    def forward(self, x):
        x = self.model(x)
        x = x.squeeze()
        if len(x.shape) < 2:
            x = x.unsqueeze(0)
        x = self.linear(x)
        return x

    def run_train(self):
        """
        Use the current images to do an optimization step.
        :returns: Loss value.
        """
        # Dataloader
        dataset = ImageFolder(self.img_dir, transform=transforms.ToTensor())
        data_loader = DataLoader(dataset, batch_size=self.batch, shuffle=True)
        self.train()

        # Takes a small batch after each image update instead of a complete epoch
        data, label = next(iter(data_loader))

        self.optimizer.zero_grad()
        out = self.forward(Variable(data))
        loss = self.criterion(out, Variable(label))
        loss.backward()
        self.optimizer.step()
        
        return loss.item()

    def run_test(self, img: Image):
        """
        Classify the input image.

        :param img; Input image
        :returns: Image category
        """
        self.eval()

        img = transforms.ToTensor()(img.convert("RGB")).unsqueeze(0).float()

        out = self.forward(Variable(img))

        output = int(torch.argmax(out.detach()))

        if self.debug:
            print("Modo test; salida ", out.tolist(), "clase ", output)

        return output

    def save(self):
        """
        Saves network parameters to model folder.
        :return: None
        """
        torch.save(self.state_dict(), self.model_dir + "model.par")
