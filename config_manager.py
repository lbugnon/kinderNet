# ======================================================
# Leandro Bugnon (lbugnon@sinc.unl.edu.ar)
# sinc(i) - http://sinc.unl.edu.ar/
# ======================================================
class ConfigManager():
    """
    Modulo simple para mantener estados durante la ejecucion. Eventualmente se puede pasar a una DB.
    """
    # def __init__(self,conf_dir,config=None):
    #     self.conf_dir=conf_dir

    #     if config is not None:
    #         params=self.load_config(config)
    #         self.save_config(params)

    @classmethod
    def load_config(cls,filename=None):

        if filename is None:
            filename="data/config"

        config={}
        for line in  open(filename):
            if line[0]=="#":
                continue
        
            line=line.strip().split("=")
            if len(line)!=2:
                continue

            val=line[1]

            comment_ind=val.find("#")
            if comment_ind != -1:
                val=val[:comment_ind]
            config[line[0]]=val
    
        return config
    
    @classmethod
    def save_config(cls,config,filename=None):

        if filename is None:
            filename="data/config"

        with open(filename,"w") as fout:
            for k in sorted(config.keys()):
                fout.write("%s=%s\n" %(k,config[k]))


    @classmethod
    def edit_config(cls,params,filename=None):
        """
        Levanta los parametros de configuración, edita los indicados en "params"
        y guarda el archivo.
        """
        if filename is None:
            filename="data/config"
            
        parameters = cls.load_config(filename)

        for p in params.keys():
            parameters[p] = params[p]

        cls.save_config(parameters,filename)

        return parameters

    @classmethod
    def clear_config(cls,filename=None):
        """
        Retear algunas configuraciones temporales. Los parametros relacionados a la arquitectura de la red y direcciones locales no se modifican.
        """
        if filename is None:
            filename="data/config"

        parameters = cls.load_config(filename)

        for p in parameters.keys():
            if "nimages" in p: 
                parameters[p] = 0

        cls.save_config(parameters,filename)



            
