import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import "../styles/Artists.css";

export default function ArtistPage() {
  const { id } = useParams();               // expecting /artists/:id
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/artists/${id}`);
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const data = await res.json();
        setArtist(data);
      } catch (err) {
        console.error('Error fetching artist:', err);
        setError(err.message || 'Artist not found');
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  if (loading) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading...</p>;
  }
  if (error) {
    return <h2 style={{ padding: '2rem', textAlign: 'center' }}>{error}</h2>;
  }

  return (
    <div className="artist-page px-4 py-6 max-w-4xl mx-auto">
      {artist.imageUrl && (
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="artist-image w-full h-auto rounded mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{artist.name}</h1>
      {artist.bio && (
        <p className="artist-description mb-6 whitespace-pre-line">
          {artist.bio}
        </p>
      )}
     <button
   className="artist-button …"
   onClick={() =>
     navigate('/shop', {
      state: { filterArtist: artist._id }
     })
   }
 >
   See all artwork
 </button>
    </div>
  );
}
