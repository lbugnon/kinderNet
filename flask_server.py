from flask import Flask, request
from flask_restful import Api
from flask_cors import CORS
from models import Index, Train, Classify, ChangeNet

app = Flask(__name__)
cors= CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Cache en horas
app.config["TEMPLATES_AUTORELOAD"] = True
api=Api(app)


# api.add_resource(Main, '/')
api.add_resource(Train, '/entrenar')
api.add_resource(Classify, '/clasificar')
api.add_resource(ChangeNet, '/modificarRed')
# api.add_resource(About, '/about/')


if __name__ == '__main__':
    app.run(debug=True)
