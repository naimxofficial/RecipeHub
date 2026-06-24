"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Camera, Save } from "lucide-react";
import { Button } from "@heroui/react";
import Image from "next/image";

export default function ProfileClient({ userId, initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    image: initialUser.image || "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);


  // Fetch fresh user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/profile?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFormData({
            name: data.name || "",
            image: data.image || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formDataUpload }
      );
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image: data.data.url });
        toast.success("Image uploaded successfully");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/profile?userId=${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            image: formData.image,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setUser({ ...user, name: formData.name, image: formData.image });
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-separator rounded-3xl p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="size-32 rounded-2xl overflow-hidden border-4 border-background shadow-md">
              {formData.image ? (
                <Image
                  loading="eager"
                  src={formData.image}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <div className="size-full bg-muted flex items-center justify-center text-5xl font-display text-muted">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <label className="absolute bottom-1 right-1 bg-accent text-accent-foreground p-2 rounded-full cursor-pointer hover:bg-accent/90 transition-colors">
              <Camera className="size-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          {uploading && <p className="text-xs text-muted mt-2">Uploading image...</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-separator bg-background px-5 py-3 focus:outline-none focus:border-accent"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full rounded-2xl border border-separator bg-background/50 px-5 py-3 text-muted cursor-not-allowed"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={loading || uploading}
          className="w-full"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}