@echo off
cd /d "%~dp0"
echo Creating folders...
if not exist css mkdir css
if not exist js mkdir js
if not exist images mkdir images
echo Copying CSS files...
copy /Y navbar.css css\
copy /Y styles.css css\
copy /Y app-layout.css css\
copy /Y patient.css css\
copy /Y medical_examination.css css\
copy /Y pharmacy.css css\
copy /Y room_bed.css css\
copy /Y hr.css css\
copy /Y services.css css\
echo Copying JS files...
copy /Y api.js js\
copy /Y navbar.js js\
copy /Y patient.js js\
copy /Y medical_examination.js js\
copy /Y pharmacy.js js\
copy /Y "exam-queue.js" js\
copy /Y "exam-records.js" js\
copy /Y services.js js\
copy /Y room_bed.js js\
copy /Y hr.js js\
echo Copying images...
copy /Y navbarlogosmall.png images\
copy /Y navbarLine.png images\
copy /Y van.jpg images\
echo Reorganization complete.
pause