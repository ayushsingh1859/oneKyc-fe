import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Profile from "./Profile"; // Import Profile component
import DocumentCard from "./Documentcard";
import OtpVerification from "./Otp-verification";
import Support from "./Support";
import { BASE_URL } from "./Url";

import Modal from "./Modal";

import {
  Bell,
  ChevronDown,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  UserCheck,
} from "lucide-react";

// Define interface for API response
interface DashboardData {
    userId: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    phoneNumber: string;
    emailAddress: string;
    occupation: string;
    residentialAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    permanentAddress: string;
    taxIdNumber: string;
    pepStatus: string;
    consent: boolean;
    sourceOfFunds?: string; // Optional property
    idDocument?: string;
    passport?: string;
    bankStatement?: string;
    addressProof?: string;
    selfie?: string;
    nationalId?: string;
    driverLicense?: string;
    utilityBill?: string;
}

const KycDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // ✅ Extract userId
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to Dashboard
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const url = BASE_URL(userId);

    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError("Failed to fetch user data.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
        setLoading(false);
      });
  }, [userId]);

  const isPersonalInfoComplete = 
  data?.userId &&
  data?.fullName &&
  data?.dateOfBirth &&
  data?.gender &&
  data?.nationality &&
  data?.phoneNumber &&
  data?.emailAddress &&
  data?.occupation &&
  data?.residentialAddress &&
  data?.city &&
  data?.state &&
  data?.postalCode &&
  data?.country &&
  data?.permanentAddress &&
  data?.taxIdNumber &&
  data?.pepStatus &&
  data?.consent;

  const areDocumentsUploaded = !!(
    data?.idDocument &&
    data?.passport &&
    data?.bankStatement &&
    data?.addressProof &&
    data?.selfie
  );

  const isKYCComplete = isPersonalInfoComplete && areDocumentsUploaded;
  const progressPercentage = isKYCComplete ? "100%" : "60%";


  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <UserCheck className="h-6 w-6 text-primary" />
            <span className="text-xl">KYC Portal</span>
          </Link>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {[{ id: "dashboard", icon: Home, label: "Dashboard" },
            { id: "profile", icon: User, label: "Profile" },
            { id: "support", icon: MessageSquare, label: "Support" },
            { id: "logout", icon: LogOut, label: "Logout" }]
            .map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex w-full items-center space-x-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground ${
                  activeTab === id ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="z-50 flex h-16 items-center justify-between bg-white shadow-md px-4 md:px-6">
          <h1 className="text-2xl font-semibold">KYC Dashboard</h1>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === "dashboard" && (
            <div className="mx-auto max-w-6xl space-y-6">
              <section>
                {loading ? (
                  <h1 className="text-2xl font-bold">Loading...</h1>
                ) : error ? (
                  <h1 className="text-2xl font-bold text-red-500">{error}</h1>
                ) : data ? (
                  <h1 className="text-2xl font-bold">
                    Hi {data.fullName}, KYC Verification
                  </h1>
                ) : (
                  <h1 className="text-2xl font-bold">KYC Verification</h1>
                )}
                <p className="text-muted-foreground">
                  Complete your verification to access all features
                </p>
              </section>

              {/* Verification Progress */}
              <section>
                <h2 className="text-xl font-semibold">Verification Progress</h2>
                <div className="flex items-center justify-between">
                  <span>{isKYCComplete ? "100% Complete" : "60% Complete"}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: progressPercentage }}></div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {[
                    {
                      label: "Personal Info",
                      status: isPersonalInfoComplete ? "Completed" : "Incomplete",
                      icon: User,
                    },
                    {
                      label: "Documents",
                      status: areDocumentsUploaded ? "Completed" : "Incomplete",
                      icon: FileText,
                    },
                    {
                      label: "Verification",
                      status: isKYCComplete ? "Completed" : "In Progress",
                      icon: CreditCard,
                    },
                  ].map(({ label, status, icon: Icon }, index) => (
                    <div key={index} className="flex flex-col items-center rounded-lg border p-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${status === "Completed" ? "bg-green-100" : "bg-gray-200"}`}>
                        <Icon className={`h-5 w-5 ${status === "Completed" ? "text-green-600" : "text-gray-500"}`} />
                      </div>
                      <h3 className="mt-2 font-medium">{label}</h3>
                      <span className={`mt-1 rounded-full px-2 py-0.5 text-xs ${status === "Completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Uploaded Documents */}
              <section>
                  <h2 className="text-xl font-semibold">Uploaded Documents</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data ? (
                      <>
                        <DocumentCard
                          title="ID Card"
                          status={data.idDocument ? "verified" : "pending"}
                          date={data.idDocument ? "Uploaded on XYZ Date" : "No document uploaded"}
                          documentUrl={data.idDocument || ""} // ✅ Pass document URL
                        />

                        <DocumentCard
                          title="Passport"
                          status={data.passport ? "verified" : "pending"}
                          date={data.passport ? "Uploaded on XYZ Date" : "No document uploaded"}
                          documentUrl={data.passport || ""} // ✅ Pass document URL
                        />

                        <DocumentCard
                          title="Bank Statement"
                          status={data.bankStatement ? "verified" : "pending"}
                          date={data.bankStatement ? "Uploaded on XYZ Date" : "No document uploaded"}
                          documentUrl={data.bankStatement || ""} // ✅ Pass document URL
                        />

                      </>
                    ) : (
                      <p className="text-red-500">No documents uploaded yet - Pending Verification</p>
                    )}
                  </div>
                </section>

              {/* OTP Verification */}
              <section>
                <h2 className="text-xl font-semibold">Phone Verification</h2>
                <OtpVerification />
              </section>
            </div>
          )}

          {activeTab === "profile" && <Profile />}
          {activeTab === "support" && <Support />}
        </main>
      </div>
    </div>
  );
};

export default KycDashboard;
