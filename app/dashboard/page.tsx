import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import { SignOut } from "@/components/sign-out";

interface LegalConsultation {
  id: string;
  type: string;
  timestamp: string;
  legal_category: string;
  address: string | null;
  urgency_level: string;
  country: string;
  phone: string;
  case_description: string;
  consultation_type: string;
  language: string;
  email: string;
}

interface MedicalConsultation {
  id: string;
  type: string;
  timestamp: string;
  address: string | null;
  category: string;
  urgency_level: string;
  country: string;
  phone: string;
  description: string;
  language: string;
  email: string;
}

interface Consultations {
  legal: LegalConsultation[];
  medical: MedicalConsultation[];
  hasConsultations: boolean;
}

async function validateToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.SESSION_COOKIE_NAME!)?.value;

  // console.log('Dashboard: Cookie name:', process.env.SESSION_COOKIE_NAME);
  // console.log('Dashboard: Token found:', !!token);

  if (!token) {
    // console.log('Dashboard: No token, redirecting to /');
    redirect("/");
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(token, true);
    // console.log('Dashboard: Token verified successfully');
    return decodedClaims;
  } catch (error) {
    // console.log('Dashboard: Token verification failed, redirecting to /');
    redirect("/");
  }
}

async function getUserConsultations(email: string): Promise<Consultations> {
  // Execute both requests in parallel for speed
  const [legalSnapshot, medicalSnapshot] = await Promise.all([
    db.collection('legal_consultations')
      .where('email', '==', email)
      .limit(10) // Limit the number of results
      .get(),

    db.collection('medical_consultations')
      .where('email', '==', email)
      .limit(10) // Ограничиваем количество результатов
      .get()
  ]);

  // Transform data into a convenient format with a check for the existence of documents
  const legalConsultations: LegalConsultation[] = legalSnapshot.empty
    ? []
    : legalSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'legal',
      ...doc.data()
    } as LegalConsultation));

  const medicalConsultations: MedicalConsultation[] = medicalSnapshot.empty
    ? []
    : medicalSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'medical',
      ...doc.data()
    } as MedicalConsultation));

  // Cache information about the presence of consultations
  const hasConsultations = legalConsultations.length > 0 || medicalConsultations.length > 0;

  // Return object with both types of consultations
  return {
    legal: legalConsultations,
    medical: medicalConsultations,
    hasConsultations
  };
}

export default async function Dashboard() {
  const userData = await validateToken();
  const consultations: Consultations = await getUserConsultations(userData.email!);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Information about user</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {userData.email}</p>
            <p><span className="font-medium">ID:</span> {userData.uid || userData.user_id}</p>
            <p><span className="font-medium">Email status:</span> {userData.email_verified ? 'Verified' : 'Not verified'}</p>
          </div>
        </div>

        {/* Legal consultations */}
        {consultations.legal.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-2">Legal consultations</h2>

            {consultations.legal.map((consultation, index) => (
              <div key={consultation.id} className="border-b border-purple-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                <h3 className="font-medium text-purple-700 mb-2">Consultation #{index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Category:</span> {consultation.legal_category}</p>
                    <p><span className="font-medium">Description:</span> {consultation.case_description}</p>
                    <p><span className="font-medium">Consultation type:</span> {consultation.consultation_type}</p>
                    <p><span className="font-medium">Country:</span> {consultation.country}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Phone:</span> {consultation.phone}</p>
                    <p><span className="font-medium">Language:</span> {consultation.language}</p>
                    <p><span className="font-medium">Urgency:</span> {consultation.urgency_level === 'medium' ? 'Medium' : consultation.urgency_level}</p>
                    <p><span className="font-medium">Date:</span> {
                      consultation.timestamp ? new Date(consultation.timestamp).toLocaleString('ru-RU') : 'Нет данных'
                    }</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Medical consultations */}
        {consultations.medical.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Medical consultations</h2>

            {consultations.medical.map((consultation, index) => (
              <div key={consultation.id} className="border-b border-green-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                <h3 className="font-medium text-green-700 mb-2">Consultation #{index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Category:</span> {consultation.category}</p>
                    <p><span className="font-medium">Description:</span> {consultation.description}</p>
                    <p><span className="font-medium">Consultation type:</span> {consultation.type}</p>
                    <p><span className="font-medium">Country:</span> {consultation.country}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Phone:</span> {consultation.phone}</p>
                    <p><span className="font-medium">Language:</span> {consultation.language}</p>
                    <p><span className="font-medium">Urgency:</span> {consultation.urgency_level === 'medium' ? 'Medium' : consultation.urgency_level}</p>
                    <p><span className="font-medium">Date:</span> {
                      consultation.timestamp ? new Date(consultation.timestamp).toLocaleString('ru-RU') : 'No data'
                    }</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* If there are no consultations */}
        {!consultations.hasConsultations && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700">You have no consultations yet</p>
          </div>
        )}
      </div>
      {/* Sign out button */}
      <SignOut
        variant="default"
        className="fixed top-4 left-8"
      />
    </div>
  )
}