// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  place: string;
  cityVillage: string;
  district: string;
  state: string;
  details: string;
  photos: File[];
  video: File | null;
}

interface submittedData {
  name: string;
  place: string;
  cityVillage: string;
  district: string;
  state: string;
  details: string;
  photos: string[];
  video: string | null;
}

export default function Dashboard() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    place: "",
    cityVillage: "",
    district: "",
    state: "",
    details: "",
    photos: [],
    video: null,
  });
  const [submittedData, setSubmittedData] = useState<submittedData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }
      try {
        const response = await axios.get<{ formData: submittedData[] }>(
          `http://localhost:5000/api/form/${userId}`
        );
        console.log("API Response:", response);
        setSubmittedData(response.data.formData);
      } catch (error: any) {
        console.error(
          "Error fetching form data:",
          error.response?.data || error.message
        );
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      alert("User ID is missing. Please log in again.");
      return;
    }

    // Validate required fields
    if (
      !formData.name ||
      !formData.place ||
      !formData.cityVillage ||
      !formData.district ||
      !formData.state ||
      !formData.details
    ) {
      alert("All fields are required. Please fill out the form completely.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("place", formData.place);
      formDataToSend.append("cityVillage", formData.cityVillage);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("details", formData.details);
      formDataToSend.append("userId", userId);

      // Append photos (multiple files)
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });
      // To this (add index for array format)
      formData.photos.forEach((photo, index) => {
        formDataToSend.append(`photos[${index}]`, photo);
      });

      // Append video (single file)
      if (formData.video) {
        formDataToSend.append("video", formData.video);
      }

      // Log the FormData object
      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Send the FormData to the backend
      const response = await axios.post(
        "http://localhost:5000/api/form/submit",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");

      // Reset form data
      setFormData({
        name: "",
        place: "",
        cityVillage: "",
        district: "",
        state: "",
        details: "",
        photos: [],
        video: null,
      });

      // Refresh submitted data after submission
      const updatedResponse = await axios.get<{ formData: submittedData[] }>(
        `http://localhost:5000/api/form/${userId}`
      );
      setSubmittedData(updatedResponse.data.formData);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Form submission failed:",
          error.response?.data || error.message
        );
        alert(
          `Form submission failed: ${
            error.response?.data.error || error.message
          }`
        );
      } else {
        console.error("Form submission failed:", error);
        alert("Form submission failed. Please try again.");
      }
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "photos" | "video"
  ) => {
    if (!e.target.files) return; // Ensure files exist before proceeding

    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [field]: field === "photos" ? files : files[0] || null, // Ensure correct type
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mb-4"
          />
          <Input
            placeholder="Place"
            value={formData.place}
            onChange={(e) =>
              setFormData({ ...formData, place: e.target.value })
            }
            className="mb-4"
          />
          <Input
            placeholder="City/Village"
            value={formData.cityVillage}
            onChange={(e) =>
              setFormData({ ...formData, cityVillage: e.target.value })
            }
            className="mb-4"
          />
          <Input
            placeholder="District"
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            className="mb-4"
          />
          <Input
            placeholder="State"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className="mb-4"
          />
          <Textarea
            placeholder="Details Explanation"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className="mb-4"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Upload Photos
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "photos")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Upload Video
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "video")}
              className="w-full p-2 border rounded"
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Submit
          </Button>
        </form>

        {/* Display Submitted Data */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Submitted Data</h2>
          {submittedData.map((data, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <p>
                <strong>Name:</strong> {data.name}
              </p>
              <p>
                <strong>Place:</strong> {data.place}
              </p>
              <p>
                <strong>City/Village:</strong> {data.cityVillage}
              </p>
              <p>
                <strong>District:</strong> {data.district}
              </p>
              <p>
                <strong>State:</strong> {data.state}
              </p>
              <p>
                <strong>Details:</strong> {data.details}
              </p>
              <p>
                <strong>Photos:</strong> {data.photos?.join(", ")}
              </p>
              <p>
                <strong>Video:</strong> {data.video}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
