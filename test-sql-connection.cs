using System;
using Microsoft.Data.SqlClient;

class Program
{
    static void Main(string[] args)
    {
        string connectionString = "Server=tcp:dbskidibi.database.windows.net,1433;Initial Catalog=Library;Persist Security Info=False;User ID=adminDB;Password=Admin123;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        
        Console.WriteLine("=== Azure SQL Database Connection Test ===");
        Console.WriteLine($"Server: dbskidibi.database.windows.net");
        Console.WriteLine($"Database: Library");
        Console.WriteLine($"User: adminDB");
        Console.WriteLine($"Your IP: 118.68.21.181");
        Console.WriteLine();
        
        try
        {
            Console.WriteLine("Attempting to connect...");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                Console.WriteLine("✅ Connection successful!");
                Console.WriteLine($"Server Version: {connection.ServerVersion}");
                Console.WriteLine($"Database: {connection.Database}");
                
                // Test simple query
                using (SqlCommand command = new SqlCommand("SELECT @@VERSION", connection))
                {
                    string result = command.ExecuteScalar().ToString();
                    Console.WriteLine($"SQL Server: {result.Substring(0, Math.Min(result.Length, 50))}...");
                }
                
                // Check if our tables exist
                using (SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Saches'", connection))
                {
                    int tableCount = (int)command.ExecuteScalar();
                    Console.WriteLine($"Table 'Saches' exists: {tableCount > 0}");
                }
            }
            Console.WriteLine("✅ Test completed successfully!");
        }
        catch (SqlException sqlEx)
        {
            Console.WriteLine("❌ SQL Server Error:");
            Console.WriteLine($"Error Number: {sqlEx.Number}");
            Console.WriteLine($"Severity: {sqlEx.Class}");
            Console.WriteLine($"State: {sqlEx.State}");
            Console.WriteLine($"Message: {sqlEx.Message}");
            Console.WriteLine();
            
            // Common error diagnosis
            switch (sqlEx.Number)
            {
                case 2:
                    Console.WriteLine("⚠️ This usually means: Server name not found or not accessible");
                    break;
                case 18456:
                    Console.WriteLine("⚠️ This usually means: Authentication failed");
                    Console.WriteLine("  - Check username: adminDB");
                    Console.WriteLine("  - Check password: Admin123");
                    Console.WriteLine("  - Verify user exists in Azure SQL Database");
                    break;
                case 40615:
                    Console.WriteLine("⚠️ This usually means: Firewall blocked");
                    Console.WriteLine($"  - Add IP 118.68.21.181 to Azure SQL Database firewall rules");
                    Console.WriteLine("  - Or enable 'Allow Azure services and resources to access this server'");
                    break;
                case 4060:
                    Console.WriteLine("⚠️ This usually means: Database 'Library' does not exist");
                    Console.WriteLine("  - Create database 'Library' in Azure SQL Database");
                    Console.WriteLine("  - Or check if database name is correct");
                    break;
                default:
                    Console.WriteLine("⚠️ Check Azure SQL Database status and configuration");
                    break;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ General Error: {ex.Message}");
        }
        
        Console.WriteLine();
        Console.WriteLine("=== Next Steps ===");
        Console.WriteLine("1. Go to Azure Portal > SQL databases > dbskidibi");
        Console.WriteLine("2. Check 'Networking' > Firewall rules");
        Console.WriteLine($"3. Add your IP: 118.68.21.181");
        Console.WriteLine("4. Verify database 'Library' exists");
        Console.WriteLine("5. Check if server is not paused");
    }
}