import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./PlacesPage.css";
import WeatherChartComponent from "./WeatherChartComponent";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).toString(),
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url
  ).toString(),
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).toString(),
});

type Place = {
  id: string;
  name: string;
  type: string;
  address: string;
  created_at: string;
  location?: {
    lat: number;
    lng: number;
  };
};

function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 13);
  }, [position, map]);
  return null;
}

async function getCoordinatesFromAddress(address: string) {
  const apiKey = "AIzaSyAaoONHJ6KYstnR_x5dXr6h5-yEm2x1Unw";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log("Geocoding response:", data);
  if (data.status === "OK" && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  } else {
    throw new Error("No coordinates found");
  }
}

function CreatePlacePopup({
  onClose,
  onPlaceCreated,
}: {
  onClose: () => void;
  onPlaceCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Restaurant");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length > 25) {
      alert("Name must be 25 characters or fewer.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const coords = await getCoordinatesFromAddress(address);
      await axios.post("https://localhost:7259/api/place", {
        name,
        type,
        address,
        location: coords,
      });
      setSuccess(true);
      setName("");
      setType("Restaurant");
      setAddress("");
      onPlaceCreated();
      onClose();
    } catch (error) {
      alert("Error creating place");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create a New Place</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={25}
            />
          </label>
          <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Restaurant</option>
              <option>Hotel</option>
              <option>Park</option>
            </select>
          </label>
          <label>
            Address:
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Place"}
          </button>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          {success && (
            <p style={{ color: "green" }}>Place created successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const fetchPlaces = () => {
    axios
      .get("https://localhost:7259/api/place")
      .then((res) => {
        setPlaces(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const filtered =
    filter === "All" ? places : places.filter((p) => p.type === filter);

  return (
    <div className="places-container">
      <div className="map-section">
        <MapContainer
          center={[32.0853, 34.7818]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered
            .filter(
              (place) =>
                place.location?.lat !== undefined &&
                place.location?.lng !== undefined
            )
            .map((place) => (
              <Marker
                key={`${place.id}-${place.name}`}
                position={[place.location!.lat, place.location!.lng]}
              >
                <Popup>{place.name}</Popup>
              </Marker>
            ))}

          {selected?.location && (
            <FlyToLocation
              position={[selected.location.lat, selected.location.lng]}
            />
          )}
        </MapContainer>
      </div>

      <div className="list-section">
        <h2>Places</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Hotel">Hotel</option>
          <option value="Park">Park</option>
        </select>
        <button
          onClick={() => setShowCreatePopup(true)}
          className="add-place-btn"
        >
          Add New Place
        </button>
        <ul>
          {filtered
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((place) => (
              <li
                key={`${place.id}-${place.name}`}
                className={`place-item ${
                  selected?.id === place.id ? "selected" : ""
                }`}
                onClick={() => setSelected(place)}
              >
                <strong>{place.name}</strong> ({place.type})<br />
                {place.address}
              </li>
            ))}
        </ul>

        {selected?.location && (
          <div className="weather-chart-container">
            <WeatherChartComponent
              lat={selected.location.lat}
              lon={selected.location.lng}
            />
          </div>
        )}
      </div>

      {showCreatePopup && (
        <CreatePlacePopup
          onClose={() => setShowCreatePopup(false)}
          onPlaceCreated={fetchPlaces}
        />
      )}
    </div>
  );
}
