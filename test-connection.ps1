# Test Azure SQL Database Connection
$connectionString = "Data Source=dbskidibi.database.windows.net,1433;Initial Catalog=master;User ID=adminDB;Password=Admin123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

try {
    Write-Host "Testing connection to Azure SQL Database..." -ForegroundColor Yellow
    
    # Load SQL Client assembly
    Add-Type -AssemblyName System.Data.SqlClient
    
    # Create connection
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    
    Write-Host "Opening connection..." -ForegroundColor Green
    $connection.Open()
    
    Write-Host "Connection successful!" -ForegroundColor Green
    Write-Host "Server Version: $($connection.ServerVersion)" -ForegroundColor Cyan
    Write-Host "Database: $($connection.Database)" -ForegroundColor Cyan
    
    # Test a simple query
    $command = New-Object System.Data.SqlClient.SqlCommand("SELECT @@VERSION", $connection)
    $result = $command.ExecuteScalar()
    Write-Host "SQL Server Version: $result" -ForegroundColor Cyan
    
    $connection.Close()
    Write-Host "Connection closed successfully." -ForegroundColor Green
    
} catch {
    Write-Host "Connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error Type: $($_.Exception.GetType().Name)" -ForegroundColor Red
} 