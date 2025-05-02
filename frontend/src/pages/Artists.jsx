import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import "../styles/Artists.css";

export default function HomePage() {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch artists from your admin backend
    fetch(`${API_BASE_URL}/api/artists`)
      .then(res => res.json())
      .then(data => setArtists(data))
      .catch(err => console.error("Error loading artists:", err));
  }, []);

  // simple slugify helper
  const makeSlug = name =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  return (
    <div className="homepage">

      <h1 className="heading">MEET OUR ARTISTS</h1>

      {artists.map((artist, i) => {
        const slug = makeSlug(artist.name);
        return (
          <div
            key={artist._id}
            className={`artist-card ${i % 2 !== 0 ? "reverse" : ""}`}
            onClick={() => navigate(`/artists/${artist._id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={artist.imageUrl} alt={artist.name} />
            <div className="artist-info">
              <h2 className="artist-name">{artist.name}</h2>
              <p className="artist-categories">
              {(artist.categories || []).map(cat => cat.name).join(', ')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
