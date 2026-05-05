# Emotion Analytics AI

A professional e-commerce analytics platform that uses AI to detect emotions (joy, anger, sadness, fear, disgust) from customer feedback.

## Key Features Implemented ✨
- **Deep NLP Analysis**: Deciphers 5 distinct emotions from raw text strings.
- **Interactive Dashboard**: Real-time visualization of emotional weights using Recharts.
- **Dual AI Engine Support**: Logic for both IBM Watson NLP integration and Google Gemini fallback.
- **Responsive "Glassmorphism" UI**: High-end aesthetic with fluid animations and responsive layouts.
- **Pro Analytics Mode**: Documentation and hooks for marketplace (Shopify/Amazon) integrations.
- **Strict Error Handling**: Robust validation for empty inputs and API failures.

## Project Structure & Tasks 🏗️
The project was built in phases to satisfy both production standards and specific course requirements:

### Phase 1-5: The Core Engine (`/final_project/EmotionDetection`)
- **Emotion Logic**: Implementation of the `emotion_detector` function.
- **Formatting**: Transformation of raw NLP data into actionable dictionaries.
- **Validation**: Full unit test suite (`test_emotion_detection.py`) ensuring accuracy across 5 key test cases.

### Phase 6-7: Web Deployment (`/final_project/server.py`)
- **Flask Server**: Integration of the NLP package into a web interface.
- **Interaction Logic**: AJAX-based communication between the UI and backend.
- **Resilience**: Sophisticated error handling for null results and status code 400.

### Phase 8: Compliance
- **PyLint Optimization**: Refactored code to meet static analysis standards with full docstring coverage.

## Quality Assurance & Testing 🧪
The application is backed by a multi-layered testing infrastructure across all development facets:

### Automated UI Testing
- **[Selenium Tests](./Selenium-Tests)**: 15 Cross-browser automation scripts.
- **[Playwright Tests](./Playwright-Tests)**: 15 Modern E2E isolated environment tests.
- **[Cypress Tests](./Cypress-Tests)**: 15 Fast, stable UI verification tests.
- **[Cucumber Tests](./Cucumber-Tests)**: 15 BDD scenarios using Gherkin syntax.

### Infrastructure & Engineering
- **[Unit Tests](./Unit-Tests)**: 8 Tests for core emotion detection logic.
- **[Integration Tests](./Integration-Tests)**: 8 Tests for API-to-Model communication.
- **[End-to-End Tests](./End-to-End-Tests)**: 8 Full-path user journey validations.
- **[System Tests](./System-Tests)**: 8 Environment parity and deployment checks.

### Reliability & Security
- **[Performance Tests](./Performance-Tests)**: 8 Benchmarks for FCP, TTI, and Latency.
- **[Load Tests](./Load-Tests)**: 8 High-traffic simulations (50-500 concurrent users).
- **[Stress Tests](./Stress-Tests)**: 8 Failure-point and crash recovery tests.
- **[Security Tests](./Security-Tests)**: 8 Audits for XSS, Injection, and API safety.

## How to use 🚀

1. **Dashboard Access**:
   - Open the application in your browser.
   - You will see the "Emotion Analytics AI" interface.

2. **Analyze Feedback**:
   - Enter customer feedback in the text area (e.g., "I love the product but the shipping was slow!").
   - Click "Run AI Analysis".

3. **Interpret Results**:
   - View the individual emotion cards (0-100%).
   - The **Dominant Emotion** will be highlighted in blue.
   - The "Emotional Landscape" bar chart provides a comparative view of the feedback sentiment.

4. **Testing Python Package**:
   - To run the standalone Python logic: `python3 final_project/server.py`
   - To run unit tests: `python3 final_project/test_emotion_detection.py`
