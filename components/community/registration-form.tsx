"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { submitCommunityRegistration } from "@/lib/supabase";

type Role = "founder" | "investor" | "mentor" | "";

export function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    linkedin: "",
    // Founder fields
    startupStage: "",
    biggestChallenge: "",
    preferredSupport: "",
    comfortSharing: "3",
    connectionMode: "",
    mentorshipType: "",
    founderFeatureSuggestion: "",
    // Investor/Mentor fields
    focusAreas: "",
    preferredStartupStage: "",
    approachFrequency: "",
    interactionMode: "",
    interestIn: "",
    investorFeatureSuggestion: "",
    // Final
    uniqueFeature: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const registrationData = {
        full_name: formData.fullName,
        email: formData.email,
        role: role as 'founder' | 'investor' | 'mentor',
        organization: formData.organization || undefined,
        linkedin_url: formData.linkedin,
        unique_feature_suggestion: formData.uniqueFeature,

        // Founder specific fields
        ...(role === 'founder' && {
          startup_stage: formData.startupStage as any,
          biggest_challenge: formData.biggestChallenge as any,
          preferred_support: formData.preferredSupport as any,
          comfort_sharing_feedback: parseInt(formData.comfortSharing),
          connection_mode: formData.connectionMode as any,
          mentorship_type: formData.mentorshipType as any,
          founder_feature_suggestion: formData.founderFeatureSuggestion || undefined,
        }),

        // Investor/Mentor specific fields
        ...((role === 'investor' || role === 'mentor') && {
          focus_areas: formData.focusAreas,
          preferred_startup_stage: formData.preferredStartupStage as any,
          approach_frequency: formData.approachFrequency as any,
          interaction_mode: formData.interactionMode as any,
          interest_in: formData.interestIn as any,
          investor_feature_suggestion: formData.investorFeatureSuggestion || undefined,
        }),
      };

      // Submit to Supabase
      await submitCommunityRegistration(registrationData);

      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting registration:", err);
      setError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-4"
      >
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You for Joining!
        </h3>
        <p className="text-lg text-gray-700 mb-8">
          We'll review your application and get back to you soon.
        </p>
        <Button
          size="lg"
          onClick={() => window.open("https://chat.whatsapp.com/L8tFk7w8CpN1kDUIbCAr7m", "_blank")}
          className="bg-green-600 hover:bg-green-700"
        >
          Join our WhatsApp Community
        </Button>
      </motion.div>
    );
  }

  return (
    <section
      id="registration-form"
      className="py-16 md:py-24 bg-white scroll-mt-20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Be Part of the Ments Movement{" "}
            <Rocket className="inline-block w-10 h-10 text-green-600" />
          </h2>
          <p className="text-lg text-gray-700">
            Fill out the form below to join our community
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-2xl shadow-lg ring-1 ring-neutral-200"
        >
          {/* Basic Details */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
              Basic Details
            </h3>

            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email ID *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select your role</option>
                <option value="founder">Founder</option>
                <option value="investor">Investor</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>

            <div>
              <Label htmlFor="organization">Organization / Startup Name</Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn URL *</Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                required
                value={formData.linkedin}
                onChange={handleChange}
                className="mt-1"
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
          </div>

          {/* Conditional Fields for Founders */}
          {role === "founder" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2 mt-8">
                Founder Details
              </h3>

              <div>
                <Label htmlFor="startupStage">Startup Stage *</Label>
                <select
                  id="startupStage"
                  name="startupStage"
                  required
                  value={formData.startupStage}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select stage</option>
                  <option value="idea">Idea</option>
                  <option value="early-traction">Early Traction</option>
                  <option value="scaling">Scaling</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>

              <div>
                <Label htmlFor="biggestChallenge">Biggest Challenge *</Label>
                <select
                  id="biggestChallenge"
                  name="biggestChallenge"
                  required
                  value={formData.biggestChallenge}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select challenge</option>
                  <option value="team">Team</option>
                  <option value="funding">Funding</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="product">Product</option>
                </select>
              </div>

              <div>
                <Label htmlFor="preferredSupport">Preferred Support Type *</Label>
                <select
                  id="preferredSupport"
                  name="preferredSupport"
                  required
                  value={formData.preferredSupport}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select support type</option>
                  <option value="community">Community</option>
                  <option value="platform">Platform</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <Label htmlFor="comfortSharing">
                  Comfort Sharing Feedback Publicly (1-5) *
                </Label>
                <Input
                  id="comfortSharing"
                  name="comfortSharing"
                  type="range"
                  min="1"
                  max="5"
                  required
                  value={formData.comfortSharing}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div className="text-center text-sm text-gray-600 mt-1">
                  {formData.comfortSharing}/5
                </div>
              </div>

              <div>
                <Label htmlFor="connectionMode">Preferred Connection Mode *</Label>
                <select
                  id="connectionMode"
                  name="connectionMode"
                  required
                  value={formData.connectionMode}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select mode</option>
                  <option value="dm">DM</option>
                  <option value="matchmaking">Matchmaking</option>
                  <option value="events">Events</option>
                </select>
              </div>

              <div>
                <Label htmlFor="mentorshipType">Type of Mentorship Needed *</Label>
                <select
                  id="mentorshipType"
                  name="mentorshipType"
                  required
                  value={formData.mentorshipType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select mentorship type</option>
                  <option value="founder">Founder</option>
                  <option value="industry">Industry</option>
                  <option value="technical">Technical</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <Label htmlFor="founderFeatureSuggestion">
                  What feature would make this platform most valuable to you?
                </Label>
                <Textarea
                  id="founderFeatureSuggestion"
                  name="founderFeatureSuggestion"
                  value={formData.founderFeatureSuggestion}
                  onChange={handleChange}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* Conditional Fields for Investors/Mentors */}
          {(role === "investor" || role === "mentor") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2 mt-8">
                {role === "investor" ? "Investor" : "Mentor"} Details
              </h3>

              <div>
                <Label htmlFor="focusAreas">Focus Areas *</Label>
                <Input
                  id="focusAreas"
                  name="focusAreas"
                  required
                  value={formData.focusAreas}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="e.g., SaaS, FinTech, HealthTech"
                />
              </div>

              <div>
                <Label htmlFor="preferredStartupStage">Preferred Startup Stage *</Label>
                <select
                  id="preferredStartupStage"
                  name="preferredStartupStage"
                  required
                  value={formData.preferredStartupStage}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select stage</option>
                  <option value="idea">Idea</option>
                  <option value="mvp">MVP</option>
                  <option value="scaling">Scaling</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>

              <div>
                <Label htmlFor="approachFrequency">Frequency of Startup Approaches *</Label>
                <select
                  id="approachFrequency"
                  name="approachFrequency"
                  required
                  value={formData.approachFrequency}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select frequency</option>
                  <option value="rarely">Rarely</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="often">Often</option>
                </select>
              </div>

              <div>
                <Label htmlFor="interactionMode">Preferred Interaction Mode *</Label>
                <select
                  id="interactionMode"
                  name="interactionMode"
                  required
                  value={formData.interactionMode}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select mode</option>
                  <option value="open-dms">Open DMs</option>
                  <option value="filtered">Filtered</option>
                  <option value="platform-only">Platform Only</option>
                </select>
              </div>

              <div>
                <Label htmlFor="interestIn">Interest In *</Label>
                <select
                  id="interestIn"
                  name="interestIn"
                  required
                  value={formData.interestIn}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select interest</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="investment">Investment</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <Label htmlFor="investorFeatureSuggestion">
                  What would make this platform stand out for you?
                </Label>
                <Textarea
                  id="investorFeatureSuggestion"
                  name="investorFeatureSuggestion"
                  value={formData.investorFeatureSuggestion}
                  onChange={handleChange}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* Final Input - Always shown when role is selected */}
          {role && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2 mt-8">
                Final Thoughts
              </h3>

              <div>
                <Label htmlFor="uniqueFeature">
                  If you could suggest one feature that would make this community truly different, what would it be? *
                </Label>
                <Textarea
                  id="uniqueFeature"
                  name="uniqueFeature"
                  required
                  value={formData.uniqueFeature}
                  onChange={handleChange}
                  className="mt-1"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Join Now"
                )}
              </Button>
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
