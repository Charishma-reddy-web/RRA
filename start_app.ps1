Write-Host "Starting Referral AI Application..."

# Start Backend
Write-Host "Launching Backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; if (!(Test-Path node_modules)) { npm install }; npm start"

# Start Frontend
Write-Host "Launching Frontend application..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "if (!(Test-Path node_modules)) { npm install }; npm start"

Write-Host "Both processes have been launched in separate windows."
