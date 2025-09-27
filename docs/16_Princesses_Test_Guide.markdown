# 16 Princesses Test: Quiz Mechanics Guide

## Overview
The "16 Princesses Test" is a static, browser-based quiz that maps users to a princess archetype (from a provided table of 21 Disney/anime princesses) on a 2D graph: **Damsel to Heroine** (X-axis, agency/independence, 0-100%) and **Sweet to Fierce** (Y-axis, assertiveness/attitude, 0-100%). It uses 16 questions with anti-bias techniques to ensure honest responses, delivering a fun yet nuanced result (e.g., "You're like Mulan!").

## Quiz Structure
- **Questions:** 16 total
  - 5 target X-axis (Damsel-Heroine)
  - 5 target Y-axis (Sweet-Fierce)
  - 6 target both (XY-axis)
- **Types:**
  - **Multiple-Choice (10 Qs):** 4 options, scored 0%, 33%, 66%, 100% per axis.
  - **Forced-Choice (6 Qs):** 2-3 options, scored 0%, 33%, 100% per axis.
- **JSON Format:** Stored in `quiz.json` with fields: `id`, `text`, `axis` (X/Y/XY), `type` (multiple/forced), `reverse` (boolean), `options` (array with `text`, `value` or `xValue`/`yValue`).

## Scoring Mechanics
1. **Collect Responses:**
   - For each question, store the selected option’s `value` (X/Y) based on `id`.
   - Multiple-choice: Radio buttons, 4 options.
   - Forced-choice: Dropdown or buttons, 2-3 options.
2. **Handle Reverse-Scoring:**
   - For `reverse: true` (Q1, Q5, Q8, Q16), invert value: 0→100, 33→66, 66→33, 100→0.
   - Example: Q1 (X-axis, reverse), picking "Jump ship impulsively" (0%) scores 100%.
3. **Calculate Axis Percentages:**
   - **X-axis (Heroine):** Sum 11 values (Q1-5 + Q11-16 X-values), divide by 11.
   - **Y-axis (Fierce):** Sum 11 values (Q6-10 + Q11-16 Y-values), divide by 11.
   - Output: (X%, Y%) coordinate, e.g., (78.5%, 66.4%).
4. **Map to Princess:**
   - Use princess table (e.g., `[{name: "Mulan", x: 90, y: 80}, ...]`).
   - Compute Euclidean distance: `Math.sqrt((X - princessX)^2 + (Y - princessY)^2)`.
   - Select princess with smallest distance.
   - Alternative: Divide graph into 4x4 quadrants (0-25%, 26-50%, 51-75%, 76-100%), assign user to quadrant’s princess or archetype (e.g., "Fierce Heroine").

## Anti-Bias Techniques
To ensure honest results and reduce gaming (e.g., social desirability bias):
- **Randomized Options:** For multiple-choice, shuffle `options` array per page load using Fisher-Yates algorithm. Scores tie to option content, not A-D order.
- **Reverse-Scoring:** Q1, Q5 (X), Q8 (Y), Q16 (XY) have bold-sounding options (e.g., "Lash out loudly") score low to catch impulsive picks.
- **Forced-Choice:** Q2, Q7, Q14, Q15 force trade-offs (e.g., "Wait for rescue" vs. "Break free solo"), obscuring "best" choice.
- **Indirect Phrasing:** Scenarios (e.g., "What feels natural in a crisis?") avoid direct trait questions, prompting reflection.
- **Anonymity Note:** Intro text: "No judgments, just princess vibes—be honest!"

## Implementation Notes
- **Load JSON:** Fetch `quiz.json` or embed as JS object.
- **Render:** Display one question at a time (progress bar recommended). Use radio buttons (multiple) or dropdowns (forced). Add CSS animations (e.g., fade-in).
- **JS Logic:**
  ```javascript
  // Shuffle options (Fisher-Yates)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // Score calculation
  fetch('quiz.json').then(response => response.json()).then(data => {
    data.forEach(q => { if (q.type === 'multiple') q.options = shuffle(q.options); });
    // On submit
    let xScores = [], yScores = [];
    answers.forEach(ans => {
      let q = data.find(q => q.id === ans.id);
      let xVal = q.axis === 'X' || q.axis === 'XY' ? ans.value || ans.xValue : null;
      let yVal = q.axis === 'Y' || q.axis === 'XY' ? ans.value || ans.yValue : null;
      if (q.reverse) {
        if (xVal !== null) xVal = 100 - xVal;
        if (yVal !== null) yVal = 100 - yVal;
      }
      if (xVal !== null) xScores.push(xVal);
      if (yVal !== null) yScores.push(yVal);
    });
    const xPercent = xScores.reduce((a, b) => a + b, 0) / xScores.length;
    const yPercent = yScores.reduce((a, b) => a + b, 0) / yScores.length;
    // Find closest princess
    const princesses = [/* table data */];
    let closest = princesses.reduce((min, p) => {
      let dist = Math.sqrt((xPercent - p.x)**2 + (yPercent - p.y)**2);
      return dist < min.dist ? {princess: p, dist} : min;
    }, {dist: Infinity}).princess;
  });
  ```
- **Graph:** Use Chart.js to plot (xPercent, yPercent) and princesses, highlighting the closest match.
- **Result Blurb:** Example: "You're X% Heroine, Y% Fierce—like [Princess] with a twist of [fun trait]!"

## Notes
- **Princess Table:** Input as `[{name, x, y, source, bio}, ...]` for distance calculation.
- **Testing:** Validate with sample responses to ensure scores align with expected princess matches.
- **Fun Factor:** Keep scenarios funny/painful (e.g., zombie apocalypse, betrayals) and princess references intact for engagement.