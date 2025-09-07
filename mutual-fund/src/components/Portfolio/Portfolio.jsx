import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/constants";
import "./Portfolio.css";

function Portfolio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Set axios header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Make API calls
    const summaryReq = axios.get(`${API_BASE_URL}/portfolio/summary`);
    const investmentsReq = axios.get(`${API_BASE_URL}/investments`);

    Promise.all([summaryReq, investmentsReq])
      .then(([summaryRes, investmentsRes]) => {
        console.log("Summary Response:", summaryRes.data);
        console.log("Investments Response:", investmentsRes.data);
        
        // Handle summary data
        setSummary(summaryRes.data.data || summaryRes.data || {});
        
        // Handle investments data - extract from the 'data' property
        const investmentsData = investmentsRes.data.data || investmentsRes.data || [];
        setInvestments(Array.isArray(investmentsData) ? investmentsData : []);
      })
      .catch((err) => {
        console.error("Failed to load portfolio data:", err);
        setError(`Failed to load portfolio: ${err.message}`);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const handleBrowseFunds = () => navigate("/investments/new");

  if (loading) {
    return <div style={{padding: "20px", textAlign: "center"}}>Loading portfolio...</div>;
  }

  if (error) {
    return (
      <div style={{padding: "20px", textAlign: "center", color: "red"}}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <header className="topbar" style={{padding: "10px", backgroundColor: "#f5f5f5", display: "flex", justifyContent: "space-between"}}>
        <div className="brand">MutualFund Pro</div>
        <div className="top-actions">
          <button onClick={handleBrowseFunds} style={{margin: "0 5px"}}>
            Browse Funds
          </button>
          <button onClick={handleLogout} style={{margin: "0 5px"}}>
            Logout
          </button>
        </div>
      </header>

      <main style={{padding: "20px"}}>
        <h1>Portfolio Overview</h1>

        <section style={{display: "flex", gap: "20px", marginBottom: "30px"}}>
          <div style={{border: "1px solid #ccc", padding: "15px", borderRadius: "5px"}}>
            <div>Total Investments</div>
            <div style={{fontSize: "24px", fontWeight: "bold"}}>{summary?.total_investments ?? 0}</div>
          </div>

          <div style={{border: "1px solid #ccc", padding: "15px", borderRadius: "5px"}}>
            <div>Total Invested Amount</div>
            <div style={{fontSize: "24px", fontWeight: "bold"}}>₹{summary?.total_amount ?? 0}</div>
          </div>

          <div style={{border: "1px solid #ccc", padding: "15px", borderRadius: "5px"}}>
            <div>Current Value</div>
            <div style={{fontSize: "24px", fontWeight: "bold"}}>₹{summary?.total_value ?? 0}</div>
          </div>

          <div style={{border: "1px solid #ccc", padding: "15px", borderRadius: "5px"}}>
            <div>Gain/Loss</div>
            <div style={{fontSize: "24px", fontWeight: "bold", color: summary?.gain_loss < 0 ? "red" : "green"}}>
              ₹{summary?.gain_loss ?? 0}
            </div>
          </div>

          <div style={{border: "1px solid #ccc", padding: "15px", borderRadius: "5px"}}>
            <div>Returns</div>
            <div style={{fontSize: "24px", fontWeight: "bold"}}>{summary?.returns_pct ?? 0}%</div>
          </div>
        </section>

        <section>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
            <h2>Your Investments</h2>
            <button onClick={() => navigate("/investments/new")} style={{padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px"}}>
              + New Investment
            </button>
          </div>

          {!Array.isArray(investments) || investments.length === 0 ? (
            <div style={{textAlign: "center", padding: "40px"}}>
              <div style={{fontSize: "48px", marginBottom: "16px"}}>📊</div>
              <h3>No Investments Yet</h3>
              <p>Start your investment journey by browsing our fund collection.</p>
            </div>
          ) : (
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px"}}>
              {investments.map((inv, index) => (
                <div key={inv.id || index} style={{border: "1px solid #ccc", padding: "15px", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"}}>
                  <div style={{marginBottom: "15px"}}>
                    <div style={{fontWeight: "bold", fontSize: "16px", marginBottom: "5px"}}>
                      {inv.scheme_name || "Unknown Fund"}
                    </div>
                    <div style={{fontSize: "12px", color: "#666"}}>
                      {inv.scheme_code} • {inv.fund_family}
                    </div>
                    <div style={{fontSize: "11px", color: "#888", marginTop: "2px"}}>
                      {inv.fund_type}
                    </div>
                  </div>
                  
                  <div style={{borderTop: "1px solid #eee", paddingTop: "10px"}}>
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                      <span style={{color: "#666"}}>Units</span>
                      <span style={{fontWeight: "500"}}>{inv.units || 0}</span>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                      <span style={{color: "#666"}}>Invested Amount</span>
                      <span style={{fontWeight: "500"}}>₹{inv.amount || 0}</span>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                      <span style={{color: "#666"}}>Purchase NAV</span>
                      <span style={{fontWeight: "500"}}>₹{inv.purchased_nav || 0}</span>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                      <span style={{color: "#666"}}>Current Value</span>
                      <span style={{fontWeight: "500"}}>₹{inv.current_value || 0}</span>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                      <span style={{color: "#666"}}>Gain/Loss</span>
                      <span style={{
                        fontWeight: "500", 
                        color: inv.gain_loss < 0 ? "red" : "green"
                      }}>
                        ₹{inv.gain_loss || 0}
                      </span>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <span style={{color: "#666"}}>Returns</span>
                      <span style={{
                        fontWeight: "500", 
                        color: inv.returns_pct < 0 ? "red" : "green"
                      }}>
                        {inv.returns_pct || 0}%
                      </span>
                    </div>
                  </div>
                  
                  {inv.updated_at && (
                    <div style={{marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #eee"}}>
                      <div style={{fontSize: "11px", color: "#888"}}>
                        Updated: {new Date(inv.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Portfolio;