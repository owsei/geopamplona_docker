import gpxpy
import json

with open('datos.gpx', 'r') as gpx_file:
    gpx = gpxpy.parse(gpx_file)

positions = []
for track in gpx.tracks:
    for segment in track.segments:
        for point in segment.points:
            positions.extend([point.longitude, point.latitude, point.elevation])

czml = [
    {
        "id": "document",
        "version": "1.0"
    },
    {
        "id": "route",
        "name": "GPX Route",
        "polyline": {
            "positions": {
                "cartographicDegrees": positions
            },
            "material": {
                "solidColor": {
                    "color": {
                        "rgba": [255, 0, 0, 255]  # rojo
                    }
                }
            },
            "width": 4
        }
    }
]

with open('ruta.czml', 'w') as f:
    json.dump(czml, f, indent=2)
