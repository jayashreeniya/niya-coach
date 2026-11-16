"""Web prototype: intake screen plus human-review dashboard.

    streamlit run ui/app.py

Styling follows NIYA's existing web app (purple #6c4ab6, sage #B9C5A2) so this
reads as part of the same product rather than a bolt-on.

Two audiences in one app, deliberately:

* **Intake tab** - what a distressed user would see. The design rule here is
  that the user is never shown a category name, a confidence score or a
  counsellor's score. Those are operational artefacts; showing them to someone
  in distress would be alarming and would invite arguing with the label. They
  see a plan and a person.
* **Review tab** - what a coordinator sees. The opposite rule applies: every
  number, every matched phrase and every rejected counsellor is exposed, because
  the coordinator's job is to overrule the engine when it is wrong.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import streamlit as st  # noqa: E402

from niya_triage import IntakeRequest, __version__, triage  # noqa: E402
from niya_triage.audit import default_log  # noqa: E402
from niya_triage.counsellors import default_repository  # noqa: E402
from niya_triage.emergency import supported_countries  # noqa: E402
from ui.booking_view import render_appointments_tab, render_booking_tab  # noqa: E402
from niya_triage.safety import describe_rules  # noqa: E402
from niya_triage.taxonomy import CATEGORIES  # noqa: E402

PURPLE = "#6c4ab6"
SAGE = "#B9C5A2"

st.set_page_config(page_title="NIYA triage", page_icon="*", layout="wide")

st.markdown(
    f"""
    <style>
      .stApp {{ background: linear-gradient(180deg, #f7f4fb 0%, #eef6f8 100%); }}
      .niya-card {{
        background: #ffffff; border-radius: 16px; padding: 20px 22px;
        border: 1px solid #ece7f5; margin-bottom: 14px;
      }}
      .niya-crisis {{
        background: #fff5f5; border: 2px solid #d92d20; border-radius: 16px;
        padding: 20px 22px; margin-bottom: 14px;
      }}
      .niya-pill {{
        display: inline-block; padding: 4px 12px; border-radius: 999px;
        font-size: 0.78rem; font-weight: 600; margin-right: 6px; margin-bottom: 6px;
      }}
      .u-low {{ background:#EAFFE1; color:#11A528; }}
      .u-moderate {{ background:#FFFAC2; color:#C28818; }}
      .u-high {{ background:#FFE8D6; color:#B54708; }}
      .u-critical {{ background:#FFEDEE; color:#D80F06; }}
      .niya-tag {{ background:#f2edfb; color:{PURPLE}; }}
      h1, h2, h3 {{ color: #2d3745; }}
    </style>
    """,
    unsafe_allow_html=True,
)


def urgency_pill(urgency: str) -> str:
    return f'<span class="niya-pill u-{urgency}">{urgency.upper()}</span>'


st.title("NIYA triage and matching engine")
st.caption(
    f"Prototype v{__version__} - supports human judgement, does not replace it. "
    "All counsellor data in this prototype is synthetic."
)

intake_tab, book_tab, appointments_tab, review_tab, explain_tab = st.tabs(
    [
        "Intake",
        "Book a session",
        "My appointments",
        "Human review dashboard",
        "How it decides",
    ]
)


# ---------------------------------------------------------------------------
# Intake
# ---------------------------------------------------------------------------

with intake_tab:
    st.subheader("What is happening?")
    st.caption("Tell us in your own words. There are no right words for this.")

    with st.form("intake"):
        text = st.text_area(
            "",
            height=170,
            placeholder=(
                "For example: I moved to Canada six months ago. I have stopped attending "
                "classes, I am scared to tell my parents, and I cannot sleep before exams."
            ),
            label_visibility="collapsed",
        )

        col1, col2, col3 = st.columns(3)
        with col1:
            country = st.selectbox(
                "Where are you now?", supported_countries() + ["unknown"], index=1
            )
            user_type = st.selectbox(
                "This is about my", ["student", "professional", "couple", "unknown"]
            )
        with col2:
            timezone = st.text_input("Your timezone", value="America/Toronto")
            languages = st.multiselect(
                "Languages you are comfortable in",
                ["english", "hindi", "tamil", "telugu", "malayalam", "punjabi",
                 "bengali", "marathi", "gujarati", "urdu", "kannada"],
                default=["english"],
            )
        with col3:
            timing = st.selectbox(
                "When would you like to talk?",
                ["flexible", "this week", "asap", "immediate", "evenings only"],
            )
            use_llm = st.checkbox(
                "Use language model second opinion",
                value=False,
                help="Requires OPENAI_API_KEY. The rule engine and safety layer work without it.",
            )

        submitted = st.form_submit_button("Get support", use_container_width=True)

    if submitted and text.strip():
        result = triage(
            IntakeRequest(
                text=text,
                country=country,
                timezone=timezone,
                user_type=user_type,
                preferred_languages=languages or ["english"],
                desired_timing=timing,
            ),
            use_llm=use_llm or None,
        )
        st.session_state["last_result"] = result
        # The booking tab defaults the timezone selector and the phone country
        # code from what was given here, so the user does not restate it.
        st.session_state["intake_timezone"] = timezone
        st.session_state["intake_country"] = country

        # Safety first, visually as well as logically.
        if result.safety and result.safety.block_automated_pathway:
            st.markdown('<div class="niya-crisis">', unsafe_allow_html=True)
            st.markdown("### Please read this first")
            st.markdown(
                "From what you have written, we think you should speak to someone now "
                "rather than wait for a booking. **A member of our team has been alerted.**"
            )
            st.markdown("**If you are in immediate danger, contact your local emergency services.**")
            for resource in result.emergency_guidance:
                note = f" - {resource.note}" if resource.note else ""
                st.markdown(f"- **{resource.label}:** {resource.contact}{note}")
            st.markdown("</div>", unsafe_allow_html=True)
            st.info(
                "We have not booked anything automatically. A trained person will contact you."
            )
        else:
            plan = result.pathway_plan
            st.markdown('<div class="niya-card">', unsafe_allow_html=True)
            st.markdown(f"### {plan.label}")
            st.markdown(plan.description)
            st.markdown(
                f"**First session:** within {plan.first_session_within_hours} hours &nbsp;|&nbsp; "
                f"**Plan:** {plan.session_plan} &nbsp;|&nbsp; **Format:** {plan.modality}"
            )
            st.markdown("</div>", unsafe_allow_html=True)

            if result.themes:
                st.markdown(
                    "".join(
                        f'<span class="niya-pill niya-tag">{theme}</span>'
                        for theme in result.themes
                    ),
                    unsafe_allow_html=True,
                )

            if result.shortlist:
                st.markdown("#### People we think can help")
                for match in result.shortlist:
                    with st.container():
                        st.markdown('<div class="niya-card">', unsafe_allow_html=True)
                        st.markdown(f"**{match.display_name}**")
                        for reason in match.rationale[:4]:
                            st.markdown(f"- {reason}")
                        st.markdown("</div>", unsafe_allow_html=True)
                st.info(
                    "Go to the **Book a session** tab to choose one of them and pick "
                    "a time in your own timezone."
                )
            else:
                st.warning(
                    "We could not find the right person automatically. A coordinator will "
                    "arrange this for you personally."
                )

            if result.human_review_required:
                st.info(
                    "A member of the NIYA team will confirm this before anything is booked."
                )


# ---------------------------------------------------------------------------
# Booking
# ---------------------------------------------------------------------------

with book_tab:
    render_booking_tab()

with appointments_tab:
    render_appointments_tab()


# ---------------------------------------------------------------------------
# Review dashboard
# ---------------------------------------------------------------------------

with review_tab:
    st.subheader("Coordinator view")
    result = st.session_state.get("last_result")

    if result is None:
        st.info("Run an intake on the first tab to see the full decision breakdown here.")
    else:
        left, right = st.columns([2, 1])

        with left:
            st.markdown(
                f"**Case** `{result.case_id}` &nbsp; {urgency_pill(result.urgency.value)} "
                f"&nbsp; confidence **{result.confidence_score:.2f}** &nbsp; "
                f"({result.processing_ms:.0f} ms)",
                unsafe_allow_html=True,
            )
            st.markdown(f"**Primary:** `{result.primary_category}`")
            if result.secondary_categories:
                st.markdown(f"**Secondary:** {', '.join(f'`{c}`' for c in result.secondary_categories)}")
            st.markdown(f"**Pathway:** `{result.recommended_pathway}`")
            st.markdown(f"**Next action:** {result.suggested_next_action}")

            if result.review_reasons:
                st.warning(
                    "Flagged for review: "
                    + ", ".join(reason.value for reason in result.review_reasons)
                )

            if result.safety and result.safety.triggered:
                st.error("Safety layer fired")
                for hit in result.safety.flags:
                    st.markdown(
                        f"- **{hit.flag.value}** ({hit.severity.value}) via "
                        f"{', '.join(hit.rule_ids)} - matched: "
                        + ", ".join(f"`{span}`" for span in hit.matched_spans)
                    )
                    if hit.softened_by:
                        st.caption("  softened: " + "; ".join(hit.softened_by))

            with st.expander("Why this category"):
                if result.classification:
                    for line in result.classification.rationale:
                        st.markdown(f"- {line}")
                    st.markdown("**Scores**")
                    for score in result.classification.ranked_scores:
                        if score.score <= 0:
                            continue
                        st.markdown(
                            f"- `{score.category_id}` **{score.score:.2f}** - "
                            + (", ".join(score.matched_signals[:8]) or "no phrases")
                        )

        with right:
            st.markdown("**Shortlist**")
            for match in result.shortlist:
                st.markdown(f"**{match.display_name}** - {match.score:.3f}")
                breakdown = match.breakdown
                st.markdown(
                    f"<small>problem {breakdown.problem_fit:.2f} &nbsp; "
                    f"avail {breakdown.availability:.2f} &nbsp; "
                    f"lang {breakdown.language_fit:.2f}<br>"
                    f"culture {breakdown.cultural_fit:.2f} &nbsp; "
                    f"tz {breakdown.timezone_fit:.2f} &nbsp; "
                    f"outcome {breakdown.historical_outcome:.2f}</small>",
                    unsafe_allow_html=True,
                )
                st.divider()

            with st.expander(f"Excluded ({len(result.rejected)})"):
                for rejection in result.rejected:
                    st.markdown(f"- **{rejection.display_name}**: {rejection.reason}")

        st.markdown("### Record a decision")
        with st.form("review"):
            reviewer = st.text_input("Your name", value="coordinator")
            action = st.selectbox("Decision", ["accepted", "overridden", "escalated", "rejected"])
            final_category = st.selectbox(
                "Final category",
                list(CATEGORIES.keys()),
                index=list(CATEGORIES.keys()).index(result.primary_category)
                if result.primary_category in CATEGORIES
                else 0,
            )
            chosen = st.selectbox(
                "Counsellor assigned",
                ["(none)"] + [match.display_name for match in result.shortlist],
            )
            note = st.text_area("Note", placeholder="Why you agreed or overrode the engine")
            if st.form_submit_button("Save decision"):
                default_log().log_review(
                    case_id=result.case_id,
                    reviewer=reviewer,
                    action=action,
                    original_category=result.primary_category,
                    final_category=final_category,
                    chosen_counsellor=None if chosen == "(none)" else chosen,
                    note=note,
                )
                st.success("Recorded in the tamper-evident audit log.")

        ok, message = default_log().verify()
        st.caption(("Audit chain OK - " if ok else "AUDIT CHAIN BROKEN - ") + message)


# ---------------------------------------------------------------------------
# Explainer
# ---------------------------------------------------------------------------

with explain_tab:
    st.subheader("How the engine decides")
    st.markdown(
        """
1. **Safety rules run first**, on the raw text, with no model involved. They can
   only be triggered by explicit patterns, and negation or third-party framing
   downgrades a flag rather than clearing it.
2. **A lexicon classifier scores every category** from weighted phrase evidence.
   Longer phrases win over shorter overlapping ones, so "cannot sleep" does not
   also score as "sleep".
3. **A language model is consulted only if configured**, and only as a second
   opinion. It can raise urgency or raise a risk suspicion. It cannot lower either.
4. **Hard gates run before matching.** Capacity, complexity ceiling, clinical
   qualification and crisis training are boolean - a counsellor who fails one is
   not ranked at all, however well they score elsewhere.
5. **The weighted match score** ranks whoever remains.
        """
    )

    st.markdown("#### Safety rules in force")
    st.dataframe(describe_rules(), use_container_width=True, hide_index=True)

    st.markdown("#### Counsellor roster")
    repository = default_repository()
    st.dataframe(
        [
            {
                "id": counsellor.id,
                "name": counsellor.display_name,
                "timezone": counsellor.timezone,
                "languages": ", ".join(counsellor.languages),
                "escalation": counsellor.escalation_capability,
                "capacity": f"{counsellor.active_cases}/{counsellor.max_cases}",
                "next free (h)": counsellor.next_available_hours,
                "active": counsellor.active,
            }
            for counsellor in repository.all()
        ],
        use_container_width=True,
        hide_index=True,
    )
