import React from "react";
import Seo from "../components/Seo";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import PageHero from "../components/shop/PageHero";
import Reveal from "../components/ui/Reveal";
import PostCard from "../components/blog/PostCard";
import { getPosts } from "../lib/blog";

const SITE_URL = "https://www.novamdk.com";

export default function BlogPage() {
  const posts = getPosts();
  const [lead, ...rest] = posts;

  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Seo
        title="Blog: Guides on Weight Loss, Longevity and Skin"
        description="Clinician-reviewed guides from Nova MDK on GLP-1 weight loss, longevity, skin health and sexual wellness. Written to answer the questions patients actually ask."
        path="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Nova MDK Blog",
          url: `${SITE_URL}/blog`,
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            datePublished: p.date,
            url: `${SITE_URL}/blog/${p.slug}`,
          })),
        }}
      />
      <Navbar />

      <PageHero
        showBack
        eyebrow="Blog"
        title="Guides worth your time"
        subtitle="Plain answers to the questions patients actually ask, reviewed by licensed providers."
      />

      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.4rem,5vw,4rem)] md:px-10">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-[1rem] text-muted">
            New articles are on the way. Check back shortly.
          </p>
        ) : (
          <>
            {/* Newest post runs wide, the rest sit in a grid beneath it. */}
            <Reveal>
              <PostCard post={lead} featured />
            </Reveal>

            {rest.length > 0 && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  /* h-full on the Reveal too — it is the grid item, so without it
                     the card inside has no full-height box to stretch into. */
                  <Reveal key={p.slug} delay={Math.min(i, 3) * 0.07} className="h-full">
                    <PostCard post={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}

        <p className="mt-10 text-[0.8rem] leading-relaxed text-muted">
          Articles are for general information only. They are not medical advice and do not create a
          patient-provider relationship. Talk to a licensed provider about your own circumstances.
        </p>
      </section>

      <Footer />
    </main>
  );
}
