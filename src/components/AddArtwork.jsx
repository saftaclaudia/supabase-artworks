import { useState } from "react";
import { supabase } from "../supabaseClient";

function AddArtwork() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [aspectRatio, setAspectRatio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'

  async function handleSubmit(e) {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image to upload");
      return;
    }
    setStatus("loading");

    // 1.Upload image to Supabase Storage
    const fileExt = imageFile.name?.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `artworks/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("artworks")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("There was an error uploading the image");
      return;
    }

    // 2.Get public URL for the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("artworks").getPublicUrl(filePath);

    // 3.Insert metadata into the "artworks" table
    const { error: insertError } = await supabase.from("artworks").insert([
      {
        title,
        artist,
        aspect_ratio: aspectRatio,
        image_url: publicUrl,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      setStatus("error");
      return;
    }

    setStatus("success");

    // Reset form
    setTitle("");
    setArtist("");
    setAspectRatio("");
    setImageFile(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white  rounded-xl shadow-md space-y-6 border border-gray-200"
    >
      <h2 className="text-xl font-bold text-center text-gray-800">
        Add a New Artwork
      </h2>

      {status === "success" && (
        <div className="text-green-600 bg-green-50 p-3 rounded tex-sm border border-green-200">
          Artwork was added successfully!
        </div>
      )}
      {status === "error" && (
        <div className="text-red-600 bg-red-50 p-3 trxt-sm border border-red-200">
          Error saving the artwork. Plaese try again.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Artist</label>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Aspect Ratio</label>
        <input
          type="text"
          placeholder="ex: 16:9"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
          className="w-full text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className={`w-full flex items-center justify-center gap-2  bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
          status === "loading" ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {status === "loading" ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/200/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opactty-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h4z"
              ></path>
            </svg>
            Uploading..
          </>
        ) : (
          "Add Artwork"
        )}
      </button>
    </form>
  );
}

export default AddArtwork;
