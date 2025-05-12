    function limpiarCapa() {
        viewer.entities.removeAll(); // Limpiar todas las entidades del visor
    }

    function toggleSubtree(element) {
        const subtree = element.nextElementSibling;
        subtree.classList.toggle("active");
    }


    function crearPunto(datosPunto) {
      const coordenadas = datosPunto.geometry.coordinates;
      const [lon, lat] = coordenadas;
      console.log('Coordenadas:', coordenadas);
      console.log('Lat:', lat, 'Lon:', lon);

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 0), // Altura 0 para el terreno
        point: {
          pixelSize: 8,
          color: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // Úsalo si el punto está en terreno
          disableDepthTestDistance: Number.POSITIVE_INFINITY // Siempre visible encima del terreno
        },
        label: {
          text: datosPunto.properties.DIRECCION || 'Sin dirección',
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
        return Cesium.Cartesian3.fromDegrees(lon, lat, 0);
      });

      viewer.entities.add({
        // position : Cesium.Cartesian3.fromDegrees(datosMultipoligono.geometry.coordinates[0][0],0),
        polygon: {
          hierarchy: posiciones,
          material: Cesium.Color.GREEN.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      });
    }