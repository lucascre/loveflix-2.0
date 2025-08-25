// src/components/MapComponent.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Memory } from '@/data/memories';
import Link from 'next/link';

// Ícone personalizado para os marcadores
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  memories: Memory[];
}

export function MapComponent({ memories }: MapProps) {
  return (
    <MapContainer center={[-22.3149, -49.0628]} zoom={8} scrollWheelZoom={false} style={{ height: '80vh', width: '100%', borderRadius: '8px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {memories.map(memory => (
        memory.location && (
          <Marker 
            key={memory.id} 
            position={[memory.location.lat, memory.location.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold font-serif text-lg">{memory.title}</h3>
                <p className="text-sm my-1">{memory.location.name}</p>
                <Link href={`/memories/${memory.id}`} className="text-blue-600 hover:underline">
                  Ver memória
                </Link>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}