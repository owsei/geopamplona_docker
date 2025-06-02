from typing import Union
from fastapi import FastAPI
from fastapi import HTTPException
import servicePostGIS
import psycopg2
import dbConfig
from fastapi.middleware.cors import CORSMiddleware
import base64
import requests


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/db-status")
def db_status():
    try:
        conn = psycopg2.connect(**dbConfig.DB_CONFIG)
        conn.close()
        return {"status": "PostGIS is connected"}
    except Exception as e:
        return {"status": f"Failed to connect: {e}"}
    

# Endpoint para obtener un GeoJSON de una tabla espacial.
@app.get("/getgeojson/{table_name}")
def get_geojson(table_name: str):
    print (f"Obteniendo GeoJSON de la tabla: {table_name}")
    geojson = servicePostGIS.get_geojson_from_table(table_name)
    if geojson:
        return geojson
    else:
        raise HTTPException(status_code=404, detail="No se encontraron datos o la tabla no existe")
    

@app.get("/tablesgeopamplona")
def get_tables_geopamplona():
    print (f"Obteniendo tablas de la base de datos")
    tables = servicePostGIS.get_tables_geopamplona()
    if tables:
        # print (f"Tablas obtenidas: {tables}")
        # print(tables)
        return tables
    else:
        raise HTTPException(status_code=404, detail="No se encontraron tablas o la base de datos no existe")




@app.get("/getgeolayer")
def get_geoserver_layer():
    GEOSERVER_URL = "http://geoserver:8080/geoserver/rest/layers.xml"
    USERNAME = "admin"
    PASSWORD = "geoserver"

    credentials = f"{USERNAME}:{PASSWORD}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Accept": "application/xml"
    }

    print(f"Obteniendo capa de Geoserver desde: {GEOSERVER_URL}")
   
    response = requests.get(GEOSERVER_URL, headers=headers)
    
    if response.status_code == 200:
        return response.text
    else:
        raise HTTPException(status_code=response.status_code, detail="Error al obtener la capa de Geoserver")
