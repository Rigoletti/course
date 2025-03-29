import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { FaCheck, FaGithub } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../assets/style/auth/CompleteGithubRegistration.css";

const CompleteGithubRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Authorization token missing");
      navigate("/authorization");
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.firstName.trim()) {
        errors.firstName = "Required field";
      } else if (!/^[a-zA-Zа-яА-Я\s-]+$/i.test(values.firstName)) {
        errors.firstName = "Only letters and hyphens";
      }
      
      if (!values.lastName.trim()) {
        errors.lastName = "Required field";
      } else if (!/^[a-zA-Zа-яА-Я\s-]+$/i.test(values.lastName)) {
        errors.lastName = "Only letters and hyphens";
      }
      
      if (!values.email) {
        errors.email = "Required field";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email format";
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/complete-github-registration",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem("token", response.data.token);
        toast.success("Registration completed! Redirecting...");
        
        // Force full page reload to apply all changes
        window.location.href = "/profile";
        
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.response?.data?.message || "Registration failed");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-dark text-white">
              <div className="d-flex align-items-center">
                <FaGithub className="me-2" size={24} />
                <h4 className="mb-0">Complete GitHub Registration</h4>
              </div>
            </div>
            
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <img 
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
                  alt="GitHub" 
                  width="80" 
                  className="mb-3"
                />
                <p className="text-muted">
                  Please provide additional information to complete registration
                </p>
              </div>
              
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`form-control ${
                      formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    placeholder="Your first name"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="invalid-feedback">{formik.errors.firstName}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`form-control ${
                      formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    placeholder="Your last name"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="invalid-feedback">{formik.errors.lastName}</div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${
                      formik.touched.email && formik.errors.email ? 'is-invalid' : ''
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder="Your email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting || !formik.isValid}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" 
                              role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCheck className="me-2" />
                        Complete Registration
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteGithubRegistration;