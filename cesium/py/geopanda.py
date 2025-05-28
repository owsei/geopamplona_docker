import geopandas as gpd

# Lee el archivo .shp
gdf = gpd.read_file("../geopamplonamaps/TRAURB_Lin_TUCLinea09/TRAURB_Lin_TUCLinea09.shp")

# Exporta a GeoJSON
gdf.to_file("TRAURB_Lin_TUCLinea09.geojson", driver="GeoJSON")