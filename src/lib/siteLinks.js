export const LEGAL_PAGES = [
  ["terms-and-conditions", "Terms of Service"],
  ["privacy-policy", "Privacy Policy"],
  ["telehealth-consent", "Telehealth Consent"],
  ["hipaa-notice-of-privacy-practices", "HIPAA Notice of Privacy Practices"],
  ["consumer-health-data", "Consumer Health Data Privacy Notice"],
];

// Standalone marketing/tool pages. `priority` feeds sitemap.xml.
export const CONTENT_PAGES = [
  {
    path: "/weight-loss-calculator",
    title: "Weight Loss Calculator: BMI & GLP-1 Goal Projection",
    description:
      "Free weight loss calculator: check your BMI, see the weight range clinical GLP-1 studies associate with your starting weight, and find out whether treatment may be an option for you.",
    priority: "0.8",
  },
  {
    path: "/sitemap",
    // No brand name here — both the prerenderer and <Seo> append "| NovaMDK".
    title: "Sitemap: All Treatments & Pages",
    description:
      "Browse every page on NovaMDK: all treatments, treatment categories, tools and policies, in one place.",
    priority: "0.4",
  },
];
