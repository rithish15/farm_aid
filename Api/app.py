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

@app.route("/weather/", methods=["POST", "GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def weather():
    output = {
    "result_weather": [
        {
            "date": "27-04-2021",
            "day": 300.22,
            "desc": "light rain",
            "max": 303.03,
            "min": 293.54
        },
        {
            "date": "28-04-2021",
            "day": 301.17,
            "desc": "moderate rain",
            "max": 302.41,
            "min": 290.87
        },
        {
            "date": "29-04-2021",
            "day": 294.44,
            "desc": "clear sky",
            "max": 297.41,
            "min": 286.08
        },
        {
            "date": "30-04-2021",
            "day": 293.92,
            "desc": "clear sky",
            "max": 298.44,
            "min": 283.91
        },
        {
            "date": "01-05-2021",
            "day": 303.6,
            "desc": "few clouds",
            "max": 307.73,
            "min": 288.64
        },
        {
            "date": "02-05-2021",
            "day": 309.66,
            "desc": "scattered clouds",
            "max": 312.79,
            "min": 293.23
        },
        {
            "date": "03-05-2021",
            "day": 308.71,
            "desc": "clear sky",
            "max": 311.42,
            "min": 295.19
        },
        {
            "date": "04-05-2021",
            "day": 306.91,
            "desc": "clear sky",
            "max": 309.59,
            "min": 293.35
        }
    ]
}
    return output

    
app.run(host='127.0.0.1', port = 5010)
