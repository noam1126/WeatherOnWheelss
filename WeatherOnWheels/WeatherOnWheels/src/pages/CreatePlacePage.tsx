import React, { useState } from "react";
import axios from "axios";

const getCoordinatesFromAddress = async (address: string) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`
  );
  const data = await response.json();

  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } else {
    throw new Error("No coordinates found for this address");
  }
};

const CreatePlacePage = () => {
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
    } catch (error) {
      alert("Error creating place");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
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
        <br />
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Restaurant</option>
            <option>Hotel</option>
            <option>Park</option>
          </select>
        </label>
        <br />
        <label>
          Address:
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Place"}
        </button>
      </form>
      {success && <p style={{ color: "green" }}>Place created successfully!</p>}
    </div>
  );
};

export default CreatePlacePage;
