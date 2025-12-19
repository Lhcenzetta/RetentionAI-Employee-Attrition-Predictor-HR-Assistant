"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalysePage() {
  const router = useRouter();

  /* ================= STATE ================= */
  const [form, setForm] = useState({
    Age: "",
    BusinessTravel: "Travel_Rarely",
    Department: "Research & Development",
    Education: "",
    EducationField: "",
    EnvironmentSatisfaction: "",
    Gender: "Male",
    JobInvolvement: "",
    JobLevel: "",
    JobRole: "Laboratory Technician",
    JobSatisfaction: "",
    MaritalStatus: "Married",
    MonthlyIncome: "",
    NumCompaniesWorked: "",
    OverTime: false,
    PerformanceRating: "",
    RelationshipSatisfaction: "",
    TotalWorkingYears: "",
    WorkLifeBalance: "",
    YearsAtCompany: "",
    YearsInCurrentRole: "",
    YearsSinceLastPromotion: "",
    YearsWithCurrManager: ""
  });

  const [result, setResult] = useState(null);
  const [retentionPlan, setRetentionPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  /* ================= LOGOUT HANDLER ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    router.replace("/login"); // .replace empêche l'utilisateur de revenir en arrière
  };

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setRetentionPlan([]);

    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    try {
      const predictRes = await fetch(
        "http://127.0.0.1:8000/predict_profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            user_id: Number(user_id),
            ...form
          })
        }
      );

      const predictData = await predictRes.json();
      setResult(predictData);

      if (predictData.churn_probability >= 0.5) {
        const planRes = await fetch(
          "http://127.0.0.1:8000/generate-retention-plan",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              accept: "application/json"
            },
            body: JSON.stringify({ user_id: Number(user_id) })
          }
        );

        const planData = await planRes.json();
        setRetentionPlan(planData.retention_plan || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const percent = result ? Math.round(result.churn_probability * 100) : null;
  const riskColor = percent >= 70 ? "text-red-600" : percent >= 40 ? "text-orange-500" : "text-green-600";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER WITH LOGOUT */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Churn Analysis 🔍</h1>
            <p className="text-slate-500 mt-2">Intelligence Artificielle appliquée aux Ressources Humaines.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold text-sm shadow-sm hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            🚪 Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ================= LEFT: FORM ================= */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
            
            {/* 1. Personal */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">1. Demographics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="field-group">
                  <label>Age</label>
                  <input className="input" name="Age" type="number" placeholder="Enter Age" onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label>Gender</label>
                  <select className="input" name="Gender" onChange={handleChange}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>MaritalStatus</label>
                  <select className="input" name="MaritalStatus" onChange={handleChange}>
                    <option>Married</option>
                    <option>Single</option>
                    <option>Divorced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Employment */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">2. Employment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="field-group">
                  <label>Department</label>
                  <select className="input" name="Department" onChange={handleChange}>
                    <option>Research & Development</option>
                    <option>Sales</option>
                    <option>Human Resources</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>JobRole</label>
                  <select className="input" name="JobRole" onChange={handleChange}>
                    <option>Laboratory Technician</option>
                    <option>Sales Executive</option>
                    <option>Research Scientist</option>
                    <option>HR Manager</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>BusinessTravel</label>
                  <select className="input" name="BusinessTravel" onChange={handleChange}>
                    <option>Travel_Rarely</option>
                    <option>Travel_Frequently</option>
                    <option>Non-Travel</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>MonthlyIncome</label>
                  <input className="input" name="MonthlyIncome" placeholder="Ex: 5000" onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label>JobLevel</label>
                  <input className="input" name="JobLevel" placeholder="1 - 5" onChange={handleChange} />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="OverTime" className="w-5 h-5 accent-blue-600 rounded" onChange={handleChange} />
                    <span className="text-sm font-semibold group-hover:text-blue-600 transition-colors">OverTime</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Education */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">3. Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="field-group">
                  <label>Education</label>
                  <input className="input" name="Education" placeholder="1 - 5" onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label>EducationField</label>
                  <input className="input" name="EducationField" placeholder="Life Sciences, etc." onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* 4. Satisfaction */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">4. Ratings & Satisfaction (1-4)</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {["JobSatisfaction", "EnvironmentSatisfaction", "RelationshipSatisfaction", "WorkLifeBalance", "PerformanceRating", "JobInvolvement"].map(field => (
                  <div key={field} className="field-group">
                    <label className="text-[11px] font-bold text-slate-400">{field}</label>
                    <input className="input text-center font-bold" name={field} placeholder="1-4" onChange={handleChange} />
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Company Experience */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">5. Tenure & Experience</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "NumCompaniesWorked", "TotalWorkingYears", "YearsAtCompany", 
                  "YearsInCurrentRole", "YearsSinceLastPromotion", "YearsWithCurrManager"
                ].map(field => (
                  <div key={field} className="field-group">
                    <label className="text-[10px] truncate">{field}</label>
                    <input className="input" name={field} placeholder="Years" onChange={handleChange} />
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? "System is Analyzing..." : "Generate Analysis Report"}
            </button>
          </form>

          {/* ================= RIGHT: RESULT ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-12">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Analysis Results</h3>

                {loading && (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="space-y-2">
                      <p className="text-blue-600 font-bold">Gemini is processing...</p>
                      <p className="text-slate-400 text-[10px] animate-pulse italic">
                        Calcul des risques et génération du plan de rétention sur mesure...
                      </p>
                    </div>
                  </div>
                )}

                {!loading && !result && (
                  <div className="text-center py-20 text-slate-300">
                    <p className="text-5xl mb-4">📈</p>
                    <p className="text-sm font-medium">Ready to analyze</p>
                  </div>
                )}

                {!loading && result && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Churn Probability</p>
                      <p className={`text-7xl font-black ${riskColor}`}>{percent}%</p>
                    </div>

                    <div className="space-y-4">
                       <h4 className="font-bold text-slate-700">Retention Plan</h4>
                       {retentionPlan.length > 0 ? (
                         <ul className="space-y-3">
                           {retentionPlan.map((step, i) => (
                             <li key={i} className="flex gap-3 p-4 bg-blue-50 text-blue-700 text-sm rounded-xl border border-blue-100 italic">
                               <span className="font-bold shrink-0">#{i+1}</span>
                               {step}
                             </li>
                           ))}
                         </ul>
                       ) : (
                         <p className="text-emerald-600 text-sm font-medium bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                           ✅ No urgent action required.
                         </p>
                       )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-group label { font-size: 0.75rem; font-weight: 700; color: #64748b; }
        .input {
          width: 100%;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          background-color: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}