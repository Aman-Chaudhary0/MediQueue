import React from "react";
import { AlertCircle, Mail, Phone, User, MapPin, Shield, Pill, AlertTriangle, FileText } from "lucide-react";

/**
 * PatientProfileView Component
 * Displays complete patient profile information in a read-only format
 * 
 * Props:
 *  - patient: Patient object with all profile data
 *  - compact: Boolean to show compact version (default: false)
 *  - className: Additional CSS classes
 */
const PatientProfileView = ({ patient, compact = false, className = "" }) => {
  if (!patient) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle size={20} />
          <p>No patient data available</p>
        </div>
      </div>
    );
  }

  const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <Icon size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoField = ({ label, value }) => (
    <div className="bg-gray-50 rounded p-3 mb-2">
      <p className="text-xs text-gray-600 font-medium uppercase">{label}</p>
      <p className="text-gray-900 mt-1">{value || "-"}</p>
    </div>
  );

  if (compact) {
    return (
      <div className={`bg-white rounded-lg p-4 ${className}`}>
        {/* Basic Info - Compact */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={patient.profilepic || "https://via.placeholder.com/80"}
            alt={patient.user?.name}
            className="w-16 h-16 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{patient.user?.name || "-"}</h2>
            <p className="text-sm text-gray-600">{patient.user?.email}</p>
            <div className="flex gap-6 mt-2 text-sm text-gray-600">
              <span>{patient.age || "-"} years</span>
              <span>{patient.gender}</span>
              <span>{patient.mobileNo}</span>
            </div>
          </div>
        </div>

        {/* Quick Medical Summary */}
        {(patient.medicalHistory || patient.allergies || patient.currentMedications) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-200">
            {patient.medicalHistory && (
              <div className="text-sm">
                <p className="font-medium text-gray-700">Medical History</p>
                <p className="text-gray-600 line-clamp-2">{patient.medicalHistory.substring(0, 100)}...</p>
              </div>
            )}
            {patient.allergies && (
              <div className="text-sm">
                <p className="font-medium text-gray-700">Allergies</p>
                <p className="text-red-600 line-clamp-2">{patient.allergies.substring(0, 100)}...</p>
              </div>
            )}
            {patient.currentMedications && (
              <div className="text-sm">
                <p className="font-medium text-gray-700">Current Medications</p>
                <p className="text-gray-600 line-clamp-2">{patient.currentMedications.substring(0, 100)}...</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full detailed view
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header with Profile Picture */}
      <div className="flex items-start gap-6 mb-8 pb-6 border-b border-gray-200">
        <img
          src={patient.profilepic || "https://via.placeholder.com/120"}
          alt={patient.user?.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{patient.user?.name || "-"}</h1>
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <Mail size={18} />
            <p>{patient.user?.email}</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded p-3">
              <p className="text-xs text-gray-600 font-medium">Age</p>
              <p className="text-lg font-semibold text-gray-900">{patient.age || "-"}</p>
            </div>
            <div className="bg-blue-50 rounded p-3">
              <p className="text-xs text-gray-600 font-medium">Gender</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{patient.gender || "-"}</p>
            </div>
            <div className="bg-blue-50 rounded p-3">
              <p className="text-xs text-gray-600 font-medium">Mobile</p>
              <p className="text-lg font-semibold text-gray-900">{patient.mobileNo || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Profile Section */}
      <Section title="Medical Profile" icon={FileText}>
        {patient.medicalHistory ? (
          <InfoField label="Medical History" value={patient.medicalHistory} />
        ) : (
          <p className="text-gray-500 text-sm">No medical history recorded</p>
        )}
      </Section>

      {/* Allergies Section */}
      <Section title="Allergies" icon={AlertTriangle}>
        {patient.allergies ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-900">{patient.allergies}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No allergies recorded</p>
        )}
      </Section>

      {/* Current Medications Section */}
      <Section title="Current Medications" icon={Pill}>
        {patient.currentMedications ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-900 whitespace-pre-wrap">{patient.currentMedications}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No medications recorded</p>
        )}
      </Section>

      {/* Emergency Contact Section */}
      <Section title="Emergency Contact" icon={AlertCircle}>
        {patient.emergencyContact && (patient.emergencyContact.name || patient.emergencyContact.phone) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patient.emergencyContact.name && (
              <InfoField label="Contact Name" value={patient.emergencyContact.name} />
            )}
            {patient.emergencyContact.relationship && (
              <InfoField label="Relationship" value={patient.emergencyContact.relationship} />
            )}
            {patient.emergencyContact.phone && (
              <InfoField label="Phone Number" value={patient.emergencyContact.phone} />
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No emergency contact information recorded</p>
        )}
      </Section>

      {/* Insurance Details Section */}
      <Section title="Insurance Details" icon={Shield}>
        {patient.insuranceDetails && (patient.insuranceDetails.provider || patient.insuranceDetails.policyNumber) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patient.insuranceDetails.provider && (
              <InfoField label="Insurance Provider" value={patient.insuranceDetails.provider} />
            )}
            {patient.insuranceDetails.policyNumber && (
              <InfoField label="Policy Number" value={patient.insuranceDetails.policyNumber} />
            )}
            {patient.insuranceDetails.groupNumber && (
              <InfoField label="Group Number" value={patient.insuranceDetails.groupNumber} />
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No insurance details recorded</p>
        )}
      </Section>

      {/* Metadata */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>
          Last updated: {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default PatientProfileView;
