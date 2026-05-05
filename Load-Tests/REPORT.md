# Load & Stress Testing Summary

## Load Tests (8 Tests)
1. **LD-01**: 50 Concurrent users baseline.
2. **LD-02**: Sustained load for 10 minutes (100 req/sec).
3. **LD-03**: Ramping users from 0 to 500 in 60 seconds.
4. **LD-04**: Database connection pooling under load.
5. **LD-05**: Static asset delivery speed under load.
6. **LD-06**: Memory usage stability during sustained peak.
7. **LD-08**: CPU utilization mapping during AI processing.

## Stress Tests (8 Tests)
1. **ST-01**: Spike test: sudden 1000% traffic increase.
2. **ST-02**: Service degradation under 95% resource usage.
3. **ST-03**: Failure recovery after crash emulation.
4. **ST-04**: Data integrity check following abrupt shutdown.
5. **ST-05**: Rate limiting trigger verification.
6. **ST-06**: Timeout handling for long-running AI calls.
7. **ST-07**: Socket connection exhaustion.
8. **ST-08**: Concurrent writes to mirrored python directories.
