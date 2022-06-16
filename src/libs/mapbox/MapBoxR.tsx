import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Button } from "@chakra-ui/react";

  mapboxgl.accessToken = "pk.eyJ1IjoiZmFjdWFyaWFzbGEiLCJhIjoiY2w0MWp5Z3ljMDJscDNibHllZHFpb2kzaSJ9.7FD_nN-MSZ2XKLI9BwYrTA";

const MapBoxR = () => {
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(-68.06014203613013);
  const [lat, setLat] = useState(-38.95622024618729);
  const [zoom, setZoom] = useState(4);
  const [locationUpdate, setlocationUpdate] = useState(false)
  const [markerLat, setMarkerLat] = useState();
  const [markerLng, setMarkerLng] = useState();
  const marker = useRef<any>(null);
  // var marker = new mapboxgl.Marker();

  // 36.6938192391588, -119.75502457184231
  // -38.95622024618729, -68.06014203613013

  useEffect(() => {
    // if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    console.log('actualizado')
  }, [locationUpdate]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, [locationUpdate]);

  useEffect(() => {
    map.current.on('click', (e:any)=>{
    var coordinates = e.lngLat;
    console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
    setMarkerLat(coordinates.lat);
    setMarkerLng(coordinates.lng);
    // ESTA LINEA ME TIRA ERROR?:
    marker?.current?.remove();
    marker.current = new mapboxgl.Marker()
    marker.current.setLngLat(coordinates).addTo(map.current as any);

    })
    
  }, [locationUpdate])
  

  const myLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords.latitude, position.coords.longitude);
        
        setLng( position.coords.longitude);
        setLat(position.coords.latitude);
        setZoom(14)
        setlocationUpdate(!locationUpdate)
      });
    } else {
      console.log('Geolocalizacion no disponible')
    }
  }



  return (
    
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <Button onClick={myLocation}>Ir a mi ubicación</Button>
    </div>
  );
};

export default MapBoxR;

