"use client";

import { useEffect, useRef } from "react";

type SubstackPostProps = {
	title: string;
	subtitle: string;
	href: string;
};

function SubstackPost({ title, subtitle, href }: SubstackPostProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Ensure a per-block script immediately follows the container
		const nextSibling = container.nextElementSibling as HTMLScriptElement | null;
		if (nextSibling && nextSibling.tagName === "SCRIPT" && nextSibling.src.includes("substack.com/embed")) {
			nextSibling.remove();
		}

		const script = document.createElement("script");
		script.src = "https://substack.com/embedjs/embed.js";
		script.async = true;
		script.charset = "utf-8";
		container.insertAdjacentElement("afterend", script);

		// Try to initialize/re-initialize
		try {
			(window as any)?.SubstackEmbed?.init?.();
			setTimeout(() => (window as any)?.SubstackEmbed?.init?.(), 100);
			setTimeout(() => (window as any)?.SubstackEmbed?.init?.(), 500);
		} catch {}
	}, [href]);

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow w-full max-w-3xl mx-auto text-center flex flex-col items-center">
			<div ref={containerRef} className="substack-post-embed w-full" suppressHydrationWarning>
				<p lang="en">{title}</p>
				<p>{subtitle}</p>
				<a data-post-link href={href}>Read on Substack</a>
			</div>
		</div>
	);
}

export default function SubstackEmbeds() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
			<SubstackPost
				title="How to Conduct Market Research for a Startup by Ments.app"
				subtitle="Market Research—The Step Most Founders Skip"
				href="https://mentsapp.substack.com/p/how-to-conduct-market-research-for"
			/>
			<SubstackPost
				title="Canva Code by Ments.app"
				subtitle="Where Design Meets Automation "
				href="https://mentsapp.substack.com/p/canva-code"
			/>

			<SubstackPost
				title="The Future of Indian Startups: by Ments.app"
				subtitle="What to Expect in 2025"
				href="https://mentsapp.substack.com/p/the-future-of-indian-startups"
			/>

			<SubstackPost
				title="Startup Mahakumbh by Ments.app"
				subtitle="A Call for Deep-Tech Innovation"
				href="https://mentsapp.substack.com/p/startup-mahakumbh"
			/>
		</div>
  );
}


