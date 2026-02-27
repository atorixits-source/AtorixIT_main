"use client"

import { ArrowRight, CheckCircle2, PhoneCall, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { submitDemoRequest } from "@/lib/api";

// Country codes data
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+1", country: "CA", flag: "🇨🇦" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+46", country: "SE", flag: "🇸🇪" },
  { code: "+41", country: "CH", flag: "🇨🇭" },
  { code: "+43", country: "AT", flag: "🇦🇹" },
  { code: "+32", country: "BE", flag: "🇧🇪" },
  { code: "+45", country: "DK", flag: "🇩🇰" },
  { code: "+47", country: "NO", flag: "🇳🇴" },
  { code: "+48", country: "PL", flag: "🇵🇱" },
  { code: "+351", country: "PT", flag: "🇵🇹" },
  { code: "+420", country: "CZ", flag: "🇨🇿" },
  { code: "+36", country: "HU", flag: "🇭🇺" },
  { code: "+30", country: "GR", flag: "🇬🇷" },
  { code: "+90", country: "TR", flag: "🇹🇷" },
  { code: "+7", country: "RU", flag: "🇷🇺" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+852", country: "HK", flag: "🇭🇰" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+60", country: "MY", flag: "🇲🇾" },
  { code: "+66", country: "TH", flag: "🇹🇭" },
  { code: "+84", country: "VN", flag: "🇻🇳" },
  { code: "+62", country: "ID", flag: "🇮🇩" },
  { code: "+63", country: "PH", flag: "🇵🇭" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+64", country: "NZ", flag: "🇳🇿" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+974", country: "QA", flag: "🇶🇦" },
  { code: "+965", country: "KW", flag: "🇰🇼" },
  { code: "+20", country: "EG", flag: "🇪🇬" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+254", country: "KE", flag: "🇰🇪" },
  { code: "+234", country: "NG", flag: "🇳🇬" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+54", country: "AR", flag: "🇦🇷" },
  { code: "+56", country: "CL", flag: "🇨🇱" },
  { code: "+57", country: "CO", flag: "🇨🇴" },
  { code: "+51", country: "PE", flag: "🇵🇪" },
  { code: "+58", country: "VE", flag: "🇻🇪" },
  { code: "+92", country: "PK", flag: "🇵🇰" },
];

const phoneRules = {
  '+1': { max: 10, min: 10 },     // US/Canada
  '+44': { max: 10, min: 10 },    // UK
  '+91': { max: 10, min: 10 },    // India
  '+61': { max: 9, min: 9 },      // Australia
  '+81': { max: 10, min: 10 },    // Japan
  '+86': { max: 11, min: 11 },    // China
  '+49': { max: 11, min: 10 },    // Germany
  '+33': { max: 9, min: 9 },      // France
  '+39': { max: 10, min: 10 },    // Italy
  '+34': { max: 9, min: 9 },      // Spain
  '+7': { max: 10, min: 10 },     // Russia
  '+55': { max: 11, min: 10 },    // Brazil
  '+52': { max: 10, min: 10 },    // Mexico
  '+27': { max: 9, min: 9 },      // South Africa
  '+82': { max: 10, min: 9 },     // South Korea
  '+31': { max: 9, min: 9 },      // Netherlands
  '+46': { max: 10, min: 7 },     // Sweden
  '+41': { max: 9, min: 9 },      // Switzerland
  '+43': { max: 10, min: 10 },    // Austria
  '+32': { max: 9, min: 8 },      // Belgium
  '+45': { max: 8, min: 8 },      // Denmark
  '+47': { max: 8, min: 8 },      // Norway
  '+48': { max: 9, min: 9 },      // Poland
  '+351': { max: 9, min: 9 },     // Portugal
  '+90': { max: 10, min: 10 },    // Turkey
  '+65': { max: 8, min: 8 },      // Singapore
  '+60': { max: 10, min: 9 },     // Malaysia
  '+66': { max: 9, min: 9 },      // Thailand
  '+84': { max: 10, min: 9 },     // Vietnam
  '+62': { max: 11, min: 10 },    // Indonesia
  '+63': { max: 10, min: 10 },    // Philippines
  '+64': { max: 9, min: 8 },      // New Zealand
  '+971': { max: 9, min: 9 },     // UAE
  '+966': { max: 9, min: 9 },     // Saudi Arabia
  '+20': { max: 10, min: 10 },    // Egypt
  '+254': { max: 10, min: 9 },    // Kenya
  '+234': { max: 10, min: 10 },   // Nigeria
  '+54': { max: 10, min: 10 },    // Argentina
  '+56': { max: 9, min: 9 },      // Chile
  '+57': { max: 10, min: 10 },    // Colombia
  '+51': { max: 9, min: 9 },      // Peru
  '+92': { max: 10, min: 10 },    // Pakistan
};


export default function CtaSection() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91", // Default to India
    phone: "",
    company: "",
    role: "",
    message: "",
    interests: []
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phone: ''
  });

  // Get max digits for selected country code
const getMaxDigits = () => {
  const rule = phoneRules[formData.countryCode];
  return rule ? rule.max : 15; // fallback 15 if not found
};

// Get min digits (NEW - optional but recommended)
const getMinDigits = () => {
  const rule = phoneRules[formData.countryCode];
  return rule ? rule.min : 7; // fallback 7 if not found
};


  // Animation for particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      createParticles();
    };

    const createParticles = () => {
      particles.length = 0;
      const particleCount = Math.floor(canvas.width * canvas.height / 15000);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'email', 'phone', 'company', 'role'];

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate phone number based on country
    const maxDigits = getMaxDigits();
    const phoneDigits = formData.phone.replace(/\D/g, '');

    if (formData.phone && phoneDigits.length !== maxDigits) {
      newErrors.phone = `Phone number must be exactly ${maxDigits} digits for ${formData.countryCode}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear field-specific duplicate errors when user modifies the field
    if (name === 'email' || name === 'phone') {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Handle phone number input - only allow digits
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      const maxDigits = getMaxDigits();

      // Limit to max digits for selected country
      if (digitsOnly.length <= maxDigits) {
        setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) {
      setError("");
    }

  };

  // ================= COUNTRY CODE CHANGE =================
  const handleCountryCodeChange = (e) => {
    const newCountryCode = e.target.value;

    setFormData((prev) => ({
      ...prev,
      countryCode: newCountryCode,
      phone: "" // reset phone when country changes
    }));

    // clear validation error
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }

    // clear duplicate error
    setFieldErrors((prev) => ({ ...prev, phone: "" }));
  };



  // ================= SUBMIT HANDLER =================
 const handleSubmit = async (e) => {
  e.preventDefault();

  // 🚫 prevent double click
  if (status === "submitting") return;

  if (!validateForm()) {
    setStatus("idle");
    return;
  }

  setStatus("submitting");
  setError("");
  setFieldErrors({ email: "", phone: "" });

  try {
    // ================= NORMALIZE EMAIL =================
    const normalizedEmail = formData.email.trim().toLowerCase();

    // ================= NORMALIZE PHONE =================
    let cleanPhone = formData.phone.replace(/\D/g, ""); // digits only

    // remove leading 0 (important)
    if (cleanPhone.startsWith("0")) {
      cleanPhone = cleanPhone.substring(1);
    }

    const normalizedPhone =
      formData.countryCode.replace("+", "") + cleanPhone;

    console.log('📤 Submitting with normalized data:', {
      email: normalizedEmail,
      phone: normalizedPhone,
      name: formData.name,
      company: formData.company,
      role: formData.role
    });

    // 🚫 prevent same payload submit again quickly
    const payloadKey = normalizedEmail + "_" + normalizedPhone;
    if (window.__lastSubmitKey === payloadKey) {
      console.warn('⚠️ Duplicate submission prevented');
      setStatus("idle");
      return;
    }
    window.__lastSubmitKey = payloadKey;

    // ================= API CALL USING HELPER =================
    console.log('🚀 Calling submitDemoRequest...');
    const result = await submitDemoRequest({
      name: formData.name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      company: formData.company.trim(),
      role: formData.role.trim(),
      message: formData.message ? formData.message.trim() : "",
      interests: formData.interests || [],
      source: "website_cta"
    });

    console.log('✅ Submission successful:', result);

    // ================= SUCCESS =================
    setStatus("success");

    setFormData({
      name: "",
      email: "",
      countryCode: "+91",
      phone: "",
      company: "",
      role: "",
      message: "",
      interests: []
    });

    // Clear the duplicate prevention key after successful submit
    window.__lastSubmitKey = null;

  } catch (error) {
    console.error("❌ Submit error:", error);
    console.error("Error details:", {
      status: error.status,
      message: error.message,
      response: error.response
    });
    
    // ================= ENHANCED ERROR HANDLING =================
    if (error.status === 409) {
      const errorData = error.response?.data || {};
      const errorMessage = errorData.message || error.message || "";
      const field = errorData.field;

      console.log('🚨 Duplicate error:', { errorMessage, field });

      if (field === 'email' || errorMessage.toLowerCase().includes('email')) {
        setFieldErrors(prev => ({
          ...prev,
          email: errorMessage || 'This email address is already registered'
        }));
        setError('This email address is already registered. Please use a different email.');
      } else if (field === 'phone' || errorMessage.toLowerCase().includes('phone')) {
        setFieldErrors(prev => ({
          ...prev,
          phone: errorMessage || 'This phone number is already registered'
        }));
        setError('This phone number is already registered. Please use a different phone number.');
      } else {
        setError('This email or phone number is already registered. Please use different contact details.');
      }
    } else {
      setError(error.userMessage || error.message || "Submission failed. Please try again.");
    }
    
    setStatus("error");
    
    // Clear the duplicate prevention key on error
    window.__lastSubmitKey = null;
  }
};
        
      
  


  return (
    <div className="pt-6 pb-6 relative overflow-hidden min-h-*">
      {/* Animated canvas for particles effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none", zIndex: 0 }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left column - Text */}
          <div className="text-gray-900 dark:text-white relative order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Business with SAP?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">
              Our team of SAP experts is ready to help you implement, optimize, or migrate
              your SAP systems for maximum efficiency and ROI.
            </p>

            {/* Benefits list */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-justify">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-teal-400 mr-2 sm:mr-3 flex-shrink-0 mt-1" />
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Customized SAP solutions tailored to your specific industry and business needs</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-teal-400 mr-2 sm:mr-3 flex-shrink-0 mt-1" />
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Expert team with deep SAP knowledge and implementation experience</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-teal-400 mr-2 sm:mr-3 flex-shrink-0 mt-1" />
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Comprehensive support and maintenance services to keep your systems running smoothly</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg">
                Request a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-700 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center shadow-lg">
                <PhoneCall className="mr-2 h-4 w-4" />
                Get a Demo
              </button>
            </div>
          </div>

          {/* Right column - Contact form */}
          <div className="bg-gray-100 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-4 relative overflow-hidden shadow-2xl order-1 lg:order-2">
            {/* Background image inside form */}
            <div
              className="absolute inset-0 bg-center bg-cover opacity-5 dark:opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'url("https://res.cloudinary.com/dvt1c3v7l/image/upload/v1761644554/601c9fdd9819a87c6e234eab66f0baa2_rhsoyw.jpg")',
              }}
            />

            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center text-gray-900 dark:text-white relative z-10">
              Get in Touch with Our Team
            </h3>

            {status === "success" && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 flex items-start relative z-10">
                <div className="rounded-full bg-green-100 dark:bg-green-800 p-1 mr-3 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Thank you for your message!</p>
                  <p className="text-xs sm:text-sm mt-1">
                    We have received your inquiry and will get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4 sm:mb-6 flex items-start relative z-10">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-300 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm sm:text-base">Error Submitting Form</p>
                  <p className="text-xs sm:text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 relative z-10">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border ${errors.name ? "border-red-500" : "border-gray-300 dark:border-white/40"
                    } bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:border-blue-500 dark:focus:border-white/70 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-white/20 outline-none transition-all`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border ${errors.email || fieldErrors.email ? "border-red-500" : "border-gray-300 dark:border-white/40"
                    } bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:border-blue-500 dark:focus:border-white/70 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-white/20 outline-none transition-all`}
                  placeholder="Enter your email"
                />
                {(errors.email || fieldErrors.email) && (
                  <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                    {errors.email || fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone Number with Country Code */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <select
                    value={formData.countryCode}
                    onChange={handleCountryCodeChange}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-white/40 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-white/70 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-white/20 outline-none transition-all cursor-pointer w-[85px] sm:w-[100px]"
                  >
                    {countryCodes.map((country, index) => (
                      <option key={`${country.code}-${country.country}-${index}`} value={country.code} className="bg-white dark:bg-gray-800">
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>

                  {/* Phone Number Input */}
                  <div className="flex-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border ${errors.phone || fieldErrors.phone ? "border-red-500" : "border-gray-300 dark:border-white/40"
                        } bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:border-blue-500 dark:focus:border-white/70 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-white/20 outline-none transition-all`}
                      placeholder={`Enter ${getMaxDigits()} digits`}
                      maxLength={getMaxDigits()}
                    />
                  </div>
                </div>
                {(errors.phone || fieldErrors.phone) && (
                  <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                    {errors.phone || fieldErrors.phone}
                  </p>
                )}
                <p className="text-gray-500 dark:text-white/50 text-xs">
                  {formData.phone.length} / {getMaxDigits()} digits
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border ${errors.company ? "border-red-500" : "border-gray-300 dark:border-white/40"
                    } bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:border-blue-500 dark:focus:border-white/70 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-white/20 outline-none transition-all`}
                  placeholder="Enter your company name"
                />
                {errors.company && (
                  <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                    {errors.company}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block">
                  Your Role <span className="text-red-500">*</span>
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border ${errors.role ? "border-red-500" : "border-gray-300 dark:border-white/40"
                    } bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:border-blue-500 dark:focus:border-white/70 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-white/20 outline-none transition-all`}
                  placeholder="E.g., Project Manager, Developer, etc."
                />
                {errors.role && (
                  <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                    {errors.role}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md border border-gray-300 dark:border-white/40 bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:border-blue-500 dark:focus:border-white/70 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-white/20 outline-none transition-all resize-none"
                  placeholder="Tell us about your requirements"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                disabled={status === "submitting"}

              >
               {status === "submitting" ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Submit"
                )}
              </button>

              <p className="text-xs text-center text-gray-600 dark:text-white/70">
                By submitting this form, you agree to our{" "}
                <a href="#" className="underline hover:text-gray-900 dark:hover:text-white">
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}