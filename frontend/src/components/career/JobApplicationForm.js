import React, { useState, useEffect } from 'react';
import { submitJobApplication } from '@/lib/api';
import Head from 'next/head';
 
export default function JobApplicationForm() {
  // Theme state - syncs with parent theme
  const [theme, setTheme] = useState('light');
  
  // State to handle form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    position: 'Frontend developer',
    experience: '',
    currentCompany: '',
    expectedSalary: '',
    noticePeriod: '',
    coverLetter: '',
    source: 'Career Portal',
    consent: false,
  });
 
  // State to handle file and submission status
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'submitting' | 'success' | 'error'
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phone: ''
  });

  // Detect theme changes from parent/system
  useEffect(() => {
    // Check for theme in localStorage or data attribute
    const detectTheme = () => {
      // Check multiple common theme storage methods
      const savedTheme = localStorage.getItem('theme');
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      const htmlClass = document.documentElement.className;
      const bodyClass = document.body.className;
      
      // Check for 'dark' in various places
      let currentTheme = 'light';
      
      if (savedTheme === 'dark' || 
          htmlTheme === 'dark' || 
          htmlClass.includes('dark') || 
          bodyClass.includes('dark') ||
          document.documentElement.classList.contains('dark') ||
          document.body.classList.contains('dark')) {
        currentTheme = 'dark';
      }
      
      setTheme(currentTheme);
    };

    // Initial detection
    detectTheme();

    // Watch for theme changes on html and body
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style']
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Also listen for storage events (theme change in another tab)
    window.addEventListener('storage', detectTheme);
    
    // Poll for changes as backup (in case MutationObserver misses something)
    const interval = setInterval(detectTheme, 500);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', detectTheme);
      clearInterval(interval);
    };
  }, []);
 
  // Phone number length rules by country code
  const phoneRules = {
    '+1': { min: 10, max: 10 },      // US, Canada
    '+7': { min: 10, max: 10 },      // Russia
    '+20': { min: 10, max: 10 },     // Egypt
    '+27': { min: 9, max: 9 },       // South Africa
    '+31': { min: 9, max: 9 },       // Netherlands
    '+32': { min: 9, max: 9 },       // Belgium
    '+33': { min: 9, max: 9 },       // France
    '+34': { min: 9, max: 9 },       // Spain
    '+39': { min: 10, max: 10 },     // Italy
    '+41': { min: 9, max: 9 },       // Switzerland
    '+44': { min: 10, max: 10 },     // UK
    '+45': { min: 8, max: 8 },       // Denmark
    '+46': { min: 9, max: 9 },       // Sweden
    '+47': { min: 8, max: 8 },       // Norway
    '+48': { min: 9, max: 9 },       // Poland
    '+49': { min: 10, max: 11 },     // Germany
    '+52': { min: 10, max: 10 },     // Mexico
    '+55': { min: 10, max: 11 },     // Brazil
    '+60': { min: 9, max: 10 },      // Malaysia
    '+61': { min: 9, max: 9 },       // Australia
    '+62': { min: 10, max: 12 },     // Indonesia
    '+63': { min: 10, max: 10 },     // Philippines
    '+64': { min: 9, max: 10 },      // New Zealand
    '+65': { min: 8, max: 8 },       // Singapore
    '+66': { min: 9, max: 9 },       // Thailand
    '+81': { min: 10, max: 10 },     // Japan
    '+82': { min: 9, max: 10 },      // South Korea
    '+84': { min: 9, max: 10 },      // Vietnam
    '+86': { min: 11, max: 11 },     // China
    '+90': { min: 10, max: 10 },     // Turkey
    '+91': { min: 10, max: 10 },     // India
    '+92': { min: 10, max: 10 },     // Pakistan
    '+93': { min: 9, max: 9 },       // Afghanistan
    '+94': { min: 9, max: 9 },       // Sri Lanka
    '+234': { min: 10, max: 10 },    // Nigeria
    '+254': { min: 9, max: 9 },      // Kenya
    '+351': { min: 9, max: 9 },      // Portugal
    '+353': { min: 9, max: 9 },      // Ireland
    '+852': { min: 8, max: 8 },      // Hong Kong
    '+880': { min: 10, max: 10 },    // Bangladesh
    '+886': { min: 9, max: 9 },      // Taiwan
    '+966': { min: 9, max: 9 },      // Saudi Arabia
    '+971': { min: 9, max: 9 },      // UAE
    '+972': { min: 9, max: 9 },      // Israel
    '+974': { min: 8, max: 8 },      // Qatar
  };

  // Handle text and checkbox changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear field errors when user modifies the field
    if (name === 'email' || name === 'phone') {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Phone number validation
    if (name === 'phone') {
      const digitOnly = value.replace(/\D/g, '');
      const rule = phoneRules[formData.countryCode];
      
      if (rule && digitOnly.length > rule.max) {
        return; // Don't update if exceeds max length
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: digitOnly,
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
 
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Clear any previous errors
    setError('');
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Resume file size must be less than 5MB. Please upload a smaller file.');
      setResume(null);
      e.target.value = ''; // Clear the input
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      setResume(null);
      e.target.value = ''; // Clear the input
      return;
    }

    // File is valid, set it
    setResume(file);
  };
 
  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    setFieldErrors({ email: '', phone: '' });
 
    // Validate consent checkbox
    if (!formData.consent) {
      setError('You must agree to the data processing terms.');
      setStatus('idle');
      return;
    }

    // Validate required fields - check for empty or whitespace-only values
    const requiredFields = ['fullName', 'email', 'phone', 'position'];
    const missingFields = requiredFields.filter(field => !formData[field] || !formData[field].trim());

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field => {
        switch(field) {
          case 'fullName': return 'Full Name';
          case 'email': return 'Email';
          case 'phone': return 'Phone';
          case 'position': return 'Position';
          default: return field;
        }
      });
      setError(`Please fill in all required fields: ${fieldNames.join(', ')}`);
      setStatus('idle');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      setStatus('idle');
      return;
    }

    // Validate phone number (not empty and correct length)
    if (!formData.phone || formData.phone.trim() === '') {
      setError('Phone number is required.');
      setStatus('idle');
      return;
    }

    const rule = phoneRules[formData.countryCode];
    if (rule && (formData.phone.length < rule.min || formData.phone.length > rule.max)) {
      setError(`Phone number for ${formData.countryCode} must be ${rule.min === rule.max ? rule.min : `${rule.min}-${rule.max}`} digits`);
      setStatus('idle');
      return;
    }

    // Validate resume upload - REQUIRED
    if (!resume) {
      setError('Resume is required. Please upload your resume (PDF, DOC, or DOCX format, max 5MB).');
      setStatus('idle');
      // Scroll to resume field
      const resumeField = document.getElementById('resume');
      if (resumeField) {
        resumeField.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Double-check file size (5MB) - this should have been caught in handleFileChange
    if (resume.size > 5 * 1024 * 1024) {
      setError('Resume file size must be less than 5MB. Please upload a smaller file.');
      setStatus('idle');
      setResume(null);
      const fileInput = document.getElementById('resume');
      if (fileInput) fileInput.value = '';
      return;
    }

    // Double-check file type - this should have been caught in handleFileChange
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resume.type)) {
      setError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      setStatus('idle');
      setResume(null);
      const fileInput = document.getElementById('resume');
      if (fileInput) fileInput.value = '';
      return;
    }

    try {
      setStatus('submitting');

      // Log form data for debugging
      console.log('Form data being submitted:', {
        ...formData,
        resume: resume ? `${resume.name} (${(resume.size / 1024 / 1024).toFixed(2)} MB)` : 'No resume'
      });
     
      // Submit the form
      const payloadData = {
        ...formData,
        phone: `${formData.countryCode}${formData.phone}`
      };

      const result = await submitJobApplication(payloadData, resume);

      if (result.success) {
        setStatus('success');
        // Reset form after successful submission
        setFormData({
          fullName: '',
          email: '',
          countryCode: '+91',
          phone: '',
          position: 'Frontend developer',
          experience: '',
          currentCompany: '',
          expectedSalary: '',
          noticePeriod: '',
          coverLetter: '',
          source: 'Career Portal',
          consent: false,
        });
        setResume(null);
        setFieldErrors({ email: '', phone: '' });
        // Clear file input
        const fileInput = document.getElementById('resume');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setStatus('error');
     
      // Handle duplicate email/phone errors
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        
        // Check if it's an email duplicate error
        if (errorData.message === 'Email already exists' || 
            errorData.error?.toLowerCase().includes('email')) {
          setFieldErrors(prev => ({
            ...prev,
            email: errorData.error || 'This email address has already been used for an application.'
          }));
          setError('Please use a different email address.');
        } 
        // Check if it's a phone duplicate error
        else if (errorData.message === 'Phone number already exists' || 
                 errorData.error?.toLowerCase().includes('phone')) {
          setFieldErrors(prev => ({
            ...prev,
            phone: errorData.error || 'This phone number has already been used for an application.'
          }));
          setError('Please use a different phone number.');
        }
        // Generic duplicate error
        else if (errorData.message === 'Duplicate entry') {
          if (errorData.field === 'email') {
            setFieldErrors(prev => ({
              ...prev,
              email: errorData.error || 'This email address has already been used for an application.'
            }));
            setError('Please use a different email address.');
          } else if (errorData.field === 'phone') {
            setFieldErrors(prev => ({
              ...prev,
              phone: errorData.error || 'This phone number has already been used for an application.'
            }));
            setError('Please use a different phone number.');
          } else {
            setError(errorData.error || 'This information has already been used for an application.');
          }
        } else {
          setError(errorData.error || 'A duplicate entry was detected. Please check your information.');
        }
      } else {
        // Provide more user-friendly error messages for other errors
        let errorMessage = 'An error occurred while submitting the application. Please try again.';
       
        if (error.message.includes('NetworkError')) {
          errorMessage = 'Cannot connect to the server. Please check your internet connection.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later or contact support if the problem persists.';
        } else if (error.message) {
          errorMessage = error.message;
        }
       
        setError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <>
      <Head>
        <title>Job Application</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
 
      <div className={`form-container ${theme}`}>
          <div className="form-header">
            <h2>Job Application</h2>
          </div>
 
          {status === 'success' ? (
            <div className="success-message">
              <h3>Application Submitted!</h3>
              <p>Thank you for applying. We will be in touch shortly.</p>
              <button onClick={() => window.location.reload()} className="submit-btn" style={{marginTop: '20px', width: 'auto', padding: '10px 30px'}}>
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className={fieldErrors.email ? 'input-error' : ''}
                  />
                  {fieldErrors.email && (
                    <span className="field-error-text">{fieldErrors.email}</span>
                  )}
                </div>
              </div>
 
              {/* Row 2 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone <span className="required">*</span></label>
                  <div className="phone-input-group">
                    <select 
                      id="countryCode"
                      name="countryCode"
                      autoComplete="tel-country-code"
                      value={formData.countryCode} 
                      onChange={handleInputChange}
                      className="country-code-select"
                      aria-label="Country code"
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
                      autoComplete="tel-national"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className={`phone-number-input ${fieldErrors.phone ? 'input-error' : ''}`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <span className="field-error-text">{fieldErrors.phone}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="position">Position <span className="required">*</span></label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    autoComplete="organization-title"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
 
              {/* Row 3 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <div className="select-wrapper">
                    <select id="experience" name="experience" value={formData.experience} onChange={handleInputChange}>
                      <option value="" disabled>Select experience</option>
                      <option value="0-1">0-1 Years</option>
                      <option value="2-5">2-5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="currentCompany">Current Company</label>
                  <input
                    id="currentCompany"
                    name="currentCompany"
                    type="text"
                    autoComplete="organization"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
 
              {/* Row 4 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expectedSalary">Expected Salary</label>
                  <input
                    id="expectedSalary"
                    name="expectedSalary"
                    type="number"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="noticePeriod">Notice Period</label>
                  <div className="select-wrapper">
                    <select id="noticePeriod" name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange}>
                      <option value="" disabled>Select notice period</option>
                      <option value="Immediate">Immediate</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>
                </div>
              </div>
 
              {/* Row 5: Resume Upload */}
              <div className="form-group full-width mb-15">
                <label htmlFor="resume-label">Resume <span className="required">*</span></label>
                <label htmlFor="resume" className="file-upload">
                  <span className="upload-text">
                    {resume ? `✓ ${resume.name}` : "Click to upload or drag and drop"}
                  </span>
                  <span className="upload-subtext">PDF, DOC, DOCX up to 5MB (Required)</span>
                  {resume && (
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setResume(null);
                        setError('');
                        const fileInput = document.getElementById('resume');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="remove-file-btn"
                      aria-label="Remove file"
                    >
                      ✕ Remove
                    </button>
                  )}
                  <input 
                    id="resume"
                    type="file" 
                    autoComplete="off" 
                    className="hidden-input" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    aria-label="Resume upload"
                    aria-required="true"
                  />
                </label>
              </div>
 
              {/* Row 6: Cover Letter */}
              <div className="form-group full-width mb-15">
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows="4"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Introduce yourself..."
                />
              </div>
 
              {/* Row 7: Source */}
              <div className="form-group half-width mb-10">
                <label htmlFor="source">How did you hear about us?</label>
                <div className="select-wrapper">
                  <select id="source" name="source" value={formData.source} onChange={handleInputChange}>
                    <option value="Career Portal">Career Portal</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>
 
              {/* Row 8: Consent */}
              <div className="checkbox-group">
                <input
                  name="consent"
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                />
                <label htmlFor="consent">
                  I agree to the processing of my personal data for recruitment purposes <span className="required">*</span>
                </label>
              </div>
 
              {/* Row 9: Submit */}
              <button
                type="submit"
                className="submit-btn"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </button>
             
              {error && (
                <p className="error-text">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
 
       <style jsx>{`
        /* DARK THEME VARIABLES */
        .form-container.dark {
          --bg-page: #0d1117;
          --bg-card: #161b22;
          --border-color: #30363d;
          --text-primary: #c9d1d9;
          --text-secondary: #8b949e;
          --input-bg: #0d1117;
          --input-border: #4a5259;
          --primary-blue: #1f6feb;
          --primary-green: #238636;
          --primary-green-hover: #2ea043;
          --danger: #f85149;
          --success: #3fb950;
          --placeholder: #484f58;
          --hover-bg: #13171f;
          --disabled-bg: #21262d;
          --disabled-text: #8b949e;
          --shadow: rgba(0, 0, 0, 0.5);
        }

        /* LIGHT THEME VARIABLES */
        .form-container.light {
          --bg-page: #f6f8fa;
          --bg-card: #ffffff;
          --border-color: #d0d7de;
          --text-primary: #24292f;
          --text-secondary: #57606a;
          --input-bg: #ffffff;
          --input-border: #b1b9c1;
          --primary-blue: #0969da;
          --primary-green: #1a7f37;
          --primary-green-hover: #2da44e;
          --danger: #cf222e;
          --success: #1a7f37;
          --placeholder: #6e7781;
          --hover-bg: #f6f8fa;
          --disabled-bg: #f6f8fa;
          --disabled-text: #57606a;
          --shadow: rgba(0, 0, 0, 0.1);
        }
 
        .form-container {
          background: var(--bg-card);
          width: 100%;
          max-width: 700px;
          border-radius: 8px;
          padding: 30px;
          position: relative;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 12px var(--shadow);
          transition: all 0.3s ease;
          margin: 0 auto;
          box-sizing: border-box;
        }
 
        .form-header {
          margin-bottom: 25px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 15px;
        }
 
        .form-header h2 {
          font-size: 24px;
          color: var(--text-primary);
          font-weight: 600;
          margin: 0;
        }
 
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }
 
        .form-group {
          display: flex;
          flex-direction: column;
        }
 
        .full-width {
          grid-column: 1 / -1;
        }

        .half-width {
          grid-column: 1 / 2;
          max-width: 100%;
        }
 
        .mb-15 { margin-bottom: 15px; }
        .mb-10 { margin-bottom: 10px; }
 
        label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
          font-weight: 500;
        }
 
        .required {
          color: var(--danger);
          margin-left: 2px;
        }
 
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"],
        select,
        textarea {
          padding: 10px 12px;
          border: 1px solid var(--input-border);
          background-color: var(--input-bg);
          border-radius: 6px;
          font-size: 15px;
          color: var(--text-primary);
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s;
          box-sizing: border-box;
        }

        /* Error state for inputs */
        .input-error {
          border-color: var(--danger) !important;
        }

        .input-error:focus {
          border-color: var(--danger) !important;
        }

        .form-container.dark .input-error:focus {
          box-shadow: 0 0 0 3px rgba(248, 81, 73, 0.3) !important;
        }

        .form-container.light .input-error:focus {
          box-shadow: 0 0 0 3px rgba(207, 34, 46, 0.3) !important;
        }

        .field-error-text {
          color: var(--danger);
          font-size: 12px;
          margin-top: 6px;
          display: block;
          line-height: 1.4;
        }
 
        input:focus, select:focus, textarea:focus {
          border-color: var(--primary-blue);
        }

        .form-container.dark input:focus, 
        .form-container.dark select:focus, 
        .form-container.dark textarea:focus {
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3);
        }

        .form-container.light input:focus, 
        .form-container.light select:focus, 
        .form-container.light textarea:focus {
          box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
        }
       
        input::placeholder, textarea::placeholder {
          color: var(--placeholder);
        }

        .phone-input-group {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .country-code-select {
          flex: 0 0 100px;
          min-width: 85px;
          padding: 10px 8px;
          border: 1px solid var(--input-border);
          background-color: var(--input-bg);
          border-radius: 6px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
        }

        .country-code-select option {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
          padding: 8px;
          background-color: var(--input-bg);
          color: var(--text-primary);
        }

        .phone-number-input {
          flex: 1;
          min-width: 0;
          padding: 10px 12px;
          border: 1px solid var(--input-border);
          background-color: var(--input-bg);
          border-radius: 6px;
          font-size: 15px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s;
        }

        .phone-number-input::placeholder {
          color: var(--placeholder);
        }

        .country-code-select:focus {
          border-color: var(--primary-blue);
        }

        .phone-number-input:focus {
          border-color: var(--primary-blue);
        }

        .form-container.dark .country-code-select:focus {
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3);
        }

        .form-container.dark .phone-number-input:focus {
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3);
        }

        .form-container.light .country-code-select:focus {
          box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
        }

        .form-container.light .phone-number-input:focus {
          box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
        }
 
        .file-upload {
          border: 2px dashed var(--border-color);
          border-radius: 6px;
          padding: 30px;
          text-align: center;
          background-color: var(--input-bg);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          display: block;
        }
 
        .file-upload:hover {
          border-color: var(--text-secondary);
          background-color: var(--hover-bg);
        }
 
        .upload-text {
          color: var(--primary-blue);
          font-weight: 500;
          margin-bottom: 5px;
          display: block;
          word-break: break-word;
        }
 
        .upload-subtext {
          color: var(--text-secondary);
          font-size: 12px;
          display: block;
        }
 
        .hidden-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .remove-file-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--danger);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 5px 10px;
          font-size: 12px;
          cursor: pointer;
          transition: opacity 0.2s;
          z-index: 10;
        }

        .remove-file-btn:hover {
          opacity: 0.8;
        }
 
        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 20px 0;
        }
 
        .checkbox-group input {
          margin-top: 4px;
          accent-color: var(--primary-blue);
          flex-shrink: 0;
          width: 16px;
          height: 16px;
        }
 
        .checkbox-group label {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
 
        .submit-btn {
          background-color: var(--primary-green);
          color: white;
          border: 1px solid rgba(240, 246, 252, 0.1);
          width: 100%;
          max-width: 250px;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          display: block;
          margin: 0 auto;
        }
 
        .submit-btn:hover:not(:disabled) {
          background-color: var(--primary-green-hover);
        }
       
        .submit-btn:disabled {
          background-color: var(--disabled-bg);
          color: var(--disabled-text);
          cursor: not-allowed;
          opacity: 0.6;
        }
       
        .success-message {
          text-align: center;
          color: var(--success);
          padding: 40px 20px;
        }

        .success-message h3 {
          color: var(--text-primary);
          margin-bottom: 10px;
          font-size: 22px;
        }

        .success-message p {
          color: var(--text-secondary);
          font-size: 15px;
        }
       
        .error-text {
          color: var(--danger);
          text-align: center;
          margin-top: 15px;
          font-size: 14px;
          line-height: 1.5;
        }

        /* ============================================
           RESPONSIVE BREAKPOINTS
           ============================================ */

        /* Tablet (Portrait & Small Landscape) - 768px and below */
        @media (max-width: 768px) {
          .form-container {
            padding: 25px;
            border-radius: 6px;
          }

          .form-header h2 {
            font-size: 22px;
          }

          .form-row {
            gap: 15px;
          }

          .half-width {
            max-width: 100%;
          }

          .submit-btn {
            max-width: 200px;
            padding: 11px 20px;
          }
        }

        /* Mobile (Large phones) - 600px and below */
        @media (max-width: 600px) {
          .form-container {
            padding: 20px;
            margin: 10px;
            max-width: calc(100% - 20px);
          }

          .form-header {
            margin-bottom: 20px;
            padding-bottom: 12px;
          }

          .form-header h2 {
            font-size: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 12px;
          }

          .half-width {
            grid-column: 1 / -1;
          }

          label {
            font-size: 13px;
            margin-bottom: 6px;
          }

          input[type="text"],
          input[type="email"],
          input[type="tel"],
          input[type="number"],
          select,
          textarea {
            padding: 9px 11px;
            font-size: 14px;
          }

          .country-code-select {
            flex: 0 0 90px;
            min-width: 75px;
            font-size: 13px;
            padding: 9px 6px;
          }

          .phone-number-input {
            font-size: 14px;
          }

          .file-upload {
            padding: 20px;
          }

          .upload-text {
            font-size: 14px;
          }

          .upload-subtext {
            font-size: 11px;
          }

          .checkbox-group {
            margin: 15px 0;
          }

          .checkbox-group label {
            font-size: 12px;
          }

          .submit-btn {
            width: 100%;
            max-width: 100%;
            padding: 12px 20px;
            font-size: 14px;
          }

          .success-message {
            padding: 30px 15px;
          }

          .success-message h3 {
            font-size: 20px;
          }

          .success-message p {
            font-size: 14px;
          }

          .error-text {
            font-size: 13px;
            margin-top: 12px;
          }

          .field-error-text {
            font-size: 11px;
            margin-top: 5px;
          }

          .remove-file-btn {
            font-size: 11px;
            padding: 4px 8px;
          }
        }

        /* Small Mobile - 400px and below */
        @media (max-width: 400px) {
          .form-container {
            padding: 16px;
            margin: 8px;
            max-width: calc(100% - 16px);
          }

          .form-header h2 {
            font-size: 18px;
          }

          .form-row {
            gap: 10px;
            margin-bottom: 10px;
          }

          input[type="text"],
          input[type="email"],
          input[type="tel"],
          input[type="number"],
          select,
          textarea {
            padding: 8px 10px;
            font-size: 14px;
          }

          .country-code-select {
            flex: 0 0 80px;
            min-width: 70px;
            font-size: 12px;
            padding: 8px 4px;
          }

          .phone-input-group {
            gap: 6px;
          }

          .file-upload {
            padding: 16px;
          }

          .upload-text {
            font-size: 13px;
          }

          .upload-subtext {
            font-size: 10px;
          }

          .checkbox-group input {
            width: 14px;
            height: 14px;
          }

          .submit-btn {
            padding: 11px 18px;
            font-size: 14px;
          }

          .success-message {
            padding: 25px 12px;
          }

          .success-message h3 {
            font-size: 18px;
          }

          .success-message p {
            font-size: 13px;
          }

          .remove-file-btn {
            font-size: 10px;
            padding: 3px 6px;
          }
        }

        /* Extra small screens - 320px and below */
        @media (max-width: 320px) {
          .form-container {
            padding: 12px;
            margin: 5px;
            max-width: calc(100% - 10px);
          }

          .form-header {
            margin-bottom: 15px;
            padding-bottom: 10px;
          }

          .form-header h2 {
            font-size: 16px;
          }

          .country-code-select {
            flex: 0 0 70px;
            min-width: 65px;
            font-size: 11px;
          }

          .phone-input-group {
            gap: 5px;
          }
        }

        /* Landscape orientation optimizations for phones */
        @media (max-height: 500px) and (orientation: landscape) {
          .form-container {
            padding: 15px;
          }

          .form-header {
            margin-bottom: 15px;
          }

          .form-row {
            margin-bottom: 10px;
          }

          .mb-15 { margin-bottom: 10px; }
          .mb-10 { margin-bottom: 8px; }

          .file-upload {
            padding: 15px;
          }

          .checkbox-group {
            margin: 12px 0;
          }
        }
      `}</style>
     
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Ensure proper touch target size on mobile */
        @media (max-width: 600px) {
          input, select, textarea, button {
            min-height: 44px; /* iOS recommended touch target */
          }
        }
      `}</style>
    </>
  );
}