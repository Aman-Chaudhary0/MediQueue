import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, AlertTriangle, Eye, EyeOff } from "lucide-react";
import patientService from "../../api/patientService";
import authService from "../../api/authService";

const PatientProfile = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // New profile fields
  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: ""
  });
  const [insuranceDetails, setInsuranceDetails] = useState({
    provider: "",
    policyNumber: "",
    groupNumber: ""
  });

  const openFilePicker = () => {
    if (fileInputRef.current) {
      // ensure picker opens even after same-file re-selection
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
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

        const data = await patientService.getMyProfile();

        const patient = data?.patient;

        const uid = patient?._id || patient?.user?._id || "";
        setPatientUserId(uid);

        setFullName(patient?.user?.name || "");
        setAge(patient?.age || "");
        setMobileNo(patient?.mobileNo || "");
        setGender(patient?.gender || "male");

        // backend field name is profilepic
        setProfilePic(patient?.profilepic || "https://via.placeholder.com/100");

        // Set new profile fields
        setMedicalHistory(patient?.medicalHistory || "");
        setAllergies(patient?.allergies || "");
        setCurrentMedications(patient?.currentMedications || "");
        setEmergencyContact(patient?.emergencyContact || { name: "", relationship: "", phone: "" });
        setInsuranceDetails(patient?.insuranceDetails || { provider: "", policyNumber: "", groupNumber: "" });
      } catch (e) {
        setError(e?.message || "Failed to load patient profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPatient();
  }, [isAuthenticated, authLoading]);

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

      // Validation
      if (!patientUserId) {
        throw new Error("Patient id not found. Please refresh and try again.");
      }

      if (!fullName?.trim()) {
        throw new Error("Full name is required.");
      }

      if (!mobileNo?.trim()) {
        throw new Error("Mobile number is required.");
      }

      // Validate age if provided
      if (age && (isNaN(age) || age < 0 || age > 150)) {
        throw new Error("Age must be a valid number between 0 and 150.");
      }

      // Validate emergency contact phone if provided
      if (emergencyContact.phone && emergencyContact.phone.trim()) {
        const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;
        const digitCount = emergencyContact.phone.replace(/\D/g, "").length;
        if (!phoneRegex.test(emergencyContact.phone) || digitCount < 10 || digitCount > 15) {
          throw new Error("Invalid emergency contact phone number.");
        }
      }

      // Create update object
      const patientData = {
        fullname: fullName,
        age: age,
        mobileNo: mobileNo,
        gender: gender,
        medicalHistory: medicalHistory,
        allergies: allergies,
        currentMedications: currentMedications,
        emergencyContact: emergencyContact,
        insuranceDetails: insuranceDetails,
      };

      // Call service with file if present
      const data = await patientService.updatePatient(patientUserId, patientData, selectedFile);

      setSaveSuccess("Profile updated successfully!");

      // refresh displayed values from backend (includes profilepic if uploaded)
      const updated = data?.patient;
      if (updated?.profilepic) {
        setProfilePic(updated.profilepic);
      }
      setSelectedFile(null);
      setUploadPreviewUrl("");
    } catch (e) {
      setSaveError(e?.message || "Failed to update profile");
      console.error("Error updating profile:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      logout();
      setShowLogoutModal(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ==========================================================================================================================================================================

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !patientUserId) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-800">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

          {/* Medical History */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Medical History</label>
            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value.slice(0, 2000))}
              placeholder="e.g., Diabetes, Hypertension, Previous surgeries"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              maxLength="2000"
            />
            <div className="text-xs text-gray-500 mt-1">{medicalHistory.length}/2000 characters</div>
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Allergies</label>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value.slice(0, 1000))}
              placeholder="e.g., Penicillin, Peanuts, Shellfish"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="2"
              maxLength="1000"
            />
            <div className="text-xs text-gray-500 mt-1">{allergies.length}/1000 characters</div>
          </div>

          {/* Current Medications */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Current Medications</label>
            <textarea
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value.slice(0, 2000))}
              placeholder="e.g., Metformin 500mg daily, Atorvastatin 20mg"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              maxLength="2000"
            />
            <div className="text-xs text-gray-500 mt-1">{currentMedications.length}/2000 characters</div>
          </div>

          {/* Emergency Contact Section */}
          <div className="md:col-span-2 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h2>
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label className="text-sm text-gray-600">Contact Name</label>
            <input
              type="text"
              value={emergencyContact.name}
              onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
              placeholder="Full name"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Emergency Contact Relationship */}
          <div>
            <label className="text-sm text-gray-600">Relationship</label>
            <input
              type="text"
              value={emergencyContact.relationship}
              onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })}
              placeholder="e.g., Spouse, Parent, Sibling"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Emergency Contact Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              value={emergencyContact.phone}
              onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
              placeholder="Phone number"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Insurance Details Section */}
          <div className="md:col-span-2 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Insurance Details</h2>
          </div>

          {/* Insurance Provider */}
          <div>
            <label className="text-sm text-gray-600">Insurance Provider</label>
            <input
              type="text"
              value={insuranceDetails.provider}
              onChange={(e) => setInsuranceDetails({ ...insuranceDetails, provider: e.target.value })}
              placeholder="e.g., Blue Cross, Aetna"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Policy Number */}
          <div>
            <label className="text-sm text-gray-600">Policy Number</label>
            <input
              type="text"
              value={insuranceDetails.policyNumber}
              onChange={(e) => setInsuranceDetails({ ...insuranceDetails, policyNumber: e.target.value })}
              placeholder="Policy number"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Group Number */}
          <div>
            <label className="text-sm text-gray-600">Group Number</label>
            <input
              type="text"
              value={insuranceDetails.groupNumber}
              onChange={(e) => setInsuranceDetails({ ...insuranceDetails, groupNumber: e.target.value })}
              placeholder="Group number"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Back Button (same style as Book Appointment page) */}
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/patient/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span aria-hidden>←</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* Preview Section */}
        <div className="mb-6 border-t pt-6">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            <span>{showPreview ? "Hide" : "Show"} Profile Preview</span>
          </button>

          {showPreview && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Profile Preview</h3>
              <div className="bg-white rounded p-4">
                {/* Profile Picture Preview */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                  <img
                    src={uploadPreviewUrl || profilePic}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{fullName || "-"}</p>
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 pb-6 border-b">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Age</p>
                    <p className="text-gray-900">{age || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Gender</p>
                    <p className="text-gray-900 capitalize">{gender || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Mobile</p>
                    <p className="text-gray-900">{mobileNo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Email</p>
                    <p className="text-gray-900 text-sm">{emergencyContact.name ? "✓" : "—"}</p>
                  </div>
                </div>

                {/* Medical Info Summary */}
                <div className="space-y-4">
                  {medicalHistory && (
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Medical History</p>
                      <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{medicalHistory}</p>
                    </div>
                  )}
                  {allergies && (
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Allergies</p>
                      <p className="text-sm text-red-700 bg-red-50 p-2 rounded">{allergies}</p>
                    </div>
                  )}
                  {currentMedications && (
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Current Medications</p>
                      <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">{currentMedications}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            className="px-5 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
            type="button"
            onClick={() => navigate("/change-password")}
          >
            Change Password
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


          <button
            className={`px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 ${
              isLoggingOut ? "opacity-70 cursor-not-allowed" : ""
            }`}
            type="button"
            onClick={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-800">Logout?</h2>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to logout? You'll need to login again to access your account.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 ${
                  isLoggingOut ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoggingOut}
              >
                <LogOut size={16} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
