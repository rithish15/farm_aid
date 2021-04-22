import pymysql
import json

def add_farm(content, key, cropname, name):
    
    db = pymysql.connect( 
    host='localhost', 
    user='root',  
    password = "1234", 
    db='web_services', 
    ) 
    print("database connected")
    cursor = db.cursor()

    get_user_det = "INSERT INTO polygonStore (polyinfo, clientID, active, farm_name, crop) VALUES (%s, %s, %s, %s, %s);"
    cursor.execute(get_user_det, (json.dumps(content), key, 1, name, cropname))
    db.commit()

    rowid = cursor.lastrowid
    cursor.execute('select * from polygonStore')    
    user_det = cursor.fetchall()

    print(rowid)
    db.close()
    return rowid

def fetch_farms(key):

    db = pymysql.connect( 
    host='localhost', 
    user='root',  
    password = "1234", 
    db='web_services', 
    ) 
    print("database connected")
    cursor = db.cursor()

    get_user_det = "SELECT id, farm_name FROM polygonStore WHERE clientID = %s"
    cursor.execute(get_user_det, (key))
    user_farms = cursor.fetchall()

    farm_li = []
    for i in user_farms:
        det = {}
        det['farmid'] = i[0]
        det['farmname'] = i[1]
        farm_li.append(det)
    #print(farm_li)

    return farm_li

"""
content = {
"type": "FeatureCollection",
"name": "C01",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
{ "type": "Feature", "properties": { "Name": "Shivananjappa - Sorghum", "tessellate": -1, "extrude": 0, "visibility": -1, "fid": 1.0, "layer": "C01 C01.kml", "Area": 1.61095216425805 }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 76.8069496, 11.9317645, 0.0 ], [ 76.806971, 11.9316123, 0.0 ], [ 76.808111, 11.9315887, 0.0 ], [ 76.8081217, 11.9320532, 0.0 ], [ 76.8069013, 11.9320663, 0.0 ], [ 76.8069496, 11.9317645, 0.0 ] ] ] } }
]
}
"""
#print(add_farm(content, 0000))
#fetch_farms(0)