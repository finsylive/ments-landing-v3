import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Monitor, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Ments Support",
  description: "Get help with your Ments account, app access, web access, reports, permissions, and account deletion.",
};

const supportItems = [
  {
    question: "How do I create an account?",
    answer:
      "You can create a Ments account using email signup, Google Sign-In, or Apple Sign-In where available. If you sign up with email, you may need to enter the verification code sent to your email before you can continue.",
  },
  {
    question: "I can't log in. What should I do?",
    answer:
      "Make sure your internet connection is working, check that you are using the same login method you used when creating your account, and confirm that your email is verified if you signed up with email. If you forgot your password, tap Forgot password? on the login screen. If Google or Apple Sign-In fails, restart the app and try again.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "On the login screen, enter your email address and tap Forgot password? If an account exists for that email, you will receive a password reset link by email.",
  },
  {
    question: "How do I delete my Ments account?",
    answer:
      "Open the Ments app, go to your profile or account area, open Settings, tap Delete Account, and confirm your choice. Deleting your account permanently removes your profile from Ments, hides your posts, clears your login session, and cannot be undone. If you cannot access the app, email support@ments.app with the subject Account Deletion Request and include the email address linked to your Ments account.",
  },
  {
    question: "How do I delete the Ments app from my phone?",
    answer:
      "Deleting the app from your phone only removes the app from your device. It does not delete your Ments account. On iPhone, press and hold the Ments app icon, tap Remove App, then tap Delete App. On Android, press and hold the Ments app icon, then tap Uninstall or drag it to Uninstall.",
  },
  {
    question: "What happens when I delete my account?",
    answer:
      "When you delete your account, your Ments profile is removed and your login session is cleared. Your posts are hidden, and account-related data is deleted according to our Privacy Policy. Some limited information may be retained if required for legal, safety, or abuse-prevention reasons.",
  },
  {
    question: "How do I report a post or profile?",
    answer:
      "Open the post or profile, tap the menu or overflow button, select Report, choose the reason, and submit the report. We review reports to help keep Ments safe and professional.",
  },
  {
    question: "How do I block or unblock someone?",
    answer:
      "You can block users from their profile menu. To manage blocked users, open Settings, go to Blocked Users, and view or unblock users from there.",
  },
  {
    question: "Why does Ments ask for camera, photo, microphone, or notification permission?",
    answer:
      "Ments asks for permissions only for app features. Camera access supports photos, videos, and event QR codes. Photo Library access supports profile photos, posts, replies, project media, startup images, and resumes. Microphone access supports voice-based AI features. Notifications support alerts for messages, follows, replies, mentions, and application updates. You can manage permissions anytime from your device settings.",
  },
  {
    question: "How do I update my profile?",
    answer:
      "Go to your profile and choose the edit option. You can update details such as your name, username, bio, skills, experience, education, portfolio links, projects, and profile picture.",
  },
  {
    question: "How do job or gig applications work?",
    answer:
      "Ments may allow you to apply for jobs, gigs, or opportunities. When you apply, relevant profile and application information may be shared with the opportunity creator or employer. Review your information before submitting an application.",
  },
  {
    question: "Does Ments use AI features?",
    answer:
      "Yes. Ments may use AI features for resume parsing, profile assistance, job matching, interview preparation, search, and voice conversations. AI results may not always be perfect, so you should review important information before relying on it.",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gradient-to-br from-gray-50 to-emerald-50/70 px-4 pb-14 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Ments Support
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-950 md:text-6xl">
            Need help with Ments?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            We are here to help with account access, profile updates, app issues,
            web issues, reports, and account deletion requests.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:support@ments.app"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Mail className="h-4 w-4" />
              support@ments.app
            </a>
            <a
              href="mailto:official@ments.app"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
            >
              <Mail className="h-4 w-4" />
              official@ments.app
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Smartphone className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-950">App Support</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              For users coming from the iOS or Android app, email us at{" "}
              <a className="font-semibold text-emerald-700 underline" href="mailto:support@ments.app">
                support@ments.app
              </a>
              . Include your registered email address, device type, app version
              if available, and a short description of the issue.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Monitor className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-950">Web Support</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              For users coming from the Ments website, email{" "}
              <a className="font-semibold text-emerald-700 underline" href="mailto:support@ments.app">
                support@ments.app
              </a>
              . Include the page URL, your browser, your registered email
              address if relevant, and a screenshot or screen recording if helpful.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-950">Frequently Asked Questions</h2>
          <div className="mt-8 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {supportItems.map((item) => (
              <article key={item.question} className="p-6">
                <h3 className="text-lg font-semibold text-gray-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-950">Policies</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/legal#privacy"
              className="rounded-lg border border-gray-200 p-5 text-gray-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="block text-lg font-semibold text-gray-950">Privacy Policy</span>
              <span className="mt-2 block text-sm">Read how Ments handles account data and privacy.</span>
            </Link>
            <Link
              href="/legal#terms"
              className="rounded-lg border border-gray-200 p-5 text-gray-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="block text-lg font-semibold text-gray-950">Terms of Service</span>
              <span className="mt-2 block text-sm">Read the terms that apply when using Ments.</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
