from fastapi import FastAPI
import psycopg2

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/db-status")
def db_status():
    try:
        conn = psycopg2.connect(
            host="postgis",
            database="geopamplona_db",
            user="admin",
            password="admin"
        )
        conn.close()
        return {"status": "PostGIS is connected"}
    except Exception as e:
        return {"status": f"Failed to connect: {e}"}
