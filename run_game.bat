@echo off
echo ===================================================
echo   Starting GANESH - THE JOURNEY Local Server...
echo ===================================================
start "" "http://localhost:8000/index.html"
"C:\Users\LOHITHAMANASWINI\AppData\Local\Programs\Python\Python312\python.exe" -m http.server 8000
pause
