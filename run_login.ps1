$body = Get-Content -Path 'login_request.json' -Raw
try {
  $response = Invoke-RestMethod `
    -Uri 'https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_login/logins' `
    -Method Post `
    -Body $body `
    -ContentType 'application/json'

  $json = $response | ConvertTo-Json -Depth 5
  $json | Out-File 'login_response.json'
  Write-Host "Login response:"
  Write-Host $json
} catch {
  if ($_.Exception.Response -ne $null) {
    $reader = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errorBody = $reader.ReadToEnd()
    $reader.Close()
    Set-Content -Path 'login_response.json' -Value $errorBody
    Write-Host "Login error response:" -ForegroundColor Red
    Write-Host $errorBody
  } else {
    Set-Content -Path 'login_response.json' -Value $_.Exception.Message
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
  }
}
