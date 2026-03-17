import { useState, useEffect } from "react";
import { userApi } from "../../../api/usersApi";
import { organizationApi } from "../../../api/organizationApi";
import { errorHandler } from "../../../api/errorHandler";
import "./menu.css";

export default function AddUserModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sites, setSites] = useState([]);

  // =============================
  // ROLE LIST
  // =============================
  const roleList = [
    "Super Admin",
    "Admin",
    "Manager",
    "Assistant Manager",
    "Head Chef",
    "Sous Chef",
    "Chef",
    "Cashier",
    "Waiter",
    "Host",
    "Inventory Manager",
    "Delivery Manager",
    "Support Staff",
  ];

  // =============================
  // USER TYPE ENUM
  // =============================
  const userTypeList = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERN", label: "Intern" },
    { value: "TEMPORARY", label: "Temporary" },
  ];

  // =============================
  // COUNTRY LIST
  // =============================
  const countryList = [
    { name: "India", code: "IN" },
    { name: "United States", code: "US" },
    { name: "United Kingdom", code: "GB" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
  ];

  // =============================
  // FORM STATE
  // =============================
  const [form, setForm] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    gender: "",
    dateOfBirth: "",
    profilePictureUrl: "",
    role: "",
    userType: "",
    siteId: "",
    addressLine: "",
    postalCode: "",
    countryCode: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // =============================
  // FETCH SITES
  // =============================
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await organizationApi.getAllSites();
        setSites(res);
      } catch (err) {
        console.error("Failed to load sites", err);
      }
    };

    fetchSites();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // =============================
  // VALIDATION
  // =============================
  const validateStep = () => {
    if (step === 1) {
      if (!form.userName.trim()) return "Username is required";
      if (!form.email.trim()) return "Email is required";
      if (!/^\S+@\S+\.\S+$/.test(form.email))
        return "Enter a valid email";
      if (!form.firstName.trim()) return "First name required";
      if (!form.lastName.trim()) return "Last name required";
      if (!form.role) return "Select role";
      if (!form.userType) return "Select user type";
      if (!form.siteId) return "Select site";
    }

    if (step === 2) {
      if (!form.contactNumber) return "Contact number required";
      if (form.contactNumber.length < 10)
        return "Contact number must be at least 10 digits";
      if (!form.gender) return "Select gender";
      if (!form.dateOfBirth) return "Date of birth required";
    }

    if (step === 3) {
      if (!form.addressLine.trim()) return "Address required";
      if (!form.city.trim()) return "City required";
      if (!form.state.trim()) return "State required";
      if (!form.countryCode) return "Select country";
    }

    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) return setError(err);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = async () => {
    const err = validateStep();
    if (err) return setError(err);

    setLoading(true);

    const payload = {
      userName: form.userName.trim(),
      email: form.email.trim(),

      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      contactNumber: form.contactNumber,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      profilePictureUrl: form.profilePictureUrl,

      userType: form.userType,
      siteId: form.siteId,
      role: form.role,

      address: {
        addressLine: form.addressLine,
        postalCode: form.postalCode,
        countryCode: form.countryCode,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
      },
    };

    try {
      await userApi.add(payload);
      alert("User created successfully ✅");
      onClose();
    } catch (err) {
      const e = errorHandler(err);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add User</h3>

        {error && <p className="error-text">{error}</p>}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input name="userName" placeholder="Username" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="firstName" placeholder="First Name" onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} />

            <select name="role" onChange={handleChange}>
              <option value="">Select Role</option>
              {roleList.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select name="userType" onChange={handleChange}>
              <option value="">Select User Type</option>
              {userTypeList.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <select name="siteId" onChange={handleChange}>
              <option value="">Select Site</option>
              {sites.map((s) => (
                <option key={s.siteId} value={s.siteId}>
                  {s.siteName || s.siteId}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={onClose}>Cancel</button>
              <button onClick={nextStep}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} />

            <select name="gender" onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input type="date" name="dateOfBirth" onChange={handleChange} />

            <div className="modal-actions">
              <button onClick={prevStep}>← Back</button>
              <button onClick={nextStep}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input name="addressLine" placeholder="Address Line" onChange={handleChange} />
            <input name="postalCode" placeholder="Postal Code" onChange={handleChange} />

            <select name="countryCode" onChange={handleChange}>
              <option value="">Select Country</option>
              {countryList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>

            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="state" placeholder="State" onChange={handleChange} />
            <input name="zipCode" placeholder="Zip Code" onChange={handleChange} />

            <div className="modal-actions">
              <button onClick={prevStep}>← Back</button>
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Create User"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}