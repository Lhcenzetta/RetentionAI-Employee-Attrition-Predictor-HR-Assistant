"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, Brain, ShieldCheck, Users, ArrowRight, Activity, Zap, BarChart3 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 flex flex-col overflow-x-hidden">
      
      {/* ================= BACKGROUND DECORATION ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-60" />
      </div>

      {/* ================= HERO ================= */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest mb-8 shadow-sm animate-bounce-slow">
          <Zap className="w-3 h-3 fill-current" />
          AI-Powered HR Analytics
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
          Predict Employee Attrition <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Before It Happens
          </span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          The intelligent platform that combines 
          <span className="text-slate-900 font-semibold"> Supervised Machine Learning</span> and 
          <span className="text-slate-900 font-semibold"> Generative AI</span> to secure your company's future talent.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
          <button
            onClick={() => router.push("/Signup")}
            className="group px-10 py-5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95"
          >
            Start Analysis 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push("/Signup")}
            className="px-10 py-5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            HR Access Portal
          </button>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-10 border-y border-slate-100">
            <StatItem label="Accuracy" value="94%" />
            <StatItem label="Predictors" value="23+" />
            <StatItem label="AI Engine" value="Gemini" />
            <StatItem label="Setup" value="Instant" />
        </div>
      </header>

      <section className="relative z-10 bg-slate-50/50 backdrop-blur-sm py-28 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Advanced Decision Support
            </h2>
            <p className="text-slate-500 font-medium italic">Stop guessing. Start knowing why employees leave.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon={<TrendingUp className="text-blue-600" />}
              title="Predictive Analytics"
              desc="Our ML model analyzes 23 key indicators from monthly income to work-life balance to pinpoint risks."
              color="blue"
            />
            <Feature
              icon={<Brain className="text-indigo-600" />}
              title="Generative AI Insights"
              desc="Gemini-powered engine drafts detailed retention strategies tailored to the individual's psychological profile."
              color="indigo"
            />
            <Feature
              icon={<ShieldCheck className="text-emerald-600" />}
              title="Operational Stability"
              desc="Protect your ROI by reducing hiring costs and maintaining institutional knowledge across departments."
              color="emerald"
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-20 text-slate-900">
            Four Steps to Retention
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <Step number="01" title="Data Input" desc="Upload or enter employee career metrics." icon={<Users className="w-5 h-5"/>} />
            <Step number="02" title="ML Processing" desc="AI calculates the exact probability of churn." icon={<Activity className="w-5 h-5"/>}/>
            <Step number="03" title="Risk Scoring" desc="Visual indicators label risk from Low to Critical." icon={<BarChart3 className="w-5 h-5"/>}/>
            <Step number="04" title="Action Plan" desc="Receive an automated AI-generated strategy." icon={<Brain className="w-5 h-5"/>}/>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center pb-12 border-b border-slate-800 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black tracking-tighter mb-2 italic">RetentionAI.</h3>
              <p className="text-slate-400 text-sm max-w-xs">Empowering Human Resources with the next generation of predictive intelligence.</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => router.push("/login")} className="text-sm font-bold text-slate-300 hover:text-white transition underline underline-offset-8">Access Dashboard</button>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} All Rights Reserved.</p>
            <p className="flex items-center gap-2">Built for enterprise excellence</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

function StatItem({ label, value }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-900">{value}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</span>
        </div>
    );
}

function Feature({ icon, title, desc, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="group p-10 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-white transition-all duration-300 bg-white flex flex-col items-start relative overflow-hidden">
      <div className={`w-14 h-14 rounded-2xl ${colors[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="font-black text-xl mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>
      <div className="mt-auto pt-4 flex items-center text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
        LEARN MORE <ArrowRight className="ml-2 w-3 h-3" />
      </div>
    </div>
  );
}

function Step({ number, title, desc, icon }) {
  return (
    <div className="relative group">
      <div className="mb-6 flex items-center gap-4">
        <div className="text-4xl font-black text-slate-100 group-hover:text-blue-50 transition-colors duration-500">{number}</div>
        <div className="h-[1px] flex-grow bg-slate-100" />
      </div>
      <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
              {icon}
          </div>
          <h4 className="font-black text-slate-900 uppercase tracking-tight">{title}</h4>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed pl-12">{desc}</p>
    </div>
  );
}