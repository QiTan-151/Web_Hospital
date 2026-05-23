@echo off
echo Mo trang bang Live Server hoac: npx --yes serve -l 5500
cd /d "%~dp0"
start http://127.0.0.1:5500/patient_management.html
npx --yes serve -l 5500
