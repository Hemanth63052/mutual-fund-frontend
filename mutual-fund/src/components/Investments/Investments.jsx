import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/constants";
import "./Investments.css";

function NewInvestment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fundSchemes, setFundSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Modal states for buy functionality
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Set axios header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch fund schemes
    axios.get(`${API_BASE_URL}/fund-families`)
      .then((response) => {
        const schemesData = response.data.data || [];
        setFundSchemes(schemesData);
        setFilteredSchemes(schemesData);
      })
      .catch((err) => {
        console.error("Failed to load fund schemes:", err);
        setError(`Failed to load fund schemes: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Filter schemes based on search and fund type
  useEffect(() => {
    let filtered = fundSchemes;

    if (searchTerm) {
      filtered = filtered.filter(scheme => 
        scheme.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.fund_family.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.scheme_code.includes(searchTerm)
      );
    }

    if (filterType) {
      filtered = filtered.filter(scheme => 
        scheme.fund_type.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    setFilteredSchemes(filtered);
  }, [searchTerm, filterType, fundSchemes]);

  const handleBuyClick = (scheme) => {
    setSelectedScheme(scheme);
    setInvestmentAmount('');
    setShowBuyModal(true);
  };

  const handleCloseBuyModal = () => {
    setShowBuyModal(false);
    setSelectedScheme(null);
    setInvestmentAmount('');
    setError(null);
  };

  const handleCreateInvestment = async () => {
    if (!selectedScheme || !investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const payload = {
        scheme_id: selectedScheme.id,
        amount: parseFloat(investmentAmount)
      };

      await axios.post(`${API_BASE_URL}/investment`, payload);
      
      setSuccess(true);
      setShowBuyModal(false);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        navigate("/portfolio");
      }, 2000);
      
    } catch (err) {
      console.error("Failed to create investment:", err);
      setError(`Failed to create investment: ${err.response?.data?.message || err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const calculateUnits = () => {
    if (!selectedScheme || !investmentAmount || parseFloat(investmentAmount) <= 0) return 0;
    return (parseFloat(investmentAmount) / selectedScheme.nav).toFixed(4);
  };

  if (loading) {
    return <div className="loading-message">Loading fund schemes...</div>;
  }

  if (success) {
    return (
      <div className="success-message">
        <div className="success-text">
          Investment created successfully!
        </div>
        <div>Redirecting to portfolio...</div>
      </div>
    );
  }

  return (
    <div className="new-investment-page">
      <header className="new-investment-header">
        <h1>Available Fund Schemes</h1>
        <div>
          <button onClick={() => navigate("/portfolio")} className="back-button">
            Back to Portfolio
          </button>
        </div>
      </header>

      {error && !showBuyModal && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search schemes by name, family, or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Fund Types</option>
          <option value="equity">Equity</option>
          <option value="debt">Debt</option>
          <option value="hybrid">Hybrid</option>
          <option value="open">Open Ended</option>
        </select>
      </div>

      {/* Fund Schemes Table */}
      <div className="table-container">
        {filteredSchemes.length === 0 ? (
          <div className="no-schemes-message">
            No fund schemes found matching your criteria
          </div>
        ) : (
          <table className="fund-schemes-table">
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Fund Family</th>
                <th>Scheme Code</th>
                <th>Fund Type</th>
                <th>NAV (₹)</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchemes.map((scheme) => (
                <tr key={scheme.id}>
                  <td className="scheme-name">{scheme.scheme_name}</td>
                  <td className="fund-family">{scheme.fund_family}</td>
                  <td className="scheme-code">{scheme.scheme_code}</td>
                  <td className="fund-type">{scheme.fund_type}</td>
                  <td className="nav-value">₹{scheme.nav.toFixed(4)}</td>
                  <td className="updated-date">
                    {new Date(scheme.updated_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleBuyClick(scheme)}
                      className="buy-button"
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="modal-overlay">
          <div className="buy-modal">
            <div className="modal-header">
              <h3>Buy Investment</h3>
              <button 
                onClick={handleCloseBuyModal}
                className="modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              {selectedScheme && (
                <div className="selected-scheme-info">
                  <div className="scheme-detail">
                    <strong>Scheme:</strong> {selectedScheme.scheme_name}
                  </div>
                  <div className="scheme-detail">
                    <strong>Fund Family:</strong> {selectedScheme.fund_family}
                  </div>
                  <div className="scheme-detail">
                    <strong>Current NAV:</strong> ₹{selectedScheme.nav.toFixed(4)}
                  </div>
                </div>
              )}

              <div className="amount-input-section">
                <label className="amount-label">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter investment amount"
                  min="1"
                  step="0.01"
                  className="amount-input"
                  autoFocus
                />
              </div>

              {investmentAmount && parseFloat(investmentAmount) > 0 && (
                <div className="investment-calculation">
                  <div className="calc-row">
                    <span>Investment Amount:</span>
                    <span>₹{parseFloat(investmentAmount).toLocaleString()}</span>
                  </div>
                  <div className="calc-row">
                    <span>NAV:</span>
                    <span>₹{selectedScheme?.nav.toFixed(4)}</span>
                  </div>
                  <div className="calc-row">
                    <span>Units to be allocated:</span>
                    <span>{calculateUnits()}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="modal-error-message">
                  {error}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={handleCloseBuyModal}
                className="cancel-btn"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvestment}
                disabled={creating || !investmentAmount || parseFloat(investmentAmount) <= 0}
                className="confirm-buy-btn"
              >
                {creating ? "Processing..." : "Confirm Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewInvestment;