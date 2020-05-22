#export ENV_FILE_LOCATION=./.env
from flask import Flask,jsonify,request
from flask_restful import Api,Resource
from flask_bcrypt import Bcrypt
from json import dumps
from models import Account, DataRecord, History
from db import initialize_db
from flask_jwt_extended import JWTManager, create_access_token, jwt_required ,get_jwt_identity
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
import datetime
import os
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


app = Flask(__name__)
app.config.from_envvar('ENV_FILE_LOCATION')
api = Api(app)
bcrypt = Bcrypt(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MONGODB_SETTINGS'] = {
    'host': 'mongodb://localhost/crab'
}

jwt = JWTManager(app)
initialize_db(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class SignupApi(Resource):
    def post(self):
        body = request.get_json()
        username = body['username']
        password = body['password']
        user = Account(username=username,password=password)
        user.hash_password()
        user.save()
        return {'id': str(user.id)}, 200

class LoginApi(Resource):
    def post(self):
        body = request.get_json()
        username = body['username']
        password = body['password']
        user = Account.objects.get(username=body['username'])
        authorized = user.check_password(body['password'])
        if not authorized:
            return {'error': 'Username or password invalid'}, 401
        expires = datetime.timedelta(days=7)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)
        return {'token': access_token}, 200

class PredictApi(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()
        now = datetime.datetime.now()
        file = request.files['file']

        if file and allowed_file(file.filename):

            fileExt = file.filename.rsplit('.', 1)[1].lower()
            path = os.path.join(app.config['UPLOAD_FOLDER'], str(datetime.datetime.timestamp(now))+"."+fileExt)
            file.save(path)
            # reponse

            return {'predict':100,'filename':str(path)},200
        return {'error':True,'message':'file is require'},400


#post is json
class HistoryApi(Resource):
    @jwt_required
    def get(self):
        history = History.objects().to_json()
        return {'data':history}
    def post(self):
        body = request.get_json()
        return body




api.add_resource(PredictApi, '/api/predict') # Route_1
api.add_resource(SignupApi, '/api/auth/signup')
api.add_resource(LoginApi, '/api/auth/login')
api.add_resource(HistoryApi,'/api/history')

if __name__ == '__main__':
     app.run()
