import psycopg2
import requests
import xml.etree.ElementTree as ET

# CONFIGURACIÓN
GEOSERVER_URL = "http://localhost:8080/geoserver"
GEOSERVER_USER = "admin"
GEOSERVER_PASS = "geoserver"
WORKSPACE = "mi_workspace"
DATASTORE = "mi_datastore"

DB_CONFIG = {
    "host": "localhost",
    "port": "5432",
    "dbname": "mi_bd",
    "user": "mi_usuario",
    "password": "mi_clave"
}

# 1. OBTENER TABLAS ESPACIALES DE POSTGIS
def get_spatial_tables():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("""
        SELECT f_table_schema, f_table_name
        FROM geometry_columns
    """)
    tablas = cur.fetchall()
    conn.close()
    return tablas

# 2. CREAR DATASTORE EN GEOSERVER
def crear_datastore():
    url = f"{GEOSERVER_URL}/rest/workspaces/{WORKSPACE}/datastores"
    headers = {'Content-type': 'text/xml'}
    data = f"""
    <dataStore>
        <name>{DATASTORE}</name>
        <connectionParameters>
            <host>{DB_CONFIG['host']}</host>
            <port>{DB_CONFIG['port']}</port>
            <database>{DB_CONFIG['dbname']}</database>
            <user>{DB_CONFIG['user']}</user>
            <passwd>{DB_CONFIG['password']}</passwd>
            <dbtype>postgis</dbtype>
        </connectionParameters>
    </dataStore>
    """
    r = requests.post(url, auth=(GEOSERVER_USER, GEOSERVER_PASS), headers=headers, data=data)
    if r.status_code not in [200, 201]:
        print("❗ Error al crear datastore:", r.text)

# 3. PUBLICAR TABLAS COMO CAPAS
def publicar_capa(schema, tabla):
    url = f"{GEOSERVER_URL}/rest/workspaces/{WORKSPACE}/datastores/{DATASTORE}/featuretypes"
    headers = {'Content-type': 'text/xml'}
    data = f"""
    <featureType>
        <name>{tabla}</name>
        <nativeName>{tabla}</nativeName>
        <srs>EPSG:4326</srs>
    </featureType>
    """
    r = requests.post(url, auth=(GEOSERVER_USER, GEOSERVER_PASS), headers=headers, data=data)
    if r.status_code in [200, 201]:
        print(f"✅ Publicada: {tabla}")
    else:
        print(f"❌ Error con {tabla}:", r.text)

# 4. PROCESO PRINCIPAL
def main():
    crear_datastore()
    tablas = get_spatial_tables()
    for schema, tabla in tablas:
        publicar_capa(schema, tabla)

if __name__ == "__main__":
    main()
