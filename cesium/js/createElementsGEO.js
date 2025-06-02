const url = "http://localhost:8000";
//   FUNCIONES DE CREACION DE ENTIDADES EN EL MAPA

function getColorForTemperature(temp) {
  if (temp <= 0) {
    return Cesium.Color.BLUE.withAlpha(0.3);
  } else if (temp <= 15) {
    return Cesium.Color.CYAN.withAlpha(0.3);
  } else if (temp <= 25) {
    return Cesium.Color.GREEN.withAlpha(0.3);
  } else if (temp <= 35) {
    return Cesium.Color.YELLOW.withAlpha(0.3);
  } else {
    return Cesium.Color.RED.withAlpha(0.3);
  }
}



function crearPunto(datosPunto) {
    const coordenadas = datosPunto.geometry.coordinates;
    const [lon, lat] = coordenadas;
    console.log('Coordenadas:', coordenadas);
    console.log('Lat:', lat, 'Lon:', lon);

    viewer.entities.add({
      
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 0), // Altura 0 para el terreno
      name: datosPunto.properties.direccion || 'Sin dirección',
      point: {
        pixelSize: 8,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // Úsalo si el punto está en terreno
        disableDepthTestDistance: Number.POSITIVE_INFINITY // Siempre visible encima del terreno
      }
    });
    
    if (datosPunto.properties.temperatura)
    {
      viewer.entities.add({
        
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 0),
        ellipsoid: {
          radii: new Cesium.Cartesian3(500.0, 500.0, 500),
          material: getColorForTemperature(datosPunto.properties.temperatura),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND  ,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }        
      });
    }
    

  }


  function crearPoligono(datosPoligono) {
    const coordenadas = datosPoligono.geometry.coordinates[0]; // Asumiendo que es un polígono simple
    const posiciones = coordenadas.map(coord => {
      const [lon, lat] = coord;
      return Cesium.Cartesian3.fromDegrees(lon, lat, 0);
    });

    viewer.entities.add({
      polygon: {
        hierarchy: posiciones,
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK
      }
    });
  }

  function crearLinea(datosLinea) {
    const coordenadas = datosLinea.geometry.coordinates;
    const posiciones = coordenadas.map(coord => {
      const [lon, lat] = coord;
      return Cesium.Cartesian3.fromDegrees(lon, lat, 0);
    });

    viewer.entities.add({
      polyline: {
        positions: posiciones,
        material: Cesium.Color.BLUE,
        width: 5
      },
      label: {
        text: datosLinea.properties.DIRECCION || 'Sin dirección',
        font: '18pt sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -12),
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // Úsalo si el punto está en terreno
        disableDepthTestDistance: Number.POSITIVE_INFINITY // Siempre visible encima del terreno
      }
    });
  }


  function crearMultipoligono(datosMultipoligono) {
    
   const coordenadas = datosMultipoligono.geometry.coordinates[0][0]; // Asumiendo que es un polígono simple
    const posiciones = coordenadas.map(coord => {
      const [lon, lat] = coord;
      return Cesium.Cartesian3.fromDegrees(lon, lat);
    });

    viewer.entities.add({
      // position : Cesium.Cartesian3.fromDegrees(datosMultipoligono.geometry.coordinates[0][0],0),
      polygon: {
        hierarchy: posiciones,
        material: Cesium.Color.GREEN.withAlpha(0.5),

        // outline: true,
        // outlineColor: Cesium.Color.BLACK
      }
    });
  }

  function crearMultilinea(datosMultilinea) {
    const coordenadas = datosMultilinea.geometry.coordinates[0]; // Asumiendo que es un polígono simple
    const posiciones = coordenadas.map(coord => {
      const [lon, lat] = coord;
      return Cesium.Cartesian3.fromDegrees(lon, lat);
    });

    viewer.entities.add({ 
       corridor: {
          positions: posiciones,
          width: 10.0,
          material: Cesium.Color.BLUE.withAlpha(0.5),
          clampToGround: true
      }
    });
  }


  async function mostrar3DTilesGoogle(){
     try {
      window.googleTileset = await Cesium.createGooglePhotorealistic3DTileset({
        // Only the Google Geocoder can be used with Google Photorealistic 3D Tiles.  Set the `geocode` property of the viewer constructor options to IonGeocodeProviderType.GOOGLE.
        onlyUsingWithGoogleGeocoder: true,
      });
      viewer.scene.primitives.add(googleTileset);
    } catch (error) {
      console.log(`Error loading Photorealistic 3D Tiles tileset.
      ${error}`);
    }
  }



  // FUNCION PARA CARGAR UN GEOJSON EN EL VISOR
  // console.log(Cesium.VERSION);
  function cargarGeoJSON(ruta) {

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-1.6456,42.8125, 7000),
    });
      
    // const dataSource = await Cesium.GeoJsonDataSource.load('datos/prueba.geojson', {
    //   clampToGround: true
    // });
    const utm30n = "+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs";
    const wgs84 = proj4.WGS84;
    
    var dataSource;
    fetch(ruta)
      .then(response => response.json())
      .then(data => {
        dataSource= data;
        
        let entidades=null;
        if (!Array.isArray(dataSource)){
           entidades = dataSource.features;  
        }
        else {
            entidades = dataSource[0].features;
        }

        // console.log('Entidades:', entidades);
        for (let i = 0; i < entidades.length; i++) {

          switch (entidades[i].geometry.type) {
            case 'Point':
              console.log('Es un punto');
              crearPunto(entidades[i]);
              break;
            case 'Polygon':
              console.log('Es un polígono');
              crearPoligono(entidades[i]);
              break;
            case 'LineString':
              console.log('Es una línea');
              break;
            case 'MultiPolygon':
              console.log('Es un multipolígono');
              crearMultipoligono(entidades[i]);
              break;
            case 'MultiLineString':
              console.log('Es una multilínea');
              crearMultilinea(entidades[i]);
              break;
            default:
              console.log('Tipo de geometría no soportado');
          }
        }

        // puntoPamplona()
        console.log('finalizado');
        return dataSource[0].features[0].properties.feature
      })
      .catch(error => console.error("Error al leer el GeoJSON:", error));
    }//FIN cargarGeoJSON 

    
  function limpiarEntidades() {
    // Limpiar todas las entidades del visor
    viewer.entities.removeAll();
    
  }

  function puntoPamplona() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-1.6756,42.7415, 7000),
        orientation: {
            heading: Cesium.Math.toRadians(10.0),
            pitch: Cesium.Math.toRadians(-40.0),
            roll: 0.0
        }
      });
  }

  function volarA(lon,lat) {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon,lat, 7000),
      //   orientation: {
      //       heading: Cesium.Math.toRadians(10.0),
      //       pitch: Cesium.Math.toRadians(-40.0),
      //       roll: 0.0
      //   }
      });
  }

  function cargarRutaVehicle() {
    // Cargar CZML
    viewer.dataSources.add(Cesium.CzmlDataSource.load('datos/Vehicle.czml'));
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-116.52, 35.02, 95000),
      orientation: {
        heading: 6,
      },
    });
    volarA(-116.52, 35.02,8000)
  }

  function layerCompostGeoserver(wms_name) {
    viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
      url: 'http://localhost:8080/geoserver/geopamplona/wms',
      layers: wms_name,
      parameters: {
        service: 'WMS',
        version: '1.1.0',
        request: 'GetMap',
        format: 'image/png',
        transparent: true,
        styles: '',
        tiled: true,
        crs: 'EPSG:4326'  //

      },
      credit: 'GeoServer - world'
    }));
  }

  function layerClimaSensoresWFS() {
    Cesium.GeoJsonDataSource.load('http://localhost:8080/geoserver/geopamplona/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geopamplona%3Aambi_pto_compost&outputFormat=application%2Fjson&maxFeatures=50')
    .then(function (dataSource) {
      // cargarGeoJSON(dataSource);  
      viewer.dataSources.add(dataSource);
      viewer.zoomTo(dataSource);
    }).
    catch(function (error) {
        console.error('Error al cargar el GeoJSON:', error);
    });
  }

  function layerGeoserver(wms_name) {
    viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
      url: 'http://localhost:8080/geoserver/geopamplona/ows',
      layers: wms_name,
      parameters: {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: wms_name,
        format: 'application/json',
        

      },
      credit: 'GeoServer - world'
    }));
  }

  function layerWorldWFS() {
    Cesium.GeoJsonDataSource.load('http://localhost:8080/geoserver/geopamplona/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geopamplona%3Aambi_pto_calidadaire&outputFormat=application%2Fjson&maxFeatures=50')
    .then(function (dataSource) {
        cargarGeoJSON(dataSource);
        viewer.dataSources.add(dataSource);
        viewer.zoomTo(dataSource);
    });
  }

  function layerEstadosWFS() {
    Cesium.GeoJsonDataSource.load('http://localhost:8080/geoserver/tiger/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tiger%3Agiant_polygon&outputFormat=application%2Fjson&maxFeatures=50')
    .then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        viewer.zoomTo(dataSource);
    });
  }

  // FUNCION PARA ABRIR O CERRAR UN SUBÁRBOL EN EL MENÚ LATERAL
  function toggleSubtree(element) {
    const subtree = element.nextElementSibling;
    subtree.classList.toggle("active");
  }

  function toggleView() {
    
    if (window.is3D) {
      document.getElementById("map").style.display =  "none" ;
      document.getElementById("cesiumContainer").style.display = "block";
      window.is3D = !window.is3D;
    }
    else
    {
      document.getElementById("map").style.display = "block" ;
      document.getElementById("cesiumContainer").style.display = "none";
      window.is3D = !window.is3D;
    }
  }


  function dbStatus(){
    fetch('http://localhost:8000/')
    .then(response => response.json())
    .then(data => console.log("Status de BD:" + data.json()))
    .catch(error => console.error('Error:', error));
  }


  async function getLayersNames() {
    const selectCapas = document.getElementById('capasGeopamplona');
    const urlcapas = url + "/tablesgeopamplona";
    
    fetch(urlcapas)
        .then(response => response.json())
        .then(data => {
            data.forEach(dato => {
              const option = document.createElement('li');
              option.id = dato;
              option.value = dato;
              option.textContent = dato;

              // Crear el checkbox
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.checked = true; // Inicialmente visible
              checkbox.id = 'layer_'+dato;
              capa='layer_'+dato;

              // Agregar el checkbox y el label al <li>
              option.appendChild(checkbox);

              option.addEventListener('click', function() {
                limpiarEntidades();
                const urlGeoJson = url + "/getgeojson/" + dato;
                cargarGeoJSON(urlGeoJson);
              });
              selectCapas.appendChild(option);
            });
          }
    )
    .catch(error => console.error("Error al leer el GeoJSON:", error));
  }



  function getLayersGeoServer() {
    const selectCapas = document.getElementById('capasGeoServer');
    const urlcapas = "http://localhost:8000/getgeolayer";
    
    fetch(urlcapas)
        .then(response => response.json())
        .then(data => {

          const capasWFS = dataSource[0].features;
            data.forEach(dato => {
              const option = document.createElement('li');
              option.value = dato;
              option.textContent = dato;
              option.addEventListener('click', function() {
                limpiarEntidades();
                layerWorld(dato);
              });
              selectCapas.appendChild(option);
            });
          }
    )
    .catch(error => console.error("Error al leer el GeoJSON:", error));

  }


  // dbStatus();
  getLayersNames();
  getLayersGeoServer();