"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { submitFormData, submitWeb3FormData, submitDemoRequest } from "@/lib/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phone: ''
  });

  // Phone number length rules by country code
  const phoneRules = {
    '+1': { min: 10, max: 10 },
    '+7': { min: 10, max: 10 },
    '+20': { min: 10, max: 10 },
    '+27': { min: 9, max: 9 },
    '+31': { min: 9, max: 9 },
    '+32': { min: 9, max: 9 },
    '+33': { min: 9, max: 9 },
    '+34': { min: 9, max: 9 },
    '+39': { min: 10, max: 10 },
    '+41': { min: 9, max: 9 },
    '+44': { min: 10, max: 10 },
    '+45': { min: 8, max: 8 },
    '+46': { min: 9, max: 9 },
    '+47': { min: 8, max: 8 },
    '+48': { min: 9, max: 9 },
    '+49': { min: 10, max: 11 },
    '+52': { min: 10, max: 10 },
    '+55': { min: 10, max: 11 },
    '+60': { min: 9, max: 10 },
    '+61': { min: 9, max: 9 },
    '+62': { min: 10, max: 12 },
    '+63': { min: 10, max: 10 },
    '+64': { min: 9, max: 10 },
    '+65': { min: 8, max: 8 },
    '+66': { min: 9, max: 9 },
    '+81': { min: 10, max: 10 },
    '+82': { min: 9, max: 10 },
    '+84': { min: 9, max: 10 },
    '+86': { min: 11, max: 11 },
    '+90': { min: 10, max: 10 },
    '+91': { min: 10, max: 10 },
    '+92': { min: 10, max: 10 },
    '+93': { min: 9, max: 9 },
    '+94': { min: 9, max: 9 },
    '+234': { min: 10, max: 10 },
    '+254': { min: 9, max: 9 },
    '+351': { min: 9, max: 9 },
    '+353': { min: 9, max: 9 },
    '+852': { min: 8, max: 8 },
    '+880': { min: 10, max: 10 },
    '+886': { min: 9, max: 9 },
    '+966': { min: 9, max: 9 },
    '+971': { min: 9, max: 9 },
    '+972': { min: 9, max: 9 },
    '+974': { min: 8, max: 8 },
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else {
      const rule = phoneRules[formData.countryCode];
      if (rule && (formData.phone.length < rule.min || formData.phone.length > rule.max)) {
        newErrors.phone = `Phone number for ${formData.countryCode} must be ${rule.min === rule.max ? rule.min : `${rule.min}-${rule.max}`} digits`;
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email' || name === 'phone') {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'phone') {
      const digitOnly = value.replace(/\D/g, '');
      const rule = phoneRules[formData.countryCode];
      if (rule && digitOnly.length > rule.max) return;
      setFormData((prev) => ({ ...prev, [name]: digitOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!validateForm()) {
      const firstErrorField = document.querySelector("[aria-invalid='true']");
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    setSubmitting(true);
    setApiError(null);
    setFieldErrors({ email: '', phone: '' });

    try {
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: `${formData.countryCode} ${formData.phone}`,
        company: formData.company.trim() || 'Not provided',
        role: 'Website Visitor',
        interests: ['Website Inquiry'],
        message: formData.message.trim() || 'No message provided',
        source: 'website-contact',
        status: 'new',
        metadata: {
          formType: 'contact-form',
          submittedAt: new Date().toISOString()
        }
      };

      // Frontend duplicate guard (same session protection)
      const lastSubmission = window.__lastSubmission || null;
      if (
        lastSubmission &&
        lastSubmission.email === submissionData.email &&
        lastSubmission.phone === submissionData.phone
      ) {
        setApiError("This email or phone was just submitted. Please wait.");
        setSubmitting(false);
        return;
      }

      window.__lastSubmission = {
        email: submissionData.email,
        phone: submissionData.phone,
        time: Date.now()
      };

      // Submit to backend
      try {
        const demoResult = await submitDemoRequest(submissionData);

        if (!demoResult.success) {
          console.error('Demo request returned success=false:', demoResult);
        }
      } catch (backendError) {
        console.error('Backend submission error:', backendError.message);

        const isDuplicateError =
          backendError.status === 409 ||
          backendError.message?.toLowerCase().includes('already exists') ||
          backendError.message?.toLowerCase().includes('duplicate') ||
          backendError.response?.data?.message?.toLowerCase().includes('already exists') ||
          backendError.response?.data?.message?.toLowerCase().includes('duplicate');

        if (isDuplicateError) {
          const errorMessage = backendError.message ||
                               backendError.response?.data?.message ||
                               backendError.response?.data?.error ||
                               '';
          const errorMessageLower = errorMessage.toLowerCase();

          if (errorMessageLower.includes('email')) {
            setFieldErrors(prev => ({ ...prev, email: 'This email address has already been registered.' }));
            setApiError('This email address is already registered. Please use a different email.');
            setSubmitting(false);
            document.getElementById('email')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.getElementById('email')?.focus();
            return;
          } else if (errorMessageLower.includes('phone')) {
            setFieldErrors(prev => ({ ...prev, phone: 'This phone number has already been registered.' }));
            setApiError('This phone number is already registered. Please use a different number.');
            setSubmitting(false);
            document.getElementById('phone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.getElementById('phone')?.focus();
            return;
          } else {
            setApiError('This email or phone number has already been registered. Please use different details.');
            setSubmitting(false);
            return;
          }
        }

        if (backendError.status === 400) {
          const validationErrors = backendError.response?.data?.errors;
          if (validationErrors) {
            const newFieldErrors = {};
            if (validationErrors.email) newFieldErrors.email = validationErrors.email;
            if (validationErrors.phone) newFieldErrors.phone = validationErrors.phone;

            if (Object.keys(newFieldErrors).length > 0) {
              setFieldErrors(newFieldErrors);
              setApiError('Please correct the errors in the form.');
              setSubmitting(false);
              return;
            }
          }
        }

        setApiError(backendError.userMessage || backendError.message || 'Unable to submit form. Please try again.');
        setSubmitting(false);
        return;
      }

      // Submit to Web3Forms
      let web3Result;
      try {
        web3Result = await submitWeb3FormData({
          ...submissionData,
          subject: `New Contact from ${submissionData.name}`,
          from_name: submissionData.name,
          reply_to: submissionData.email
        });
      } catch (web3Error) {
        console.error("Web3Forms error:", web3Error.message);
        setApiError(
          web3Error?.response?.data?.message ||
          web3Error?.message ||
          "Failed to send email notification. Your submission was saved but we couldn't send the confirmation email."
        );
      }

      if (web3Result?.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          countryCode: "+91",
          phone: "",
          company: "",
          message: "",
        });
        setFieldErrors({ email: '', phone: '' });

        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setApiError(
          web3Result?.message ||
          web3Result?.error ||
          "Your message was saved but we couldn't send the confirmation email. We'll still get back to you!"
        );
      }

    } catch (error) {
      console.error("Unexpected form submission error:", error);
      setApiError("An unexpected error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      <motion.div
        className="bg-card rounded-xl shadow-lg border border-border/40 p-4 sm:p-6 md:p-8 backdrop-blur-sm dark:bg-black/30"
        whileHover={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Send Us a Message</h2>

        {submitted ? (
          <motion.div
            className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 flex items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-green-100 dark:bg-green-800 p-1 mr-3 flex-shrink-0">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="font-medium text-sm sm:text-base">Thank you for your message!</p>
              <p className="text-xs sm:text-sm mt-1">We have received your inquiry and will get back to you shortly.</p>
            </div>
          </motion.div>
        ) : null}

        {apiError && (
          <motion.div
            className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 flex items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-red-100 dark:bg-red-800 p-1 mr-3 flex-shrink-0">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="font-medium text-sm sm:text-base">Error Submitting Form</p>
              <p className="text-xs sm:text-sm mt-1">{apiError}</p>
            </div>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => { if (e.key === "Enter" && submitting) e.preventDefault(); }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Honeypot field to prevent spam */}
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <label htmlFor="name" className="text-xs sm:text-sm font-medium block">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={errors.name ? "true" : "false"}
                className={"w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border " + (errors.name ? "border-red-500 dark:border-red-400" : "border-input") + " bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                  {errors.name}
                </p>
              )}
            </motion.div>

            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <label htmlFor="email" className="text-xs sm:text-sm font-medium block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email || fieldErrors.email ? "true" : "false"}
                className={"w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border " + (errors.email || fieldErrors.email ? "border-red-500 dark:border-red-400" : "border-input") + " bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"}
                placeholder="Enter your email address"
              />
              {(errors.email || fieldErrors.email) && (
                <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                  {errors.email || fieldErrors.email}
                </p>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
              <label htmlFor="phone" className="text-xs sm:text-sm font-medium block">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-[90px] sm:w-[120px] px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option value="+93">AF +93</option>
                  <option value="+61">AU +61</option>
                  <option value="+880">BD +880</option>
                  <option value="+32">BE +32</option>
                  <option value="+55">BR +55</option>
                  <option value="+1">CA +1</option>
                  <option value="+86">CN +86</option>
                  <option value="+45">DK +45</option>
                  <option value="+20">EG +20</option>
                  <option value="+33">FR +33</option>
                  <option value="+49">DE +49</option>
                  <option value="+852">HK +852</option>
                  <option value="+91">IN +91</option>
                  <option value="+62">ID +62</option>
                  <option value="+353">IE +353</option>
                  <option value="+972">IL +972</option>
                  <option value="+39">IT +39</option>
                  <option value="+81">JP +81</option>
                  <option value="+254">KE +254</option>
                  <option value="+60">MY +60</option>
                  <option value="+52">MX +52</option>
                  <option value="+31">NL +31</option>
                  <option value="+64">NZ +64</option>
                  <option value="+234">NG +234</option>
                  <option value="+47">NO +47</option>
                  <option value="+92">PK +92</option>
                  <option value="+63">PH +63</option>
                  <option value="+48">PL +48</option>
                  <option value="+351">PT +351</option>
                  <option value="+974">QA +974</option>
                  <option value="+7">RU +7</option>
                  <option value="+966">SA +966</option>
                  <option value="+65">SG +65</option>
                  <option value="+27">ZA +27</option>
                  <option value="+82">KR +82</option>
                  <option value="+34">ES +34</option>
                  <option value="+94">LK +94</option>
                  <option value="+46">SE +46</option>
                  <option value="+41">CH +41</option>
                  <option value="+886">TW +886</option>
                  <option value="+66">TH +66</option>
                  <option value="+90">TR +90</option>
                  <option value="+971">AE +971</option>
                  <option value="+44">GB +44</option>
                  <option value="+1">US +1</option>
                  <option value="+84">VN +84</option>
                </select>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={errors.phone || fieldErrors.phone ? "true" : "false"}
                  className={"flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border " + (errors.phone || fieldErrors.phone ? "border-red-500 dark:border-red-400" : "border-input") + " bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"}
                  placeholder="9876543210"
                />
              </div>
              {(errors.phone || fieldErrors.phone) && (
                <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                  {errors.phone || fieldErrors.phone}
                </p>
              )}
            </motion.div>

            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }}>
              <label htmlFor="company" className="text-xs sm:text-sm font-medium block">
                Company Name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Enter your company name"
              />
            </motion.div>
          </div>

          <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.18 }}>
            <label htmlFor="message" className="text-xs sm:text-sm font-medium block">
              Your Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              aria-invalid={errors.message ? "true" : "false"}
              className={"w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border " + (errors.message ? "border-red-500 dark:border-red-400" : "border-input") + " bg-background focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"}
              placeholder="Tell us about your project or inquiry"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                {errors.message}
              </p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.22 }}>
            <Button
              type="submit"
              className="w-full sm:w-auto gap-2 text-sm sm:text-base disabled:opacity-50 disabled:pointer-events-none"
              size="lg"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}