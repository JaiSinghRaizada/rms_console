import { useState, useRef } from "react";
import { siteApi } from "../../../api/siteApi";
import { Input } from "../../../common/FormTemplate";
import Modal from "../../../common/modal/Modal";
import SuccessToast from "../../../common/SuccessToast";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import "./sites.css";
import locationIcon from "../../../assets/location.png";

const libraries = ["places"];

export default function AddSiteModal({ onClose }) {
  const autocompleteRef = useRef(null);

  const [siteName, setSiteName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =============================
  // GOOGLE AUTOCOMPLETE SELECT
  // =============================
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (!place || !place.address_components) {
      setError("Please select a valid location from suggestions");
      return;
    }

    extractAddress(place);
  };

  // =============================
  // EXTRACT ADDRESS FUNCTION
  // =============================
  const extractAddress = (place) => {
    let cityValue = "";
    let stateValue = "";
    let postalValue = "";
    let countryValue = "";

    place.address_components.forEach((component) => {
      const types = component.types;

      if (types.includes("locality")) {
        cityValue = component.long_name;
      }

      if (types.includes("administrative_area_level_1")) {
        stateValue = component.long_name;
      }

      if (types.includes("postal_code")) {
        postalValue = component.long_name;
      }

      if (types.includes("country")) {
        countryValue = component.short_name;
      }
    });

    setAddressLine(place.formatted_address);
    setCity(cityValue);
    setState(stateValue);
    setPostalCode(postalValue);
    setZipCode(postalValue);
    setCountryCode(countryValue);
  };

  // =============================
  // LOCATE ME FUNCTION
const handleLocateMe = () => {
  console.log("Locate button clicked");

  if (!navigator.geolocation) {
    setError("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("Location fetched:", position);

      const { latitude, longitude } = position.coords;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      if (!window.google || !window.google.maps) {
        console.log("Google not loaded yet");
        setError("Google Maps not loaded yet.");
        return;
      }

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          console.log("Geocode status:", status);
          console.log("Geocode results:", results);

          if (status === "OK" && results.length > 0) {

            // ✅ Better result selection (avoid plus codes)
            const bestResult =
              results.find(r => r.types.includes("street_address")) ||
              results.find(r => r.types.includes("premise")) ||
              results.find(r => r.types.includes("route")) ||
              results[0];

            extractAddress(bestResult);

          } else {
            setError("Unable to fetch address from location.");
          }
        }
      );
    },
    (error) => {
      console.log("Geolocation error:", error);
      setError("Permission denied or location unavailable.");
    },
    {
      enableHighAccuracy: true,  // ✅ Properly placed now
      timeout: 15000,
      maximumAge: 0,
    }
  );
};

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const organizationId = localStorage.getItem("organizationId");

    if (!organizationId) {
      setError("Organization ID not found");
      return;
    }

    if (!openTime) {
      setError("Open time is required");
      return;
    }

    if (!closeTime) {
      setError("Close time is required");
      return;
    }

    if (!addressLine) {
      setError("Please select location from Google suggestions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        siteName,
        organizationId,
        address: {
          addressLine,
          city,
          state,
          postalCode,
          zipCode,
          countryCode,
        },
        openTime,
        closeTime,
      };

      await siteApi.addSite(payload);

      setSuccess("Site created successfully ✅");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create site"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessToast message={success} />

      <Modal title="Add Site">
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />

 <Autocomplete
  onLoad={(ref) => (autocompleteRef.current = ref)}
  onPlaceChanged={onPlaceChanged}
>
  <div className="location-input-wrapper">
    <input
      type="text"
      placeholder="Search Location"
      className="google-input"
      value={addressLine}
      onChange={(e) => setAddressLine(e.target.value)}
    />

    <button
      type="button"
      onClick={handleLocateMe}
      className="locate-btn"
      title="Locate Me"
    >
      <img
        src={locationIcon}
        alt="Locate"
        className="locate-icon"
      />
    </button>
  </div>
</Autocomplete>

            
         
<br />
<br />
          <div className="time-row">
            <div>
              <label>Open Time</label>
              <Input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>

            <div>
              <label>Close Time</label>
              <Input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Site"}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}