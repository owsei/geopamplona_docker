import React, { useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const MapViewer = () => {
    const camada = {
        id: "movi_pol_zonaaccesorestr",
        name: "Movilidad Pol. Zona Acceso Restringido",
        description: "Capa de movilidad política de la zona de acceso restringido",
        url: "http://localhost:8081/geoserver/geopamplona/wms",
        layerName: "geopamplona:movi_pol_zonaaccesorestr"
    };
  return (
    <MapContainer
      center={[42.8168,-1.643]} // Coordenadas iniciales (ej: Pamplona)
      zoom={15} // Nivel de zoom inicial
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* Mapa base OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Capa WMS desde GeoServer */}
      <WMSTileLayer
        url="http://localhost:8081/geoserver/geopamplona/wms"
        layers="geopamplona:AMBI_Pto_CalidadAire"  // <-- Cambia "my_layer" por el nombre de tu capa
        format="image/png"
        transparent={true}
        version="1.1.0"
        tiled={true}
      />
      
        {/* <WMSTileLayer key={camada.id}
            url="http://localhost:8081/geoserver/geopamplona/wms"
            layers="geopamplona:movi_pol_zonaaccesorestr"
            version="1.1.0"
            minZoom={1}
            maxZoom={25}
            width={696}
            height={768}
            params={{
                transparent: true,
                attribution:"© WMS Source",
                format:"image/png",
            }}
        /> */}
    </MapContainer>
  );
};

export default MapViewer;
