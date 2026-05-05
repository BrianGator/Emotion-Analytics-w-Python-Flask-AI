# Unit, System, Integration, E2E Testing Summary

## Unit Tests (8 Tests)
- **UNIT-01**: `emotion_detector` function logic.
- **UNIT-02**: Mapping of score values to dictionary keys.
- **UNIT-03**: Status code logic (400 vs 200).
- **UNIT-04**: Text string sanitization helpers.
- **UNIT-05**: Color config dictionary accuracy.
- **UNIT-06**: Dominant emotion index calculation.
- **UNIT-07**: JSON payload builder validation.
- **UNIT-08**: Error state message generators.

## System Tests (8 Tests)
- **SYS-01**: Python runtime version compatibility.
- **SYS-02**: Flask server binding to 0.0.0.0.
- **SYS-03**: React build artifact production (Vite).
- **SYS-04**: Mirror directory synchronization checks.
- **SYS-05**: Port accessibility validation.
- **SYS-06**: Static asset pathing in Python server.
- **SYS-07**: Environment variable injection.
- **SYS-08**: Multi-threaded request handling.

## Integration Tests (8 Tests)
- **INT-01**: Flask to EmotionDetection connection.
- **INT-02**: Watson API request/response cycle.
- **INT-03**: Gemini Fallback API handshake.
- **INT-04**: React Frontend to Flask Backend API.
- **INT-05**: Error bubble-up from Engine to UI.
- **INT-06**: Network latency handling in analysis chain.
- **INT-07**: JSON formatting parity between Python and JS.
- **INT-08**: CORS policy validation.

## End-to-End Tests (8 Tests)
- **E2E-01**: User writes feedback -> runs analysis -> views chart.
- **E2E-02**: User enters blank feedback -> receives validation error.
- **E2E-03**: Mobile user selects feedback from documentation page.
- **E2E-04**: Administrator checks CognitiveStream version footer.
- **E2E-05**: User switches between Pro and Standard modes.
- **E2E-06**: High-precision emotional extraction flow (Long text).
- **E2E-07**: Landing page to Analytics Dashboard transition.
- **E2E-08**: System recovery after API timeout session.
