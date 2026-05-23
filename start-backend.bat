@echo off
cd /d "%~dp0hospital-backend"
echo Starting hospital backend on http://localhost:8080 ...
mvn spring-boot:run
pause
