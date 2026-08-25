import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import "./wellbeingAssessment.css";
import {
  ensureCoacheeAccess,
  fetchWellbeingResults,
  formatSubmittedDate,
  getScoreStyles,
} from "./api";

function getSubCategoryLabel(subcat) {
  return subcat?.sub_category_name || subcat?.sub_category || "";
}

function shouldShowSubCategory(subcat, categoryName) {
  const label = getSubCategoryLabel(subcat);
  if (!label) return false;
  if (subcat?.sub_category === undefined) return false;
  if (subcat?.sub_category === categoryName) return false;
  return true;
}

const WellbeingResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from") || location.state?.from || "drawer";
  const fromTest = fromParam === "test";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCategory, setExpandedCategory] = useState("");
  const [expandedSubCategory, setExpandedSubCategory] = useState("");

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWellbeingResults(fromTest);
      const list = data?.data?.attributes?.results || [];
      setResults(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || "Could not load assessment results.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [fromTest]);

  useEffect(() => {
    if (!ensureCoacheeAccess(navigate)) return;
    loadResults();
  }, [navigate, loadResults]);

  const toggleCategory = (categoryName) => {
    setExpandedCategory((prev) => (prev === categoryName ? "" : categoryName));
    setExpandedSubCategory("");
  };

  const toggleSubCategory = (label) => {
    setExpandedSubCategory((prev) => (prev === label ? "" : label));
  };

  return (
    <div className="wba-page">
      <header className="wba-header">
        <img src={Logo} alt="Niya" className="wba-logo" />
        <nav className="wba-nav">
          <button type="button" className="wba-nav-btn" onClick={() => navigate("/appointments")}>
            My Appointments
          </button>
          <button type="button" className="wba-nav-btn" onClick={() => navigate("/wellbeing-assessment")}>
            Take Assessment
          </button>
        </nav>
      </header>

      <main className="wba-main">
        <div className="wba-hero">
          <h1>Well-Being Assessment Result</h1>
          <p>Review your scores and personalized advice by category.</p>
        </div>

        <div className="wba-card">
          {fromTest && (
            <p className="wba-bravo">
              {"Bravo, you did it,\nClick on well-being to view the score."}
            </p>
          )}

          {loading && <p className="wba-loading">Loading results...</p>}
          {error && <p className="wba-error">{error}</p>}

          {!loading && !error && results.length === 0 && (
            <p className="wba-empty">No assessment results found yet. Complete an assessment to see your scores.</p>
          )}

          {!loading && results.length > 0 && (
            <div className="wba-results-list">
              {results.map((item, index) => {
                const categoryResult = item?.category_result;
                if (!categoryResult?.category_name) return null;

                const {
                  category_name: categoryName,
                  score,
                  advice,
                  submitted_at: submittedAt,
                  score_level: scoreLevel,
                  profile_type: profileType,
                } = categoryResult;
                const scoreStyles = getScoreStyles(scoreLevel);
                const isOpen = expandedCategory === categoryName;
                const subCategories = Array.isArray(item?.sub_category_result) ? item.sub_category_result : [];

                return (
                  <div key={`${categoryName}-${index}`} className="wba-result-card">
                    <button type="button" className="wba-result-header" onClick={() => toggleCategory(categoryName)}>
                      <h3>{categoryName}</h3>
                      <span className={`wba-chevron ${isOpen ? "open" : ""}`} aria-hidden="true">
                        ›
                      </span>
                    </button>

                    {isOpen && (
                      <div className="wba-result-body">
                        <p className="wba-result-date">{formatSubmittedDate(submittedAt)}</p>

                        <div className="wba-overall-score">
                          <span>Overall Score:</span>
                          <span className="wba-score-chip" style={scoreStyles}>
                            {score}
                          </span>
                        </div>

                        {(advice || (categoryName === "Occupational Wellbeing" && profileType)) && (
                          <div className="wba-advice">
                            {advice && <p style={{ margin: 0 }}>{advice}</p>}
                            {categoryName === "Occupational Wellbeing" && profileType && (
                              <p style={{ margin: advice ? "8px 0 0" : 0 }}>{profileType}</p>
                            )}
                          </div>
                        )}

                        {subCategories.length > 0 && (
                          <div className="wba-subcat-list">
                            {subCategories.map((subcat, subIndex) => {
                              if (!shouldShowSubCategory(subcat, categoryName)) return null;
                              const label = getSubCategoryLabel(subcat);
                              const subScoreStyles = getScoreStyles(subcat?.score_level);
                              const subOpen = expandedSubCategory === label;

                              return (
                                <div key={`${label}-${subIndex}`} className="wba-subcat-card">
                                  <button
                                    type="button"
                                    className="wba-subcat-header"
                                    onClick={() => toggleSubCategory(label)}
                                  >
                                    <span className="wba-subcat-title">
                                      {label}
                                      <span className={`wba-chevron ${subOpen ? "open" : ""}`} aria-hidden="true">
                                        ›
                                      </span>
                                    </span>
                                    <span className="wba-score-chip small" style={subScoreStyles}>
                                      {subcat?.score}
                                    </span>
                                  </button>
                                  {subOpen && subcat?.advice && (
                                    <div className="wba-subcat-advice">{subcat.advice}</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!loading && (
            <div className="wba-actions" style={{ marginTop: 20 }}>
              <button type="button" className="wba-secondary-btn" onClick={() => navigate("/appointments")}>
                Back to Appointments
              </button>
              <button type="button" className="wba-primary-btn" onClick={() => navigate("/wellbeing-assessment")}>
                Take Another Assessment
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WellbeingResultsPage;
