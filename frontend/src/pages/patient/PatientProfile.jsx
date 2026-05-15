import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatientProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const accessToken = user?.accessToken || localStorage.getItem('accessToken') || "";

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [patientUserId, setPatientUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [gender, setGender] = useState("male");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const authHeaders = useMemo(
    () => ({
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }),
    [accessToken]
  );

  const openFilePicker = () => {
    if (fileInputRef.current) {
      // ensure picker opens even after same-file re-selection
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      setLoading(false);
      setError("Please login again to load patient profile.");
      return;
    }

    const fetchMyPatient = async () => {
      try {
        setLoading(true);
        setError("");
        setSaveError("");
        setSaveSuccess("");

        const res = await fetch("http://localhost:3000/api/patient/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load patient profile");

        const patient = data?.patient;

        const uid = patient?._id || patient?.user?._id || "";
        setPatientUserId(uid);

        setFullName(patient?.user?.name || "");
        setAge(patient?.age || "");
        setMobileNo(patient?.mobileNo || "");
        setGender(patient?.gender || "male");

        // backend field name is profilepic
        setProfilePic(patient?.profilepic || "https://via.placeholder.com/100");
      } catch (e) {
        setError(e?.message || "Failed to load patient profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPatient();
  }, [accessToken, authHeaders, authLoading]);

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    };
  }, [uploadPreviewUrl]);

  const onChooseFile = (e) => {
    const file = e.target.files?.[0];
    setSaveError("");
    setSaveSuccess("");

    if (!file) {
      setSelectedFile(null);
      setUploadPreviewUrl("");
      return;
    }

    // optional guardrails
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setSelectedFile(null);
      setUploadPreviewUrl("");
      setSaveError("Please select an image file (JPG/PNG).");
      return;
    }

    // 2MB limit (matches your UI text)
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setSelectedFile(null);
      setUploadPreviewUrl("");
      setSaveError("Image should be up to 2MB.");
      return;
    }

    if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);

    setSelectedFile(file);
    setUploadPreviewUrl(URL.createObjectURL(file));

    // allow picking the exact same file again later
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError("");
      setSaveSuccess("");

      if (!patientUserId) {
        throw new Error("Patient id not found. Please refresh and try again.");
      }

      if (!fullName?.trim()) {
        throw new Error("Full name is required.");
      }

      if (!mobileNo?.trim()) {
        throw new Error("Mobile number is required.");
      }

      const formData = new FormData();
      formData.append("fullname", fullName);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("mobileno", mobileNo);

      // backend expects multipart field name: profilepic
      if (selectedFile) {
        formData.append("profilepic", selectedFile);
      }

      const res = await fetch(`http://localhost:3000/api/patient/${patientUserId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      setSaveSuccess("Profile updated successfully.");

      // refresh displayed values from backend (includes profilepic if uploaded)
      const updated = data?.patient;
      setProfilePic(updated?.profilepic || profilePic);
      setSelectedFile(null);
      setUploadPreviewUrl("");
    } catch (e) {
      setSaveError(e?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };


// ==========================================================================================================================================================================

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Edit Patient Profile</h1>
        <p className="text-gray-500 text-sm">Update your personal information</p>

        <div className="mt-3 text-sm text-gray-700">
          {loading ? (
            <span>Loading profile...</span>
          ) : error ? (
            <span className="text-red-600">{error}</span>
          ) : (
            <span>
              Your ID :{" "}
              <span className="font-semibold">{patientUserId || "-"}</span>
            </span>
          )}
        </div>

        {saveError ? <div className="mt-2 text-sm text-red-600">{saveError}</div> : null}
        {saveSuccess ? <div className="mt-2 text-sm text-green-700">{saveSuccess}</div> : null}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChooseFile}
        />

        {/* Profile Photo */}
        <div className="flex items-center gap-6 mb-6">
          <button
            type="button"
            onClick={openFilePicker}
            className="relative"
            aria-label="Upload profile photo"
            title="Upload profile photo"
          >
            <img
              src={uploadPreviewUrl || profilePic || "https://via.placeholder.com/100"}
              alt="patient"
              className="w-24 h-24 rounded-full object-cover border border-gray-200"
            />
          </button>

          <div>
            <button
              type="button"
              onClick={openFilePicker}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Photo
            </button>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
            {selectedFile ? (
              <p className="text-xs text-gray-600 mt-2">Selected: {selectedFile.name}</p>
            ) : null}
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-sm text-gray-600">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm text-gray-600">Mobile Number</label>
            <input
              type="text"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Gender */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-2 block">Gender</label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`px-4 py-2 rounded-lg border ${
                  gender === "male" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
                }`}
              >
                Male
              </button>

              <button
                type="button"
                onClick={() => setGender("female")}
                className={`px-4 py-2 rounded-lg border ${
                  gender === "female" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
                }`}
              >
                Female
              </button>

              <button
                type="button"
                onClick={() => setGender("other")}
                className={`px-4 py-2 rounded-lg border ${
                  gender === "other" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
                }`}
              >
                Other
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            type="button"
            disabled={saving}
            onClick={() => {
              setSaveError("");
              setSaveSuccess("");
              setSelectedFile(null);
              setUploadPreviewUrl("");
              navigate("/patient/dashboard");
            }}
          >
            Cancel
          </button>

          <button
            className={`px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
