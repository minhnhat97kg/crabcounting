from db import db
from flask_bcrypt import generate_password_hash, check_password_hash

class Account(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, min_length=6)
    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')
    def check_password(self, password):
        return check_password_hash(self.password, password)

class DataRecord(db.Document):
    image = db.StringField(required=True)
    predict = db.IntField(required=True)

class History(db.Document):
    date =  db.DateTimeField(required=True)
    list = db.ListField(DataRecord)
    user = db.ReferenceField(Account)