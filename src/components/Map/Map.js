import React, { useState, useEffect } from 'react';
import classes from './map.module.css';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { toast } from 'react-toastify';
import * as L from 'leaflet';

export default function Map({ readonly, location, onChange }) {
  return (
    <div className={classes.container}>
      <MapContainer
        className={classes.map}
        center={[0, 0]}
        zoom={1}
        dragging={!readonly}
        touchZoom={!readonly}
        doubleClickZoom={!readonly}
        scrollWheelZoom={!readonly}
        boxZoom={!readonly}
        keyboard={!readonly}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FindButtonAndMarker
          readonly={readonly}
          location={location}
          onChange={onChange}
        />
      </MapContainer>
    </div>
  );
}

function FindButtonAndMarker({ readonly, location, onChange }) {
  const [position, setPosition] = useState(location);

  useEffect(() => {
    if (readonly) {
      map.setView(position, 13);
      return;
    }
    if (position) onChange(position);
  }, [position]);

  const map = useMapEvents({
    click(e) {
      !readonly && setPosition(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 13);
    },
    locationerror(e) {
        if (e.code === 1) {
          toast.error("Location access denied by the user.");
        } else if (e.code === 2) {
          toast.error("Position unavailable.");
        } else if (e.code === 3) {
          toast.error("Location request timed out. Please try again.");
        } else {
          toast.error("An unknown error occurred.");
        }
    },
  });

  const markerIcon = new L.Icon({
    iconUrl: '/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

  return (
    <>
      {!readonly && (
        <button
          type="button"
          className={classes.find_location}
          onClick={
            () => map.locate({
                setView: true,
                watch: true,
                enableHighAccuracy: true,
                timeout: 30000, // 10 seconds
            })
          }
        >
          Find My Location
        </button>
      )}

      {position && (
        <Marker
          eventHandlers={{
            dragend: e => {
              setPosition(e.target.getLatLng());
            },
          }}
          position={position}
          draggable={!readonly}
          icon={markerIcon}
        >
          <Popup>Shipping Location</Popup>
        </Marker>
      )}
    </>
  );
}
