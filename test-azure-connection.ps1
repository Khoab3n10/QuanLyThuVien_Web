# Enhanced Azure SQL Database Connection Test
Write-Host "=== Azure SQL Database Connection Diagnostic ===" -ForegroundColor Cyan

$serverName = "dbskidibi.database.windows.net"
$databaseName = "Library"
$username = "adminDB"
$password = "Admin123"
$connectionString = "Server=tcp:$serverName,1433;Initial Catalog=$databaseName;Persist Security Info=False;User ID=$username;Password=$password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

Write-Host "`n1. Testing basic network connectivity..." -ForegroundColor Yellow
try {
    $testConnection = Test-NetConnection -ComputerName $serverName -Port 1433 -InformationLevel Detailed
    if ($testConnection.TcpTestSucceeded) {
        Write-Host "✅ Network connectivity to $serverName:1433 successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Cannot reach $serverName:1433" -ForegroundColor Red
        Write-Host "This could indicate:" -ForegroundColor Yellow
        Write-Host "  - Azure SQL Database server is stopped/paused" -ForegroundColor Yellow
        Write-Host "  - Firewall rules blocking your IP" -ForegroundColor Yellow
        Write-Host "  - Incorrect server name" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Network test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing DNS resolution..." -ForegroundColor Yellow
try {
    $dnsResult = Resolve-DnsName -Name $serverName
    Write-Host "✅ DNS resolution successful: $($dnsResult.IPAddress -join ', ')" -ForegroundColor Green
} catch {
    Write-Host "❌ DNS resolution failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing SQL Server connection..." -ForegroundColor Yellow
try {
    # Try using System.Data.SqlClient
    Add-Type -AssemblyName "System.Data.SqlClient"
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    
    Write-Host "Opening connection..." -ForegroundColor Cyan
    $connection.Open()
    
    Write-Host "✅ SQL Server connection successful!" -ForegroundColor Green
    Write-Host "Server Version: $($connection.ServerVersion)" -ForegroundColor Cyan
    Write-Host "Database: $($connection.Database)" -ForegroundColor Cyan
    
    # Test a simple query
    $command = New-Object System.Data.SqlClient.SqlCommand("SELECT @@VERSION", $connection)
    $result = $command.ExecuteScalar()
    Write-Host "SQL Server Info: $result" -ForegroundColor Cyan
    
    $connection.Close()
    Write-Host "✅ Connection closed successfully" -ForegroundColor Green
    
} catch [System.Data.SqlClient.SqlException] {
    $sqlEx = $_.Exception
    Write-Host "❌ SQL Server connection failed:" -ForegroundColor Red
    Write-Host "Error Number: $($sqlEx.Number)" -ForegroundColor Red
    Write-Host "Severity: $($sqlEx.Class)" -ForegroundColor Red
    Write-Host "State: $($sqlEx.State)" -ForegroundColor Red
    Write-Host "Message: $($sqlEx.Message)" -ForegroundColor Red
    
    # Common error diagnosis
    switch ($sqlEx.Number) {
        2 { Write-Host "⚠️  This usually means: Server name not found or not accessible" -ForegroundColor Yellow }
        18456 { Write-Host "⚠️  This usually means: Authentication failed - check username/password" -ForegroundColor Yellow }
        40615 { Write-Host "⚠️  This usually means: Firewall blocked - your IP needs to be whitelisted" -ForegroundColor Yellow }
        default { Write-Host "⚠️  Check Azure SQL Database status and firewall rules" -ForegroundColor Yellow }
    }
} catch {
    Write-Host "❌ General connection error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try with Microsoft.Data.SqlClient if System.Data.SqlClient fails
    try {
        Write-Host "`nTrying with Microsoft.Data.SqlClient..." -ForegroundColor Yellow
        # This would require the Microsoft.Data.SqlClient package
        Write-Host "Note: For .NET Core/5+, you might need Microsoft.Data.SqlClient package" -ForegroundColor Yellow
    } catch {
        Write-Host "Microsoft.Data.SqlClient also failed" -ForegroundColor Red
    }
}

Write-Host "`n4. Checking your public IP address..." -ForegroundColor Yellow
try {
    $publicIP = (Invoke-WebRequest -Uri "http://ipinfo.io/ip" -UseBasicParsing).Content.Trim()
    Write-Host "Your public IP: $publicIP" -ForegroundColor Cyan
    Write-Host "Make sure this IP is allowed in Azure SQL Database firewall rules" -ForegroundColor Yellow
} catch {
    Write-Host "Could not determine public IP" -ForegroundColor Red
}

Write-Host "`n=== Recommendations ===" -ForegroundColor Cyan
Write-Host "1. Check if Azure SQL Database server 'dbskidibi' is running in Azure Portal" -ForegroundColor White
Write-Host "2. Verify firewall rules allow your IP: $publicIP" -ForegroundColor White
Write-Host "3. Confirm database 'Library' exists" -ForegroundColor White
Write-Host "4. Verify credentials: adminDB / Admin123" -ForegroundColor White
Write-Host "5. Check if server is not paused (can happen with Basic tier)" -ForegroundColor White