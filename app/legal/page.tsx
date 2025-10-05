"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function LegalDocument() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll events to update active section and show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 500);

      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let currentSection = "";

      sections.forEach((section: Element) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY - 100;
        if (window.scrollY >= sectionTop) {
          currentSection = section.getAttribute('id') || "";
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Table of contents items
  const tocItems = [
    { id: "terms", title: "Terms & Conditions" },
    { id: "privacy", title: "Privacy Policy" },
    { id: "community", title: "Community Guidelines" },
    { id: "cookies", title: "Cookie Notice" },
    { id: "acknowledgement", title: "Acknowledgement" }
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-2 rounded-full bg-emerald-600 text-white shadow-md transition-opacity duration-300 hover:bg-emerald-700 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 text-center">
          Ments – Legal Documentation
        </h1>
        <p className="text-center text-gray-500 italic mb-8">
          Last updated: May 8, 2025
        </p>
        
        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <nav className="flex flex-wrap gap-2">
            {tocItems.map((item) => (
              <Link 
                key={item.id} 
                href={`#${item.id}`} 
                className={`px-4 py-2 rounded-md transition-colors border ${activeSection === item.id ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="text-gray-700 mb-12 p-6 bg-white rounded-xl border border-gray-200">
          <p className="mb-6">
            Welcome to Ments ("the App"), a mentor‑centric social network, in India ("we", "us", or "our"). 
            Below you will find the core legal documents required for publishing and operating the App on Google Play:
          </p>

          <div className="space-y-2 mb-8">
            {[
              { title: "Terms & Conditions of Use", subtitle: "(End‑User License Agreement)" },
              { title: "Privacy Policy", subtitle: "(including Data Safety disclosure for Google Play)" },
              { title: "Community Guidelines", subtitle: "" },
              { title: "Cookie & Tracking Technologies Notice", subtitle: "" },
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">•</span>
                <div>
                  <span className="font-semibold text-gray-900">{item.title}</span>
                  {item.subtitle && <span className="text-gray-500 text-sm"> {item.subtitle}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions Section */}
        <section id="terms" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">1</span>
            Terms & Conditions of Use
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>
          
          <div className="space-y-8">
            {[
              { title: "1.1 Acceptance of the Terms", content: "By downloading, installing, or using the App you agree to be bound by these Terms & Conditions (\"Terms\"). If you do not agree, you must not use the App." },
              { title: "1.2 Eligibility", content: "You must be at least 13 years old (or the minimum digital‑consent age in your jurisdiction) to create an account. If you are a minor, you confirm that your parent or legal guardian has reviewed and accepted these Terms on your behalf." },
              { title: "1.3 Account Registration & Security", content: "• Provide accurate information and keep it updated.\n• Keep your credentials confidential. You are responsible for all activity under your account.\n• We may suspend or terminate accounts that violate these Terms or applicable law." },
              { title: "1.4 User‑Generated Content & Conduct", content: "• You retain ownership of content you post but grant us a worldwide, non‑exclusive, royalty‑free licence to host, display, reproduce, distribute, and adapt it solely for operating, promoting, and improving the App.\n• Do not post content that is illegal, hateful, harassing, infringing, or otherwise prohibited in the Community Guidelines.\n• Mentorship interactions are peer‑to‑peer opinions; they are not professional, financial, medical, or legal advice. You remain solely responsible for decisions made based on such content." },
              { title: "1.5 Payments & Subscriptions", content: "• Premium features are billed through Google Play using the payment method on file. Prices include applicable taxes unless stated otherwise.\n• Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. Google Play's refund policies apply." },
              { title: "1.6 Intellectual‑Property Rights", content: "All proprietary content of the App (code, design, trademarks, and brand elements) is owned by or licensed to us and is protected by Indian and international IP laws. No rights are granted except as expressly stated." },
              { title: "1.7 Third‑Party Services", content: "The App integrates third‑party services (e.g. Supabase, AWS, Google OAuth). Your use of those services is governed by their respective terms." },
              { title: "1.8 Disclaimer of Warranties", content: "The App is provided \"as‑is\" and \"as‑available.\" We make no warranties, express or implied, regarding reliability, availability, or fitness for a particular purpose." },
              { title: "1.9 Limitation of Liability", content: "To the fullest extent permitted by law, our total liability for any claims arising out of or relating to the App will not exceed the greater of INR 5,000 or the amount you paid us in the past 12 months." },
              { title: "1.10 Indemnification", content: "You agree to indemnify and hold harmless Ments Labs, its directors, employees, and partners from any claims, damages, or expenses arising out of your breach of these Terms or misuse of the App." },
              { title: "1.11 Termination", content: "We may suspend or terminate your account at any time for violation of these Terms or applicable law. You may delete your account at any time in‑app or by emailing Support@ments.app." },
              { title: "1.12 Governing Law & Dispute Resolution", content: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India. Consumers in the EU/UK retain mandatory protections under local law." },
              { title: "1.13 Changes to the Terms", content: "We may update these Terms from time to time. Material changes will be notified in‑app or via email at least 7 days before they take effect." },
              { title: "1.14 Contact", content: "Questions about these Terms? Email us at Support@ments.app." },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">{item.title}</h3>
                <div className="whitespace-pre-line">
                  <p className="text-gray-700">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section id="privacy" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">2</span>
            Privacy Policy
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <div className="space-y-8">
            {[
              { title: "2.1 Scope & Purpose", content: "This Privacy Policy explains what personal data we collect, how we use it, and your choices. It applies to all users of the App and ments.app." },
              { title: "2.2 Data We Collect", content: "We collect and process the following categories of personal data:\n\n• Account Data: name, email, avatar, age range, location (city & country)\n• Profile Content: bio, mentorship tags, posts, messages\n• Usage Data: log files, device ID, in‑app actions, crash reports\n• Device Info: OS, model, language, timezone, IP address" },
              { title: "2.3 How We Use Data", content: "• Operate and maintain the App\n• Personalise your feed and mentor matches\n• Communicate with you (service messages & marketing with consent)\n• Enforce our Terms & policies\n• Comply with legal obligations" },
              { title: "2.4 Legal Bases (GDPR)", content: "We rely on contractual necessity, legitimate interests, consent, and legal obligation as appropriate." },
              { title: "2.5 Device Permissions", content: "• Camera: We request camera access to allow you to take photos for your profile picture, project logos, and media uploads. This permission is only used when you explicitly choose to take a photo within the app.\n• Storage: We request storage access to allow you to select existing photos from your device for your profile picture, project logos, and media uploads." },
              { title: "2.6 Sharing & Disclosure", content: "We never sell your personal data. We share it only with:\n\n1. Service providers (cloud hosting, analytics, payment processors) under NDA\n2. Legal authorities when required by law\n3. Other users but only information you choose to make public (e.g., posts, profile)" },
              { title: "2.7 International Transfers", content: "Data may be processed outside your country, including in the US, EU, and India. We use appropriate safeguards such as Standard Contractual Clauses." },
              { title: "2.8 Data Retention", content: "We keep data as long as your account is active or as needed for the purposes listed. You may request deletion (\"right to erasure\") at any time." },
              { title: "2.9 Your Rights", content: "Depending on your jurisdiction you may have rights to access, correct, delete, restrict, or port your data, and to object to processing or withdraw consent. Exercise rights by emailing Support@ments.app." },
              { title: "2.10 Security", content: "We use encryption in transit (TLS 1.3), at‑rest encryption for sensitive fields, role‑based access control, and routine security audits. No system is 100% secure; please report vulnerabilities to Support@ments.app." },
              { title: "2.11 Children's Privacy", content: "The App is not directed to children under 13. If we learn we have collected personal data from a child without parental consent, we will delete it." },
              { title: "2.12 Changes to This Policy", content: "If we make material changes, we will notify you at least 7 days before they take effect." },
              { title: "2.13 Contact", content: "Privacy questions? Email Support@ments.app or write to: Data Protection Officer, Ments Labs Pvt. Ltd., 91springboard, Andheri East, Mumbai 400069, India." },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">{item.title}</h3>
                <div className="whitespace-pre-line">
                  <p className="text-gray-700">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Guidelines Section */}
        <section id="community" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">3</span>
            Community Guidelines
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <p className="text-gray-700 mb-6">A brief code of conduct that complements the Terms:</p>

          <div className="space-y-4">
            {[
              { title: "Be respectful", content: "Harassment, hate speech, or discrimination is forbidden." },
              { title: "No illegal content", content: "" },
              { title: "No spam or self‑promotion", content: "outside designated areas." },
              { title: "Protect privacy", content: "Share only what you own or have permission to share." },
              { title: "Report violations", content: "in‑app. Repeated breaches may lead to suspension." },
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">•</span>
                <div>
                  <span className="font-semibold text-gray-900">{item.title}</span>
                  {item.content && <span className="text-gray-600"> — {item.content}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cookie Notice Section */}
        <section id="cookies" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">4</span>
            Cookie & Tracking Technologies Notice
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <p className="text-gray-700 mb-6">We and our partners use local storage and similar technologies to:</p>

          <div className="space-y-2 mb-6">
            {[
              "Keep you signed in",
              "Remember preferences",
              "Measure engagement & fix bugs"
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">•</span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-700">You can clear or block cookies in your browser settings, but some features may not work properly.</p>
        </section>

        {/* Acknowledgement Section */}
        <section id="acknowledgement" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">5</span>
            Acknowledgement
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <p className="text-gray-700">By using Ments you acknowledge you have read and understood all of the above documents.</p>
        </section>
      </div>
      </div>
    </>
  );
}