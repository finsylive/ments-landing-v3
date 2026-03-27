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
    { id: "child-safety", title: "Child Safety Policy" },
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
          Ments &ndash; Legal Documentation
        </h1>
        <p className="text-center text-gray-500 italic mb-8">
          Last updated: March 27, 2026
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
            Welcome to Ments (&ldquo;the App&rdquo;), a professional networking and opportunities platform based in India (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
            Below you will find the core legal documents required for publishing and operating the App on Google Play and the Apple App Store:
          </p>

          <div className="space-y-2 mb-8">
            {[
              { title: "Terms & Conditions of Use", subtitle: "" },
              { title: "Privacy Policy", subtitle: "(including Data Safety disclosure)" },
              { title: "Community Guidelines", subtitle: "" },
              { title: "Child Safety Policy", subtitle: "" },
              { title: "Cookie & Tracking Technologies Notice", subtitle: "" },
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">&bull;</span>
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
          <p className="text-sm text-gray-500 mb-2">Last Updated: March 27, 2026</p>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <div className="space-y-8">
            {[
              { title: "1.1 Acceptance of the Terms", content: "By downloading, installing, or using the App you agree to be bound by these Terms & Conditions (\"Terms\"). If you do not agree, you must not use the App." },
              { title: "1.2 Eligibility", content: "You must be at least 16 years old to create an account. If you are between 16 and 18, you confirm that your parent or legal guardian has reviewed and accepted these Terms on your behalf." },
              { title: "1.3 Account Registration & Security", content: "\u2022 Provide accurate information and keep it updated.\n\u2022 Keep your credentials confidential. You are responsible for all activity under your account.\n\u2022 You may not create more than one account, use another person's account, transfer your account, or create an account using false information.\n\u2022 We may suspend or terminate accounts that violate these Terms or applicable law." },
              { title: "1.4 Description of Service", content: "Ments is a professional networking and opportunities platform that enables users to:\n\n\u2022 Create and maintain professional profiles with experience, education, skills, and portfolios\n\u2022 Browse and apply for jobs, gigs, and freelance opportunities\n\u2022 Discover and connect with startups, organizations, and professionals\n\u2022 Showcase projects and professional work\n\u2022 Communicate with other professionals via direct messaging\n\u2022 Participate in events, competitions, and professional communities\n\u2022 Upload and parse resumes for profile auto-fill using AI\n\u2022 Receive AI-powered job matching and interview preparation\n\nWe reserve the right to modify, suspend, or discontinue any part of the App at any time, with or without notice." },
              { title: "1.5 User-Generated Content & Conduct", content: "\u2022 You retain ownership of content you post but grant us a worldwide, non-exclusive, royalty-free licence to host, display, reproduce, distribute, and adapt it solely for operating, promoting, and improving the App. This licence ends when you delete your content or account, except where retention is required by law.\n\u2022 Do not post content that is illegal, hateful, harassing, infringing, or otherwise prohibited in the Community Guidelines.\n\u2022 Professional interactions on the platform are peer-to-peer. They do not constitute professional, financial, medical, or legal advice. You remain solely responsible for decisions made based on such content.\n\u2022 Do not post fraudulent or misleading professional credentials, work history, or qualifications." },
              { title: "1.6 Jobs, Gigs & Applications", content: "Opportunity Listings: Employers, facilitators, and organizations may post opportunities on the App. We do not verify the accuracy, legitimacy, or legality of listings and are not responsible for their content.\n\nApplications: When you apply for a job or gig, the following information may be shared with the employer or facilitator:\n\u2022 Your profile information (name, skills, experience, education)\n\u2022 AI-generated match score and profile summary\n\u2022 Your interview responses and scores\n\u2022 Resume information\n\nYou acknowledge that submitting an application shares this data with the listing party and that we are not responsible for how they use it.\n\nApplication Integrity: During timed assessments and interviews within the App, the App may monitor application activity (such as tab switches and time spent) to maintain assessment integrity. This activity data may be visible to employers.\n\nNo Employment Guarantee: We are a platform that connects professionals with opportunities. We do not guarantee employment, compensation, or any specific outcome. We are not a party to any employment or contracting relationship between users." },
              { title: "1.7 AI-Powered Features", content: "The App uses artificial intelligence for resume parsing, job matching, interview question generation, profile summaries, intelligent search, and voice conversations. AI-generated content is provided for informational and assistive purposes only.\n\nWhile we strive for accuracy, AI-generated content (including match scores, profile summaries, parsed resume data, and interview questions) may contain errors or inaccuracies. You are responsible for reviewing and verifying all AI-generated content before relying on it.\n\nBy using AI features, you consent to the processing of your data (including resume text, profile information, search queries, and voice audio) by our AI service providers for the purpose of delivering these features. See the Privacy Policy below for details." },
              { title: "1.8 Messaging & Communication", content: "The App provides direct messaging between users. You agree to use messaging only for legitimate professional communication. You agree not to send spam, bulk messages, or unsolicited promotional content, harass other users, or share another user's private messages without their consent.\n\nWhile we do not routinely monitor the content of private messages, we reserve the right to review messages when we receive reports of abuse, harassment, or violations of these Terms." },
              { title: "1.9 Payments & Subscriptions", content: "Premium features, if available, are billed through Google Play or the Apple App Store using the payment method on file. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. The respective store's refund policies apply." },
              { title: "1.10 Intellectual-Property Rights", content: "All proprietary content of the App (code, design, trademarks, and brand elements) is owned by or licensed to us and is protected by Indian and international IP laws. No rights are granted except as expressly stated." },
              { title: "1.11 Third-Party Services", content: "The App integrates third-party services (listed in the Privacy Policy). Your use of those services is governed by their respective terms." },
              { title: "1.12 Disclaimer of Warranties", content: "THE APP IS PROVIDED \"AS-IS\" AND \"AS-AVAILABLE.\" WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING RELIABILITY, AVAILABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT AI-GENERATED CONTENT WILL BE ACCURATE." },
              { title: "1.13 Limitation of Liability", content: "TO THE FULLEST EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THE APP WILL NOT EXCEED THE GREATER OF INR 5,000 OR THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS. WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES." },
              { title: "1.14 Indemnification", content: "You agree to indemnify and hold harmless Ments, its directors, employees, and partners from any claims, damages, or expenses arising out of your breach of these Terms, your User Content, misuse of the App, or misrepresentation of your professional qualifications." },
              { title: "1.15 Account Termination", content: "By You: You may delete your account at any time in-app or by emailing support@ments.app. Your profile and content will be removed from public view, and your data will be deleted in accordance with our Privacy Policy.\n\nBy Us: We may suspend or terminate your account at any time for violation of these Terms, fraudulent or illegal activity, extended inactivity, or requests from law enforcement.\n\nUpon termination, your right to use the App immediately ceases. Sections that by their nature should survive termination shall survive, including Intellectual Property, Disclaimers, Limitation of Liability, and Indemnification." },
              { title: "1.16 Governing Law & Dispute Resolution", content: "These Terms are governed by the laws of India. Any disputes shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be subject to the exclusive jurisdiction of the courts in Ghaziabad, Uttar Pradesh, India. You agree that dispute resolution will be conducted on an individual basis, not as a class action. Consumers in the EU/UK retain mandatory protections under local law." },
              { title: "1.17 Apple & Google Platform Terms", content: "Apple App Store: If you download the App from the Apple App Store, you acknowledge that: these Terms are between you and Ments, not Apple Inc.; Apple has no obligation to provide maintenance or support; Apple is not responsible for addressing claims relating to the App; in the event of any third-party IP claim, Ments is responsible for investigation and resolution; Apple and its subsidiaries are third-party beneficiaries of these Terms.\n\nGoogle Play Store: If you download the App from Google Play, Google LLC's terms of service also apply." },
              { title: "1.18 Changes to the Terms", content: "We may update these Terms from time to time. Material changes will be notified in-app or via email at least 7 days before they take effect. Your continued use after changes constitutes acceptance." },
              { title: "1.19 Contact", content: "Questions about these Terms? Email us at support@ments.app." },
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
          <p className="text-sm text-gray-500 mb-2">Last Updated: March 27, 2026</p>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.1 Scope & Purpose</h3>
              <p className="text-gray-700">This Privacy Policy explains what personal data we collect, how we use it, and your choices. It applies to all users of the App and ments.app.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.2 Data We Collect</h3>

              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Information You Provide Directly</h4>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Category</th>
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Data Points</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Account & Identity</td>
                      <td className="p-3">Full name, email address, username, password (hashed), profile photo, banner image</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Professional Profile</td>
                      <td className="p-3">Tagline, bio, current city, user type, skills, &ldquo;looking for&rdquo; interests, social links (LinkedIn, portfolio URLs)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Experience & Education</td>
                      <td className="p-3">Company name, position title, dates, description; institution, degree, field of study, dates</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Resume</td>
                      <td className="p-3">Uploaded PDF files, extracted text content (processed by AI for auto-fill)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Projects & Portfolios</td>
                      <td className="p-3">Project title, description, media (images/slides), links, portfolio views</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Startup Profiles</td>
                      <td className="p-3">Brand name, mission, funding details, founder information</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Content</td>
                      <td className="p-3">Text posts, replies, images, videos, poll questions and responses</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Messages</td>
                      <td className="p-3">Direct message content, message reactions, conversation metadata (participants, timestamps, read status)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Job Applications</td>
                      <td className="p-3">Applications submitted, answers to AI interview questions, match scores, profile summaries, application timestamps</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Organization & Events</td>
                      <td className="p-3">Organization memberships, event participation, competition entries</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Information Collected Automatically</h4>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Category</th>
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Data Points</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Device & Technical</td>
                      <td className="p-3">Device type, operating system, app version, device platform (iOS/Android)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Push Notification Tokens</td>
                      <td className="p-3">Firebase Cloud Messaging (FCM) token, stored per device</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Usage Data</td>
                      <td className="p-3">Content viewed, liked, shared, or interacted with; time spent viewing content; navigation patterns; session identifiers</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-600 text-sm italic mb-4">Note: We do not collect precise GPS location data. City information is provided voluntarily by users as a text field.</p>

              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Information From Third-Party Services</h4>
              <p className="text-gray-700">When you sign in using Google, we receive your name, email address, and profile photo from Google, subject to your Google account privacy settings.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.3 How We Use Data</h3>
              <div className="whitespace-pre-line">
                <p className="text-gray-700">{"\u2022 Operate the App \u2014 create and maintain your account, display your profile, facilitate messaging, enable job applications, process your content\n\u2022 Personalization \u2014 personalize your content feed, calculate job match scores, surface relevant opportunities\n\u2022 AI Features \u2014 parse resumes to auto-fill profile fields, generate interview questions, provide intelligent search, power voice conversations\n\u2022 Communication \u2014 send push notifications for messages, replies, mentions, and application updates; deliver in-app notifications\n\u2022 Safety & Integrity \u2014 monitor application integrity during timed assessments, enforce Terms and Community Guidelines, investigate abuse reports\n\u2022 Improvement \u2014 understand usage patterns to improve features, diagnose technical issues, optimize performance\n\u2022 Legal Compliance \u2014 comply with applicable laws and regulations"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.4 Legal Bases (GDPR)</h3>
              <p className="text-gray-700">We rely on contractual necessity (providing the service), legitimate interests (improving the App, preventing abuse), consent (where applicable, such as marketing), and legal obligation as appropriate.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.5 Third-Party Services & Data Sharing</h3>
              <p className="text-gray-700 mb-4">We never sell your personal data. We share it only with the following:</p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Service</th>
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Purpose</th>
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Data Shared</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Supabase</td>
                      <td className="p-3">Backend infrastructure, authentication, database, file storage, real-time messaging</td>
                      <td className="p-3">Account data, content, messages, files</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Firebase (Google)</td>
                      <td className="p-3">Push notifications</td>
                      <td className="p-3">Device tokens, notification payloads</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Google Sign-In</td>
                      <td className="p-3">Authentication</td>
                      <td className="p-3">OAuth tokens (email, name, profile photo)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Groq</td>
                      <td className="p-3">AI-powered resume parsing, intelligent search, interview question generation, job matching</td>
                      <td className="p-3">Resume text, search queries, profile data for matching</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">ElevenLabs</td>
                      <td className="p-3">Voice agent conversations</td>
                      <td className="p-3">Voice audio during active voice sessions only</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">AWS S3</td>
                      <td className="p-3">File storage (images, videos, resumes)</td>
                      <td className="p-3">Uploaded media files</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 mb-4">All service providers process data on our behalf under appropriate data processing agreements.</p>
              <p className="text-gray-700 mb-4"><strong>With Other Users:</strong> Your profile information is visible to other users based on your visibility settings. When you apply for a job or gig, the employer can see your application data including match score, profile summary, interview responses, and resume information.</p>
              <p className="text-gray-700 mb-4"><strong>Legal Authorities:</strong> We disclose data when required by law, court order, or to protect the safety of users or the public.</p>
              <p className="text-gray-700"><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or asset sale, your data may be transferred. We will notify you before your data becomes subject to a different privacy policy.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.6 Device Permissions</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Permission</th>
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">Purpose</th>
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-900">When Requested</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Camera</td>
                      <td className="p-3">Take photos, record videos, scan QR codes at events</td>
                      <td className="p-3">When you create a post, update your profile photo, or scan a QR code</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Microphone</td>
                      <td className="p-3">Voice agent conversations</td>
                      <td className="p-3">When you initiate a voice agent session</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Photo Library</td>
                      <td className="p-3">Select existing photos and videos for upload</td>
                      <td className="p-3">When you create a post or update your profile photo</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Push Notifications</td>
                      <td className="p-3">Receive alerts for messages, replies, mentions, and application updates</td>
                      <td className="p-3">On first app launch (you can decline or change later in device settings)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700">All permissions are requested at the time of use and can be revoked at any time through your device settings.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.7 Data Retention</h3>
              <div className="whitespace-pre-line">
                <p className="text-gray-700">{"\u2022 Account data: Retained for as long as your account is active.\n\u2022 Content you create: Retained until you delete it or your account is deleted.\n\u2022 Messages: Retained until the conversation is deleted or account deletion is requested. Messages may be anonymized rather than deleted to preserve conversation integrity for other participants.\n\u2022 Application data: Retained for the duration of the application process and a reasonable period afterward for record-keeping.\n\u2022 Usage and interaction data: Retained for up to 12 months, then aggregated or deleted.\n\u2022 Push notification tokens: Updated on each app session; old tokens are overwritten.\n\nYou may request deletion of all your data at any time (see Section 2.9)."}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.8 International Transfers</h3>
              <p className="text-gray-700">Data may be processed outside your country, including in the US, EU, and India. We use appropriate safeguards such as Standard Contractual Clauses where required.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.9 Your Rights</h3>
              <p className="text-gray-700 mb-4">Depending on your jurisdiction you may have rights to access, correct, delete, restrict, or port your data, and to object to processing or withdraw consent.</p>
              <p className="text-gray-700 mb-4"><strong>Account & Data Deletion:</strong> You may request deletion of your account and all associated data by emailing support@ments.app. Upon receiving a verified request: your profile, posts, and content will be removed within 30 days; some data may be retained for legal compliance for up to 90 days.</p>
              <p className="text-gray-700 mb-4"><strong>Visibility Controls:</strong> You can control the visibility of profile sections (projects, startups) through the profile edit screen.</p>
              <p className="text-gray-700 mb-4"><strong>Notification Preferences:</strong> You can manage push notification preferences through your device settings.</p>
              <p className="text-gray-700 mb-4"><strong>California Residents (CCPA):</strong> You have the right to know what personal information we collect, request deletion, and opt out of the sale of personal information (we do not sell personal information).</p>
              <p className="text-gray-700 mb-4"><strong>EEA/UK/Swiss Residents (GDPR):</strong> You have additional rights including data portability and the right to lodge a complaint with a supervisory authority.</p>
              <p className="text-gray-700">To exercise any rights, email support@ments.app.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.10 Security</h3>
              <p className="text-gray-700">We use encryption in transit (TLS), row-level security (RLS) policies on our database, authentication via secure JWT tokens, and secure credential storage via environment variables. No system is 100% secure; please report vulnerabilities to official@ments.app.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.11 Children&apos;s Privacy</h3>
              <p className="text-gray-700">The App is not directed to anyone under 16. We do not knowingly collect personal data from anyone under 16. If we learn we have collected data from a child under 16 without parental consent, we will delete it promptly. If you believe a child under 16 has provided us with personal information, contact support@ments.app.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.12 Changes to This Policy</h3>
              <p className="text-gray-700">If we make material changes, we will notify you in-app or via email at least 7 days before they take effect.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">2.13 Contact</h3>
              <p className="text-gray-700">Privacy questions? Email support@ments.app or write to:</p>
              <p className="text-gray-700 mt-2">Data Protection Officer<br />Ments<br />Nirmaan, Sudha Shankar Building, IIT Madras, Chennai, Tamil Nadu, India</p>
            </div>
          </div>
        </section>

        {/* Community Guidelines Section */}
        <section id="community" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">3</span>
            Community Guidelines
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <p className="text-gray-700 mb-6">These guidelines complement the Terms and apply to all users:</p>

          <div className="space-y-4">
            {[
              { title: "Be respectful", content: "Harassment, hate speech, bullying, threats, or discrimination of any kind is forbidden." },
              { title: "Be honest", content: "Do not misrepresent your identity, credentials, or professional qualifications." },
              { title: "No illegal content", content: "Do not post content that violates any applicable law." },
              { title: "No spam or self-promotion", content: "outside designated areas." },
              { title: "Protect privacy", content: "Share only what you own or have permission to share. Do not share another user's private messages or personal information without consent." },
              { title: "No exploitation", content: "Content that exploits, abuses, or endangers any person, especially minors, is strictly prohibited." },
              { title: "Professional conduct", content: "This is a professional platform. Keep interactions professional and constructive." },
              { title: "Report violations", content: "using the in-app reporting tools. Repeated or severe breaches will lead to account suspension or permanent termination." },
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">&bull;</span>
                <div>
                  <span className="font-semibold text-gray-900">{item.title}</span>
                  {item.content && <span className="text-gray-600"> &mdash; {item.content}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Child Safety Policy Section */}
        <section id="child-safety" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">4</span>
            Child Safety Policy (CSAE)
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">Zero Tolerance Policy</h3>
              <p className="text-gray-700">Ments has a zero-tolerance policy for any content, behavior, or activity that exploits, abuses, or endangers minors. Any content that sexualizes minors or promotes, depicts, or suggests child sexual abuse in any form is strictly prohibited and will be immediately removed. Accounts found sharing such content will be permanently banned and reported to relevant authorities.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">Prohibited Content and Behavior</h3>
              <p className="text-gray-700 mb-3">The following are expressly forbidden:</p>
              <div className="space-y-2">
                {[
                  "Content depicting minors in a sexual or suggestive context",
                  "Child sexual abuse material (CSAM) in any form",
                  "Content that sexualizes or romanticizes relationships with minors",
                  "Content that promotes, encourages, or normalizes child sexual exploitation",
                  "Attempts to solicit, groom, or exploit minors",
                  "Sharing personal information of minors without proper consent",
                  "Any other content that puts minors at risk of sexual exploitation or abuse",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-emerald-600 font-bold mr-2">&bull;</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">Age Verification</h3>
              <p className="text-gray-700">Our platform requires users to be at least 16 years old to create an account. We implement age-appropriate design features and verification processes. For users between 16 and 18, additional safeguards are in place to protect their privacy and safety.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">Content Moderation</h3>
              <p className="text-gray-700 mb-3">We employ a multi-layered approach including:</p>
              <div className="space-y-2">
                {[
                  "Automated detection systems to identify potentially harmful content",
                  "Human review of flagged content",
                  "Community reporting tools for users to quickly report concerning content or behavior",
                  "Regular audits of moderation systems",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-emerald-600 font-bold mr-2">&bull;</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">Reporting Mechanisms</h3>
              <p className="text-gray-700">We provide in-app reporting tools that allow users to report any content or behavior that may violate this policy. Reports are treated with high priority and reviewed within 24 hours. For urgent CSAE concerns, contact safeguarding@ments.app for expedited review.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">Collaboration with Law Enforcement</h3>
              <p className="text-gray-700">We maintain full cooperation with law enforcement agencies in investigations related to child sexual abuse and exploitation. We promptly report instances of CSAM to the National Center for Missing & Exploited Children (NCMEC) and appropriate authorities in other jurisdictions.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 bg-gray-50 p-2 pl-4 rounded-md border-l-4 border-emerald-500">Resources and Support</h3>
              <p className="text-gray-700 mb-3">If you or someone you know has been affected by child sexual abuse or exploitation, please contact local law enforcement immediately. Additional resources:</p>
              <div className="space-y-2">
                {[
                  "Childhelp National Child Abuse Hotline (US): 1-800-422-4453",
                  "NCMEC CyberTipline (US): https://report.cybertip.org/",
                  "Internet Watch Foundation (UK): https://report.iwf.org.uk/",
                  "Child Welfare Committee (India): Contact details available at your local district office",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-emerald-600 font-bold mr-2">&bull;</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Notice Section */}
        <section id="cookies" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">5</span>
            Cookie & Tracking Technologies Notice
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <p className="text-gray-700 mb-6">We and our partners use local storage and similar technologies to:</p>

          <div className="space-y-2 mb-6">
            {[
              "Keep you signed in",
              "Remember preferences",
              "Measure engagement and fix bugs",
              "Personalize your experience"
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">&bull;</span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-700">You can clear or block cookies in your browser settings, but some features may not work properly.</p>
        </section>

        {/* Acknowledgement Section */}
        <section id="acknowledgement" className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl border border-emerald-200">6</span>
            Acknowledgement
          </h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-8"></div>

          <p className="text-gray-700">By using Ments you acknowledge you have read and understood all of the above documents.</p>
        </section>

        {/* Contact Information */}
        <section className="mb-16 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="w-full h-px bg-gray-200 rounded-full mb-6"></div>
          <div className="space-y-2 text-gray-700">
            <p><strong>General support:</strong> support@ments.app</p>
            <p><strong>Legal & official inquiries:</strong> official@ments.app</p>
            <p><strong>Child safety concerns:</strong> safeguarding@ments.app</p>
            <p><strong>Website:</strong> https://www.ments.app</p>
          </div>
        </section>
      </div>
      </div>
    </>
  );
}
