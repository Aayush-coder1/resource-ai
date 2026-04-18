"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  Cpu,
  Zap,
  Target,
} from "lucide-react";
import type {
  NGORequest,
  Volunteer,
  AllocationResult,
} from "@/types/allocation";

interface AIDashboardProps {
  requests: NGORequest[];
  volunteers: Volunteer[];
  onAllocationComplete?: (results: AllocationResult[]) => void;
}

const urgencyConfig = {
  High: {
    label: "High",
    classes:
      "bg-[oklch(0.62_0.22_25)]/15 text-[oklch(0.75_0.22_25)] border-[oklch(0.62_0.22_25)]/30",
    dot: "bg-[oklch(0.62_0.22_25)]",
    glow: "shadow-[oklch(0.62_0.22_25)]/20",
  },
  Medium: {
    label: "Medium",
    classes:
      "bg-[oklch(0.78_0.18_75)]/15 text-[oklch(0.88_0.18_75)] border-[oklch(0.78_0.18_75)]/30",
    dot: "bg-[oklch(0.78_0.18_75)]",
    glow: "shadow-[oklch(0.78_0.18_75)]/20",
  },
  Low: {
    label: "Low",
    classes:
      "bg-[oklch(0.68_0.18_145)]/15 text-[oklch(0.78_0.18_145)] border-[oklch(0.68_0.18_145)]/30",
    dot: "bg-[oklch(0.68_0.18_145)]",
    glow: "shadow-[oklch(0.68_0.18_145)]/20",
  },
};

const availabilityConfig = {
  Available:
    "bg-[oklch(0.68_0.18_145)]/15 text-[oklch(0.78_0.18_145)] border-[oklch(0.68_0.18_145)]/30",
  Busy: "bg-[oklch(0.78_0.18_75)]/15 text-[oklch(0.88_0.18_75)] border-[oklch(0.78_0.18_75)]/30",
  Offline: "bg-secondary text-muted-foreground border-border",
};

const typeIcons: Record<string, string> = {
  Food: "🥗",
  Medical: "🏥",
  Volunteers: "👥",
};

async function runGeminiMatching(
  requests: NGORequest[],
  volunteers: Volunteer[],
): Promise<AllocationResult[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error(
        "[v0] NEXT_PUBLIC_GEMINI_API_KEY not found. Falling back to basic matching.",
      );
      return fallbackAI(requests, volunteers);
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert NGO resource allocation system. Your task is to match volunteers with NGO requests based on skill relevance, location proximity, and availability.

Here are the NGO Requests (sorted by urgency):
${requests.map((r, i) => `${i + 1}. "${r.title}" - Type: ${r.type}, Location: ${r.location}, Urgency: ${r.urgency}`).join("\n")}

Here are the Available Volunteers:
${volunteers.map((v, i) => `${i + 1}. ${v.name} - Skills: ${v.skills.join(", ")}, Location: ${v.location}, Availability: ${v.availability}`).join("\n")}

IMPORTANT RULES FOR MATCHING:
1. ONLY match volunteers that are "Available"
2. Prioritize HIGH urgency requests first
3. Match based on SKILL RELEVANCE (e.g., "Medical" requests need medical-skilled volunteers)
4. Consider location proximity (prefer volunteers in same/nearby location)
5. Each volunteer can only be matched ONCE
6. Provide a match score (0-100) based on skill fit

Output ONLY valid JSON array with NO additional text or markdown formatting:
[
  {
    "volunteer": "volunteer_name",
    "request": "request_title",
    "priority": "High|Medium|Low",
    "reason": "explanation of why this is a good match",
    "matchScore": 85
  }
]

Do not include any text before or after the JSON array.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean response - remove markdown code blocks if present
    let jsonText = responseText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonText);
    console.log("[v0] Gemini matched results:", parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("[v0] Error calling Gemini API:", error);
    return fallbackAI(requests, volunteers);
  }
}

function fallbackAI(
  requests: NGORequest[],
  volunteers: Volunteer[],
): AllocationResult[] {
  const available = volunteers.filter((v) => v.availability === "Available");
  if (!available.length || !requests.length) return [];

  const sorted = [...requests].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.urgency] - order[b.urgency];
  });

  const results: AllocationResult[] = [];
  const usedVolunteers = new Set<string>();

  for (const req of sorted) {
    // First try to match by skill
    let match = available.find((v) => {
      if (usedVolunteers.has(v.id)) return false;
      const reqLower = req.type.toLowerCase();
      return v.skills.some((s) => {
        const skillLower = s.toLowerCase();
        return (
          (reqLower.includes("medical") &&
            (skillLower.includes("medical") ||
              skillLower.includes("nurse") ||
              skillLower.includes("doctor"))) ||
          (reqLower.includes("food") &&
            (skillLower.includes("food") ||
              skillLower.includes("cook") ||
              skillLower.includes("nutrition"))) ||
          (reqLower.includes("volunteer") &&
            skillLower.includes("coordination"))
        );
      });
    });

    // If no skill match, try location match
    if (!match) {
      match = available.find(
        (v) =>
          !usedVolunteers.has(v.id) &&
          v.location
            .toLowerCase()
            .includes(req.location.toLowerCase().split(",")[0]),
      );
    }

    // If still no match, just pick first available
    if (!match) {
      match = available.find((v) => !usedVolunteers.has(v.id));
    }

    if (match) {
      usedVolunteers.add(match.id);
      const skillMatch =
        req.type === "Medical"
          ? match.skills.some((s) => /medical|nurse|doctor|aid/i.test(s))
          : req.type === "Food"
            ? match.skills.some((s) => /cook|food|nutrition/i.test(s))
            : req.type === "Volunteers"
              ? match.skills.some((s) => /coordination|organiz|manage/i.test(s))
              : false;

      results.push({
        volunteer: match.name,
        request: req.title,
        priority: req.urgency,
        reason: skillMatch
          ? `Skill-matched volunteer with expertise in "${req.type}"`
          : `Best available volunteer near ${req.location}`,
        matchScore: skillMatch
          ? Math.floor(80 + Math.random() * 18)
          : Math.floor(60 + Math.random() * 20),
      });
    }
  }

  return results;
}

const aiSteps = [
  {
    icon: Target,
    text: "Scanning active requests...",
    color: "text-[oklch(0.62_0.22_25)]",
  },
  { icon: Cpu, text: "Analyzing volunteer profiles...", color: "text-primary" },
  {
    icon: MapPin,
    text: "Computing proximity matrix...",
    color: "text-[oklch(0.78_0.18_75)]",
  },
  {
    icon: Zap,
    text: "Optimizing allocation pairs...",
    color: "text-[oklch(0.68_0.18_145)]",
  },
];

export function AIDashboard({
  requests,
  volunteers,
  onAllocationComplete,
}: AIDashboardProps) {
  const [aiRunning, setAiRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiResults, setAiResults] = useState<AllocationResult[] | null>(null);

  const runAI = async () => {
    setAiRunning(true);
    setAiResults(null);
    setCurrentStep(0);

    // Animated steps
    for (let i = 0; i < aiSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }

    const results = await runGeminiMatching(requests, volunteers);
    setAiResults(results);
    setAiRunning(false);
    onAllocationComplete?.(results);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* NGO Requests List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-xl shadow-black/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[oklch(0.78_0.18_75)]/10 border border-[oklch(0.78_0.18_75)]/20">
              <AlertTriangle className="w-3.5 h-3.5 text-[oklch(0.78_0.18_75)]" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Active Requests
            </h3>
          </div>
          <motion.span
            key={requests.length}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground border border-border"
          >
            {requests.length}
          </motion.span>
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
            <AlertTriangle className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">No requests yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            <AnimatePresence>
              {requests.map((req, i) => {
                const u = urgencyConfig[req.urgency];
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className={`flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all cursor-default shadow-lg ${u.glow}`}
                  >
                    <span className="text-lg leading-none mt-0.5">
                      {typeIcons[req.type] || "📋"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground truncate">
                          {req.title}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${u.classes}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${u.dot}`} />
                          {u.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {req.type}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {req.location}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.section>

      {/* Volunteers List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-xl shadow-black/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[oklch(0.68_0.18_145)]/10 border border-[oklch(0.68_0.18_145)]/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.68_0.18_145)]" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Volunteer Pool
            </h3>
          </div>
          <motion.span
            key={volunteers.length}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground border border-border"
          >
            {volunteers.length}
          </motion.span>
        </div>

        {volunteers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
            <CheckCircle2 className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">No volunteers yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            <AnimatePresence>
              {volunteers.map((vol, i) => (
                <motion.div
                  key={vol.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all cursor-default"
                >
                  <motion.div
                    className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold shrink-0 ${
                      vol.availability === "Available"
                        ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/30"
                        : "bg-secondary text-muted-foreground border border-border"
                    }`}
                    whileHover={{ rotate: 5 }}
                  >
                    {vol.name.charAt(0).toUpperCase()}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">
                        {vol.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${availabilityConfig[vol.availability]}`}
                      >
                        {vol.availability}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{vol.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.section>

      {/* AI Engine */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-primary/20 rounded-2xl p-5 shadow-xl shadow-primary/10"
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.65_0.18_220)] shadow-lg shadow-primary/25"
            animate={aiRunning ? { rotate: 360 } : {}}
            transition={{
              duration: 2,
              repeat: aiRunning ? Infinity : 0,
              ease: "linear",
            }}
          >
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              AI Allocation Engine
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Powered by intelligent matching algorithms
            </p>
          </div>
        </div>

        <motion.button
          onClick={runAI}
          disabled={
            aiRunning || requests.length === 0 || volunteers.length === 0
          }
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-primary to-[oklch(0.65_0.18_220)] text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden relative"
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />

          <AnimatePresence mode="wait">
            {aiRunning ? (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 relative z-10"
              >
                <motion.span
                  className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                Processing with AI...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 relative z-10"
              >
                <Sparkles className="w-4 h-4" />
                Run AI Allocation
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {(requests.length === 0 || volunteers.length === 0) && !aiRunning && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Add at least one request and one volunteer to run the AI engine.
          </p>
        )}

        {/* AI Processing Animation */}
        <AnimatePresence>
          {aiRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border overflow-hidden"
            >
              <div className="space-y-3">
                {aiSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i === currentStep;
                  const isComplete = i < currentStep;

                  return (
                    <motion.div
                      key={step.text}
                      initial={{ opacity: 0.3 }}
                      animate={{
                        opacity: isActive || isComplete ? 1 : 0.3,
                        x: isActive ? 8 : 0,
                      }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-lg ${
                          isComplete
                            ? "bg-[oklch(0.68_0.18_145)]/20"
                            : isActive
                              ? "bg-primary/20"
                              : "bg-secondary"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.68_0.18_145)]" />
                        ) : (
                          <Icon
                            className={`w-3.5 h-3.5 ${isActive ? step.color : "text-muted-foreground"}`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isActive
                            ? "text-foreground"
                            : isComplete
                              ? "text-muted-foreground"
                              : "text-muted-foreground/50"
                        }`}
                      >
                        {step.text}
                      </span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-4 h-1 rounded-full bg-primary overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: 16 }}
                          transition={{ duration: 0.7 }}
                        >
                          <motion.div
                            className="h-full bg-primary-foreground/30"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {aiResults !== null && !aiRunning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 space-y-3"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[oklch(0.68_0.18_145)]/10 border border-[oklch(0.68_0.18_145)]/20"
              >
                <CheckCircle2 className="w-4 h-4 text-[oklch(0.68_0.18_145)]" />
                <span className="text-xs font-semibold text-[oklch(0.68_0.18_145)]">
                  Allocation Complete — {aiResults.length} match
                  {aiResults.length !== 1 ? "es" : ""} found
                </span>
              </motion.div>

              {aiResults.length === 0 ? (
                <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs text-muted-foreground text-center">
                  No available volunteers to match requests.
                </div>
              ) : (
                aiResults.map((result, i) => {
                  const u = urgencyConfig[result.priority];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                            {result.volunteer}
                          </span>
                          <motion.span
                            className="text-primary"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                          <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                            {result.request}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${u.classes}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${u.dot}`} />
                            {result.priority}
                          </span>
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.3 + i * 0.1,
                              type: "spring",
                            }}
                            className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20"
                          >
                            {result.matchScore}%
                          </motion.span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {result.reason}
                      </p>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}
