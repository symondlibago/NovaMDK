import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatDate, readTime } from "../../lib/blog";

/** Post teaser used on the blog index and in the related strip on an article. */
export default function PostCard({ post, featured = false }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-[calc(24px*var(--nv-r-scale,1))] border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:nv-shadow-lg ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "md:w-1/2" : ""}`}>
        <div className={featured ? "aspect-[16/11] h-full w-full" : "aspect-[16/10]"}>
          <img
            src={post.image}
            alt={post.imageAlt || ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
      </div>

      <div className={`flex flex-1 flex-col p-6 md:p-7 ${featured ? "md:justify-center md:p-9" : ""}`}>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-muted">
          {post.tags?.[0] && <span className="text-primary">{post.tags[0]}</span>}
          {post.tags?.[0] && <span aria-hidden="true">·</span>}
          <span>{formatDate(post.date)}</span>
          <span aria-hidden="true">·</span>
          <span>{readTime(post)} min read</span>
        </div>

        <h3
          className={`mt-3 font-display font-extrabold leading-tight tracking-tight text-ink ${
            featured ? "text-[clamp(1.5rem,3vw,2.1rem)]" : "text-[1.2rem]"
          }`}
        >
          {post.title}
        </h3>

        <p className={`mt-3 leading-relaxed text-muted ${featured ? "text-[1.02rem]" : "text-[0.94rem]"}`}>
          {post.excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-[0.92rem] font-semibold text-primary">
          Read article
          <span className="grid h-7 w-7 place-items-center rounded-full border border-line transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary">
            <ArrowRight size={13} />
          </span>
        </span>
      </div>
    </Link>
  );
}
