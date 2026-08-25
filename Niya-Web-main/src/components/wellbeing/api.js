const API_BASE = "https://niya-backend-oiut.onrender.com";

export function getAuthHeaders() {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    accept: "application/json",
    ...(token ? { token } : {}),
  };
}

async function parseJson(res) {
  const data = await res.json();
  if (!res.ok || data?.errors) {
    const message =
      typeof data?.errors === "string"
        ? data.errors
        : Array.isArray(data?.errors)
          ? data.errors.join(", ")
          : data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
}

export async function fetchAllCategories() {
  const res = await fetch(`${API_BASE}/bx_block_wellbeing/all_categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });
  const data = await parseJson(res);
  return Array.isArray(data) ? data : data?.data || [];
}

export async function fetchInsightsData(categoryId) {
  const res = await fetch(
    `${API_BASE}/bx_block_wellbeing/insights_data?category_id=${encodeURIComponent(categoryId)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return parseJson(res);
}

export async function fetchWellbeingQuestions(categoryId) {
  const res = await fetch(
    `${API_BASE}/bx_block_wellbeing/well_beings?category_id=${encodeURIComponent(categoryId)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return parseJson(res);
}

/** Clears prior answers for this category so the assessment starts at question 1. */
export async function restartCategoryAssessment(categoryId) {
  const res = await fetch(
    `${API_BASE}/bx_block_wellbeing/restart_assessment?category_id=${encodeURIComponent(categoryId)}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ category_id: Number(categoryId) }),
    }
  );
  return parseJson(res);
}

export async function submitUserAnswer(questionId, answerId) {
  const res = await fetch(`${API_BASE}/bx_block_wellbeing/user_answer`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      question_id: Number(questionId),
      answer_id: Number(answerId),
    }),
  });
  return parseJson(res);
}

export async function fetchWellbeingResults(finishedTest) {
  const value = finishedTest ? "true" : "false";
  const res = await fetch(`${API_BASE}/bx_block_wellbeing/get_result?value=${value}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return parseJson(res);
}

export function ensureCoacheeAccess(navigate) {
  let authToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (authToken && !localStorage.getItem("accessToken")) {
    localStorage.setItem("accessToken", authToken);
    localStorage.setItem("authenticated", "true");
  }
  if (!authToken) {
    navigate("/login", { replace: true });
    return false;
  }
  const role = (localStorage.getItem("userRole") || "").toLowerCase();
  if (role === "coach") {
    navigate("/coach-appointments", { replace: true });
    return false;
  }
  return true;
}

export function formatSubmittedDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getScoreStyles(scoreLevel) {
  if (scoreLevel === "high") {
    return { backgroundColor: "#EAFFE1", color: "#11A528" };
  }
  if (scoreLevel === "medium") {
    return { backgroundColor: "#FFFAC2", color: "#C28818" };
  }
  return { backgroundColor: "#FFEDEE", color: "#D80F06" };
}
