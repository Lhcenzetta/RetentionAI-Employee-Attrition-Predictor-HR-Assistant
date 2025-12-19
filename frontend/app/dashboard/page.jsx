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

  /* ================= HANDLERS ================= */
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
      /* ---------- 1️⃣ PREDICT CHURN ---------- */
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

      /* ---------- 2️⃣ GENERATE RETENTION PLAN ---------- */
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

  const percent = result
    ? Math.round(result.churn_probability * 100)
    : null;

  const riskColor =
    percent >= 70
      ? "text-red-600"
      : percent >= 40
      ? "text-yellow-500"
      : "text-green-600";

  const riskLabel =
    percent >= 70 ? "High Risk" : percent >= 40 ? "Medium Risk" : "Low Risk";

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ================= LEFT: FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-8 space-y-6"
        >
          <h1 className="text-2xl font-semibold">
            HR – Employee Churn Analysis
          </h1>

          {/* PERSONAL */}
          <section>
            <h2 className="font-medium mb-2">Personal</h2>
            <input className="input" name="Age" placeholder="Age" onChange={handleChange} />
            <select className="input" name="Gender" onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="input" name="MaritalStatus" onChange={handleChange}>
              <option>Married</option>
              <option>Single</option>
              <option>Divorced</option>
            </select>
          </section>

          {/* JOB */}
          <section>
            <h2 className="font-medium mb-2">Job Information</h2>
            <select className="input" name="Department" onChange={handleChange}>
              <option>Research & Development</option>
              <option>Sales</option>
              <option>Human Resources</option>
            </select>
            <select className="input" name="JobRole" onChange={handleChange}>
              <option>Laboratory Technician</option>
              <option>Sales Executive</option>
              <option>Research Scientist</option>
              <option>HR Manager</option>
            </select>
            <select className="input" name="BusinessTravel" onChange={handleChange}>
              <option>Travel_Rarely</option>
              <option>Travel_Frequently</option>
              <option>Non-Travel</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="OverTime" onChange={handleChange} />
              OverTime
            </label>
          </section>

          {/* EDUCATION */}
          <section>
            <h2 className="font-medium mb-2">Education</h2>
            <input className="input" name="Education" placeholder="Education (1–5)" onChange={handleChange} />
            <input className="input" name="EducationField" placeholder="Education Field" onChange={handleChange} />
          </section>

          {/* SATISFACTION */}
          <section>
            <h2 className="font-medium mb-2">Satisfaction & Performance</h2>
            <input className="input" name="JobSatisfaction" placeholder="Job Satisfaction (1–4)" onChange={handleChange} />
            <input className="input" name="EnvironmentSatisfaction" placeholder="Environment Satisfaction (1–4)" onChange={handleChange} />
            <input className="input" name="RelationshipSatisfaction" placeholder="Relationship Satisfaction (1–4)" onChange={handleChange} />
            <input className="input" name="WorkLifeBalance" placeholder="Work Life Balance (1–4)" onChange={handleChange} />
            <input className="input" name="PerformanceRating" placeholder="Performance Rating (1–4)" onChange={handleChange} />
            <input className="input" name="JobInvolvement" placeholder="Job Involvement (1–4)" onChange={handleChange} />
          </section>

          {/* EXPERIENCE */}
          <section>
            <h2 className="font-medium mb-2">Experience</h2>
            <input className="input" name="MonthlyIncome" placeholder="Monthly Income" onChange={handleChange} />
            <input className="input" name="NumCompaniesWorked" placeholder="Companies Worked" onChange={handleChange} />
            <input className="input" name="TotalWorkingYears" placeholder="Total Working Years" onChange={handleChange} />
            <input className="input" name="YearsAtCompany" placeholder="Years at Company" onChange={handleChange} />
            <input className="input" name="YearsInCurrentRole" placeholder="Years in Current Role" onChange={handleChange} />
            <input className="input" name="YearsSinceLastPromotion" placeholder="Years Since Last Promotion" onChange={handleChange} />
            <input className="input" name="YearsWithCurrManager" placeholder="Years With Current Manager" onChange={handleChange} />
            <input className="input" name="JobLevel" placeholder="Job Level" onChange={handleChange} />
          </section>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Running Model…" : "Predict & Generate Plan"}
          </button>
        </form>

        {/* ================= RIGHT: RESULT ================= */}
        <div className="bg-white rounded-xl shadow p-8">
          {!result && <p className="text-gray-500">No result yet</p>}

          {result && (
            <>
              <p className="text-sm text-gray-500">Churn Probability</p>
              <p className={`text-6xl font-bold ${riskColor}`}>
                {percent}%
              </p>
              <p className="mt-2 text-sm font-medium">{riskLabel}</p>

              {retentionPlan.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">
                    Retention Plan
                  </h3>
                  <ul className="space-y-3 text-sm">
                    {retentionPlan.map((step, i) => (
                      <li
                        key={i}
                        className="p-3 bg-gray-50 border rounded-lg"
                      >
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          border-radius: 0.5rem;
          margin-bottom: 0.4rem;
        }
      `}</style>
    </div>
  );
}
