import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import { siteApi } from "../../../api/siteApi";
import "./siteDetails.css";

export default function SiteDetails() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await siteApi.getById(siteId);
        setSite(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSite();
  }, [siteId]);

  if (!site) return <p style={{ padding: "20px" }}>Loading...</p>;

  // 🔥 Build full address string
  const fullAddress = `
    ${site.address?.addressLine || ""},
    ${site.address?.city || ""},
    ${site.address?.state || ""},
    ${site.address?.countryCode || ""}
  `;

  return (
    <DashboardLayout>
      <div className="site-details-page">

        {/* HEADER */}
        <div className="site-header">
          <h2>{site.siteName}</h2>
          <p>{fullAddress}</p>
        </div>

        {/* INFO CARDS */}
        <div className="site-info-grid">
  <div className="card">
    <h4>City</h4>
    <p>{site?.address?.city || "N/A"}</p>
  </div>

  <div className="card">
    <h4>State</h4>
    <p>{site?.address?.state || "N/A"}</p>
  </div>

  <div className="card">
    <h4>Postal Code</h4>
    <p>{site?.address?.postalCode || "N/A"}</p>
  </div>

  <div className="card">
    <h4>Open Time</h4>
    <p>{site?.openTime || "N/A"}</p>
  </div>

  <div className="card">
    <h4>Close Time</h4>
    <p>{site?.closeTime || "N/A"}</p>
  </div>
</div>

        {/* GOOGLE MAP USING ADDRESS */}
        <div className="map-container">
          <iframe
            title="map"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "12px" }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
          ></iframe>
        </div>

      </div>
    </DashboardLayout>
  );
}