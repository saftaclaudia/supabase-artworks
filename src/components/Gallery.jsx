import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArtworks() {
      const { data, error } = await supabase.from("artworks").select("*");

      if (error) {
        setError("Faild to load artworks.");
        console.error(error);
      } else {
        setArtworks(data);
      }
      setLoading(false);
    }
    fetchArtworks();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Artwork Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artworks.map((artwork) => {
          return (
            <div
              key={artwork.id}
              className="border rounded shadow hover:shadow-md transition p-4 bg-white"
            >
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold">Title: {artwork.title}</h3>
              <p className="text-sm text-gray-600">Artist: {artwork.artist}</p>
              <p className="text-sm text-gray-600">Medium: {artwork.medium}</p>
              <p className="text-sm text-gray-500">
                Created at: {new Date(artwork.created_at).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-500">
                Aspect ratio: {artwork.aspect_ratio}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Gallery;
