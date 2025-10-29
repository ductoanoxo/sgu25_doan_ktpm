@echo off
REM Script to run all tests for the project on Windows

echo ==================================
echo Running All Tests
echo ==================================

set FAILED=0

REM Server Tests
echo.
echo [1/3] Running Server Tests...
cd server_app
call npm test -- --runInBand --coverage
if %ERRORLEVEL% NEQ 0 (
    echo Server tests failed
    set /a FAILED+=1
) else (
    echo Server tests passed
)
cd ..

REM Client Tests
echo.
echo [2/3] Running Client Tests...
cd client_app
set CI=true
call npm test -- --coverage --watchAll=false
if %ERRORLEVEL% NEQ 0 (
    echo Client tests failed
    set /a FAILED+=1
) else (
    echo Client tests passed
)
cd ..

REM Admin Tests
echo.
echo [3/3] Running Admin Tests...
cd admin_app
set CI=true
call npm test -- --coverage --watchAll=false
if %ERRORLEVEL% NEQ 0 (
    echo Admin tests failed
    set /a FAILED+=1
) else (
    echo Admin tests passed
)
cd ..

REM Summary
echo.
echo ==================================
echo Test Summary
echo ==================================

if %FAILED% EQU 0 (
    echo All tests passed!
    exit /b 0
) else (
    echo %FAILED% test suite(s) failed
    exit /b 1
)
