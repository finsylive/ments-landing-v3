"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Link from "next/link";

export default function CSAEPolicy() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll events to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-2 rounded-full bg-emerald-500 text-white shadow-lg transition-opacity duration-300 hover:bg-emerald-600 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-emerald-300 to-sky-400 bg-clip-text text-transparent mb-4 text-center">
          Ments – Child Safety Policy
        </h1>
        <p className="text-center text-gray-400 italic mb-8">
          Last updated: May 10, 2025
        </p>
        
        <div className="text-white/80 mb-12 p-6 bg-white/5 rounded-xl border border-white/10">
          <p className="mb-6">
            At Ments ("the App"), we are committed to creating a safe environment for all users, with a particular focus on 
            protecting children from sexual abuse and exploitation. This policy outlines our standards, procedures, and commitment 
            to combating child sexual abuse and exploitation (CSAE) in all forms.
          </p>
        </div>

        {/* Main Policy Section */}
        <section className="mb-16 p-6 bg-white/5 rounded-xl border border-white/10 shadow-lg scroll-mt-24">
          <h2 className="text-3xl font-bold text-emerald-300 mb-6">
            Standards Against Child Sexual Abuse and Exploitation (CSAE)
          </h2>
          <div className="w-full h-1 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full mb-8"></div>
          
          <div className="space-y-8">
            {[
              { 
                title: "Zero Tolerance Policy", 
                content: "Ments has a zero-tolerance policy for any content, behavior, or activity that exploits, abuses, or endangers minors. Any content that sexualizes minors or promotes, depicts, or suggests child sexual abuse in any form is strictly prohibited and will be immediately removed. Accounts found to be sharing such content will be permanently banned and reported to relevant authorities." 
              },
              { 
                title: "Prohibited Content and Behavior", 
                content: "The following are expressly forbidden on our platform:\n\n• Content depicting minors in a sexual or suggestive context\n• Child sexual abuse material (CSAM) in any form\n• Content that sexualizes or romanticizes relationships with minors\n• Content that promotes, encourages, or normalizes child sexual exploitation\n• Attempts to solicit, groom, or exploit minors\n• Sharing of personal information of minors without proper consent\n• Any other content that puts minors at risk of sexual exploitation or abuse" 
              },
              { 
                title: "Age Verification", 
                content: "Our platform requires users to be at least 13 years old to create an account. We implement age-appropriate design features and age verification processes to help ensure that users are of appropriate age. For users between 13-18 years old, we have additional safeguards in place to protect their privacy and safety." 
              },
              { 
                title: "Content Moderation", 
                content: "We employ a multi-layered approach to content moderation including:\n\n• Automated detection systems using machine learning to identify potentially harmful content\n• Human moderators who review flagged content\n• Community reporting tools that allow users to quickly report concerning content or behavior\n• Regular audits of our moderation systems to identify areas for improvement" 
              },
              { 
                title: "Reporting Mechanisms", 
                content: "We provide easy-to-use reporting tools within our application that allow users to report any content or behavior that may violate our CSAE policy. Reports are treated with high priority and are typically reviewed within 24 hours. For urgent CSAE concerns, users can contact us directly at safeguarding@ments.app for expedited review." 
              },
              { 
                title: "Collaboration with Law Enforcement", 
                content: "We maintain a policy of full cooperation with law enforcement agencies in investigations related to child sexual abuse and exploitation. We promptly report instances of CSAM to the National Center for Missing & Exploited Children (NCMEC) in the United States and to appropriate authorities in other jurisdictions." 
              },
              { 
                title: "User Education", 
                content: "We provide educational resources about online safety for all users, with special emphasis on resources for younger users, parents, and guardians. These resources include in-app safety guides, links to external support organizations, and regular reminders about safety best practices." 
              },
              { 
                title: "Regular Review and Updates", 
                content: "We regularly review and update our CSAE policies and procedures to incorporate new best practices, technological advances, and changes in regulatory requirements. We consult with child safety experts to ensure our approaches are effective and appropriate." 
              },
              { 
                title: "Staff Training", 
                content: "All staff members, especially those involved in content moderation, customer support, and product development, receive specialized training on identifying and responding to CSAE issues. This training is updated regularly to reflect evolving threats and best practices." 
              },
              { 
                title: "Transparency", 
                content: "We are committed to transparency in our efforts to combat CSAE. We publish regular reports on our content moderation activities, including statistics on CSAE-related content removals and account terminations, while respecting privacy and confidentiality requirements." 
              },
              { 
                title: "Resources and Support", 
                content: "If you or someone you know has been affected by child sexual abuse or exploitation, please contact local law enforcement immediately. Additional resources include:\n\n• Childhelp National Child Abuse Hotline (US): 1-800-422-4453\n• NCMEC CyberTipline (US): https://report.cybertip.org/\n• Internet Watch Foundation (UK): https://report.iwf.org.uk/\n• Child Welfare Committee (India): Contact details available at your local district office" 
              },
              { 
                title: "Contact Information", 
                content: "For questions about our CSAE policies or to report concerns, please contact our dedicated safety team at safeguarding@ments.app." 
              },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold mb-3 text-white bg-white/5 p-2 pl-4 rounded-md border-l-4 border-emerald-300">{item.title}</h3>
                <div className="whitespace-pre-line">
                  <p className="text-white/80">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center text-white/60 mb-8">
          <p>
            Return to{" "}
            <Link href="/" className="text-emerald-300 hover:text-emerald-200 underline">
              Home
            </Link>
            {" "}or{" "}
            <Link href="/legal" className="text-emerald-300 hover:text-emerald-200 underline">
              Legal Documents
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}