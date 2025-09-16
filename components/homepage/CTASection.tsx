"use client";

import { useState } from "react";

export function CTASection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form fields
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Please enter a valid email address";
    }

    // If there are errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Send email using a service like EmailJS or form handler
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          to: "admin@shipsmind.com",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gray-900 py-24"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA Content */}
          <h2 className="font-inter mb-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            READY TO SEE WHAT AI CAN DO FOR YOU?
          </h2>

          {/* Contact Form */}
          <div className="mt-12">
            <div className="card-dark mx-auto max-w-lg rounded-xl border border-gray-700 p-8 text-left shadow-2xl">
              {submitStatus === "success" ? (
                <div className="py-8 text-center">
                  <div className="mb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-spinx-lime/30 bg-spinx-lime/20">
                      <svg
                        className="h-8 w-8 text-spinx-lime"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    THANK YOU!
                  </h3>
                  <p className="leading-relaxed text-gray-300">
                    We'll be in touch within 24 hours to discuss how we can help
                    automate your business.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-sm font-medium uppercase tracking-wider text-gray-300"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-0 border-b-2 bg-transparent px-0 py-3 text-lg text-white placeholder-gray-500 transition-colors focus:outline-none ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-600 focus:border-spinx-lime"
                      }`}
                      placeholder="Jane Doe"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm font-medium uppercase tracking-wider text-gray-300"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-0 border-b-2 bg-transparent px-0 py-3 text-lg text-white placeholder-gray-500 transition-colors focus:outline-none ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-600 focus:border-spinx-lime"
                      }`}
                      placeholder="jane.doe@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="message"
                      className="mb-3 block text-sm font-medium uppercase tracking-wider text-gray-300"
                    >
                      What's your biggest operational challenge?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full resize-none border-0 border-b-2 border-gray-600 bg-transparent px-0 py-3 text-lg text-white placeholder-gray-500 transition-colors focus:border-spinx-lime focus:outline-none"
                      placeholder="e.g., 'We spend too much time manually entering order data.'"
                    />
                  </div>
                  {submitStatus === "error" && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-900/20 p-4">
                      <p className="text-sm text-red-400">
                        There was an error sending your message. Please try
                        again or email us directly at admin@shipsmind.com
                      </p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full transform bg-spinx-lime px-8 py-4 text-lg font-bold uppercase tracking-wide text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-spinx-lime-dark hover:shadow-2xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "SENDING..." : "LET'S GET STARTED"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-800 opacity-10 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="cta-grid-pattern"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#cta-grid-pattern)"
          />
        </svg>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-spinx-dark via-transparent to-transparent opacity-40"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-spinx-lime/10 blur-xl"></div>
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-spinx-lime/5 blur-xl"></div>
      <div className="absolute right-1/4 top-1/3 h-2 w-2 animate-pulse rounded-full bg-spinx-lime opacity-40"></div>
      <div
        className="absolute bottom-1/3 left-1/4 h-1 w-1 animate-pulse rounded-full bg-spinx-lime opacity-30"
        style={{ animationDelay: "1.5s" }}
      ></div>
    </section>
  );
}
