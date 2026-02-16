import { useState, useMemo } from "react";
import { userApi } from "../../../api/usersApi";
import { errorHandler } from "../../../api/errorHandler";
import "./menu.css";

export default function AddUserModal({ onClose }) {
  const organizationId = localStorage.getItem("organizationId");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =============================
  // ROLE LIST (Restaurant System)
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
  // COUNTRY LIST (20+ Countries)
  // =============================
  const countryList = [
    { name: "India", code: "IN" },
    { name: "United States", code: "US" },
    { name: "United Kingdom", code: "GB" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
    { name: "Italy", code: "IT" },
    { name: "Spain", code: "ES" },
    { name: "Brazil", code: "BR" },
    { name: "Mexico", code: "MX" },
    { name: "Japan", code: "JP" },
    { name: "China", code: "CN" },
    { name: "South Korea", code: "KR" },
    { name: "Singapore", code: "SG" },
    { name: "Malaysia", code: "MY" },
    { name: "UAE", code: "AE" },
    { name: "South Africa", code: "ZA" },
    { name: "Netherlands", code: "NL" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
  ];

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
    addressLine: "",
    postalCode: "",
    countryCode: "",
    city: "",
    state: "",
    zipCode: "",
  });

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
      if (!form.role) return "Please select a role";
    }

    if (step === 2) {
      if (!form.contactNumber) return "Contact number required";
      if (form.contactNumber.length < 10)
        return "Contact number must be at least 10 digits";
      if (!form.gender) return "Please select gender";
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
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
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
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

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
      organizationId,
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
      const standardizedError = errorHandler(err);
      setError(standardizedError.message);
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

            <select name="role" onChange={handleChange} value={form.role}>
              <option value="">Select Role</option>
              {roleList.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn-primary" onClick={nextStep}>
                Next →
              </button>
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
            <input name="profilePictureUrl" placeholder="Profile Image URL" onChange={handleChange} />

            <div className="modal-actions">
              <button className="btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button className="btn-primary" onClick={nextStep}>
                Next →
              </button>
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
                  {c.name} ({c.code})
                </option>
              ))}
            </select>

            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="state" placeholder="State" onChange={handleChange} />
            <input name="zipCode" placeholder="Zip Code" onChange={handleChange} />

            <div className="modal-actions">
              <button className="btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Create User"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
