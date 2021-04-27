import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from api_db import add_farm, fetch_farms
from authentication_api import new_user,verify_otp,login
from farm_entry import new_entry,previous_entry,widget_info
import json

app = flask.Flask(__name__,template_folder='template')
app.config["DEBUG"] = True
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#API homepage

@app.route('/', methods=['GET'])
def home():
    return '''<h1>API homepage</h1>
<p>API for Farming</p>'''

#To upload Polygon this method will be used

@app.route('/postjson', methods = ['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def postJsonHandler():

    query_parameters = request.args
    key = query_parameters.get('key')

    content = request.get_json()
    #print(type(content))
    #content = json.loads(content_str)
    name = content['name']
    print(name)

    rows = add_farm(content, key, content['cropname'],name)
    json_op = {"id":rows, "farm_name":name}
    return jsonify(json_op)

@app.route('/userfarms', methods = ['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def user_farms():

    query_parameters = request.args
    key = query_parameters.get('key')

    return jsonify({"Active":fetch_farms(key)})
    

@app.route("/new_user/", methods=["POST", "GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def create_new_user():
    data = request.get_json()
    return new_user(data)


@app.route("/verify_otp/", methods=["POST", "GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def verify_the_otp():
    data = request.get_json()
    return verify_otp(data)


@app.route("/login/", methods=["POST", "GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def logging_in():
    data = request.get_json()
    return login(data)


@app.route("/post_entry/", methods=["POST", "GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def post_entry():
    data = request.get_json()
    return new_entry(data)

@app.route("/previous_entry/", methods=["POST", "GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def previous_entries():
    data = request.get_json()
    return previous_entry(data)


@app.route("/widgets/", methods=["POST", "GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def widgets():
    data = request.get_json()
    return widget_info(data)
app.run(host='127.0.0.1', port = 5010)
