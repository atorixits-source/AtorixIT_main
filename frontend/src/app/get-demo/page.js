"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { submitDemoRequest } from "@/lib/api";

export default function GetDemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91", // Default to India
    phone: "",
    company: "",
    role: "",
    interests: [],
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  const countryCodes = [
    { code: "+1", country: "US/CA" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+61", country: "AU" },
    { code: "+49", country: "DE" },
    { code: "+33", country: "FR" },
    { code: "+81", country: "JP" },
    { code: "+86", country: "CN" },
    { code: "+971", country: "AE" },
    { code: "+65", country: "SG" },
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (digits only, 7-15 characters)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (7-15 digits)";
    }

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    // Interests validation
    if (!formData.interests.length) {
      newErrors.interests = "Please select at least one interest";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => {
        const updatedInterests = checked
          ? [...prev.interests, value]
          : prev.interests.filter(interest => interest !== value);

        return { ...prev, interests: updatedInterests };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field when user makes changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear API error when user makes any changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚫 HARD LOCK — prevents double click / fast submit
    if (submitting) return;

    setSubmitting(true);
    setApiError(null);

    if (!validateForm()) {
      setSubmitting(false);
      const firstErrorField = document.querySelector("[aria-invalid='true']");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }

    try {
      // Prepare payload for backend with full phone number
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: `${formData.countryCode}${formData.phone.trim()}`, // No space - combine directly
        company: formData.company.trim(),
        role: formData.role.trim(),
        interests: Array.isArray(formData.interests) ? formData.interests : [],
        message: formData.message.trim(),
        source: "demo_request_page"
      };

      console.log('Submitting demo request payload:', payload);

      // Call API
      const result = await submitDemoRequest(payload);

      console.log('Demo request saved to MongoDB:', result);

      // SUCCESS - Show success message
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        company: "",
        role: "",
        interests: [],
        message: "",
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSubmitted(false), 5000);

    } catch (error) {
      console.error('❌ Form submission error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data,
        response: error.response
      });

      // 🚫 CHECK FOR DUPLICATE ERROR (409 status)
      const is409 = error?.status === 409 || error?.response?.status === 409;
      const isDuplicateMessage = error.message?.toLowerCase().includes("already exists") ||
                                 error.message?.toLowerCase().includes("duplicate") ||
                                 error.message?.toLowerCase().includes("already registered");

      if (is409 || isDuplicateMessage) {
        console.log('🚨 DUPLICATE DETECTED - Status 409 or duplicate message');
        
        // Get error data from different possible locations
        const errorData = error.data || error.response?.data || {};
        const errorMessage = errorData.error || errorData.message || error.message;
        const field = errorData.field;

        console.log('Duplicate error details:', { errorMessage, field });

        // Set field-specific errors
        const newErrors = {};
        
        if (field === 'email' || errorMessage?.toLowerCase().includes('email')) {
          newErrors.email = errorData.error || 'This email address has already been registered.';
          setApiError('This email address is already registered. Please use a different email address.');
        } else if (field === 'phone' || errorMessage?.toLowerCase().includes('phone')) {
          newErrors.phone = errorData.error || 'This phone number has already been registered.';
          setApiError('This phone number is already registered. Please use a different phone number.');
        } else {
          // Generic duplicate error
          setApiError('This email or phone number is already registered. Please use different contact details.');
        }

        setErrors(newErrors);

        // Scroll to first error field
        setTimeout(() => {
          const errorField = document.querySelector("[aria-invalid='true']");
          if (errorField) {
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorField.focus();
          }
        }, 100);

      } else {
        // Other errors (network, validation, etc.)
        setApiError(
          error.message ||
          'An error occurred while submitting the form. Please try again or contact support.'
        );
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setApiError(null), 10000);
      
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              {submitted && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 shadow-md">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Thank You for Your Interest!</h3>
                  <p className="mb-3 sm:mb-4 text-sm sm:text-base">We've received your demo request and will be in touch shortly.</p>
                  <p className="text-xs sm:text-sm">A confirmation email has been sent to your inbox with details about next steps.</p>
                </div>
              )}

              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs sm:text-sm font-medium text-primary mb-4 sm:mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Request a Demo
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Experience SAP Excellence in Action
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                See how our SAP solutions can transform your business processes and drive efficiency. Fill out the form to schedule a personalized demo.
              </p>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-muted-foreground">Personalized demonstration tailored to your industry</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-muted-foreground">Live Q&A with our SAP experts</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-muted-foreground">Detailed insights into features and functionality</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-muted-foreground">No obligation consultation with implementation experts</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg bg-card border border-border/40 p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Schedule Your Demo</h2>

              {apiError && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 flex items-start">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-300 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Error Submitting Form</p>
                    <p className="text-xs sm:text-sm">{apiError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Hidden honeypot field to prevent spam */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  style={{ display: 'none' }}
                />

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs sm:text-sm font-medium">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={errors.name ? "true" : "false"}
                      className={"w-full px-3 sm:px-4 py-2 rounded-md border text-sm sm:text-base " +
                        (errors.name ? 'border-red-500 dark:border-red-400' : 'border-input') +
                        " bg-background focus:border-primary focus:ring-1 focus:ring-primary"}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs sm:text-sm font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={errors.email ? "true" : "false"}
                      className={"w-full px-3 sm:px-4 py-2 rounded-md border text-sm sm:text-base " +
                        (errors.email ? 'border-red-500 dark:border-red-400' : 'border-input') +
                        " bg-background focus:border-primary focus:ring-1 focus:ring-primary"}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone and Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs sm:text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="countryCode"
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="w-20 sm:w-24 px-2 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.code}
                          </option>
                        ))}
                      </select>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        aria-invalid={errors.phone ? "true" : "false"}
                        className={"flex-1 px-3 sm:px-4 py-2 rounded-md border text-sm sm:text-base " +
                          (errors.phone ? 'border-red-500 dark:border-red-400' : 'border-input') +
                          " bg-background focus:border-primary focus:ring-1 focus:ring-primary"}
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-xs sm:text-sm font-medium">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      aria-invalid={errors.company ? "true" : "false"}
                      className={"w-full px-3 sm:px-4 py-2 rounded-md border text-sm sm:text-base " +
                        (errors.company ? 'border-red-500 dark:border-red-400' : 'border-input') +
                        " bg-background focus:border-primary focus:ring-1 focus:ring-primary"}
                      placeholder="Enter your company name"
                    />
                    {errors.company && (
                      <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                        {errors.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label htmlFor="role" className="text-xs sm:text-sm font-medium">
                    Your Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    aria-invalid={errors.role ? "true" : "false"}
                    className={"w-full px-3 sm:px-4 py-2 rounded-md border text-sm sm:text-base " +
                      (errors.role ? 'border-red-500 dark:border-red-400' : 'border-input') +
                      " bg-background focus:border-primary focus:ring-1 focus:ring-primary"}
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="C-Level Executive">C-Level Executive</option>
                    <option value="IT Manager">IT Manager</option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                      {errors.role}
                    </p>
                  )}
                </div>

                {/* Interested in */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">
                    Interested in <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sap-implementation"
                        name="interests"
                        value="SAP Implementation"
                        checked={formData.interests.includes("SAP Implementation")}
                        onChange={handleChange}
                        aria-invalid={errors.interests ? "true" : "false"}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="sap-implementation" className="ml-2 text-xs sm:text-sm">
                        SAP Implementation
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sap-support"
                        name="interests"
                        value="SAP Support"
                        checked={formData.interests.includes("SAP Support")}
                        onChange={handleChange}
                        aria-invalid={errors.interests ? "true" : "false"}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="sap-support" className="ml-2 text-xs sm:text-sm">
                        SAP Support
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sap-migration"
                        name="interests"
                        value="SAP Migration"
                        checked={formData.interests.includes("SAP Migration")}
                        onChange={handleChange}
                        aria-invalid={errors.interests ? "true" : "false"}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="sap-migration" className="ml-2 text-xs sm:text-sm">
                        SAP Migration
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sap-integration"
                        name="interests"
                        value="SAP Integration"
                        checked={formData.interests.includes("SAP Integration")}
                        onChange={handleChange}
                        aria-invalid={errors.interests ? "true" : "false"}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="sap-integration" className="ml-2 text-xs sm:text-sm">
                        SAP Integration
                      </label>
                    </div>
                  </div>
                  {errors.interests && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                      {errors.interests}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs sm:text-sm font-medium">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary resize-none text-sm sm:text-base"
                    placeholder="Tell us about your specific requirements or questions"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 disabled:pointer-events-none disabled:opacity-50"
                  size="lg"
                  disabled={submitting}
                >

                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Request Demo
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting this form, you agree to our{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Process Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">How Our Demo Process Works</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              We've designed our demo process to be informative, efficient, and tailored to your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-card rounded-xl p-6 sm:p-8 shadow-sm border border-border/40 relative">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 mb-4 sm:mb-6">
                <span className="text-lg sm:text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Submit Request</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Fill out the form with your details and requirements. Our team will review your submission and prepare for the next steps.</p>
            </div>

            <div className="bg-card rounded-xl p-6 sm:p-8 shadow-sm border border-border/40 relative">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 mb-4 sm:mb-6">
                <span className="text-lg sm:text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Consultation Call</h3>
              <p className="text-sm sm:text-base text-muted-foreground">We'll schedule a brief discovery call to understand your specific needs and challenges, ensuring our demo addresses your key concerns.</p>
            </div>

            <div className="bg-card rounded-xl p-6 sm:p-8 shadow-sm border border-border/40 relative">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 mb-4 sm:mb-6">
                <span className="text-lg sm:text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Personalized Demo</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Our experts will provide a comprehensive demonstration tailored to your business, followed by Q&A and discussion of potential next steps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Get answers to common questions about our demo process and SAP solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-4 sm:p-6 border border-border/40">
              <h3 className="text-base sm:text-lg font-semibold mb-2">How long does the demo typically last?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Our demos typically last 60-90 minutes, including time for questions and discussion. We can adjust the timing based on your availability.
              </p>
            </div>

            <div className="bg-card rounded-lg p-4 sm:p-6 border border-border/40">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Who should attend the demo?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                We recommend including key stakeholders such as IT leadership, department heads who will use the system, and decision-makers in the demo session.
              </p>
            </div>

            <div className="bg-card rounded-lg p-4 sm:p-6 border border-border/40">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Is there any cost for the demo?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                No, our demos are completely free of charge and come with no obligation to purchase. We believe in demonstrating the value of our solutions.
              </p>
            </div>

            <div className="bg-card rounded-lg p-4 sm:p-6 border border-border/40">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Can the demo be customized to our industry?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Absolutely! We specialize in industry-specific implementations and will tailor the demo to showcase relevant features and use cases for your sector.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}