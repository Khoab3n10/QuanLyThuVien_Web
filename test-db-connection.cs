using System;
using Microsoft.Data.SqlClient;

class Program
{
    static void Main()
    {
        string connectionString = "Server=dbskidibi.database.windows.net,1433;Database=Library;User Id=adminDB;Password=Admin123;Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;";
        
        try
        {
            Console.WriteLine("Testing connection to Azure SQL Database...");
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                Console.WriteLine("Opening connection...");
                connection.Open();
                
                Console.WriteLine("Connection successful!");
                Console.WriteLine($"Server Version: {connection.ServerVersion}");
                Console.WriteLine($"Database: {connection.Database}");
                
                using (SqlCommand command = new SqlCommand("SELECT @@VERSION", connection))
                {
                    string result = command.ExecuteScalar().ToString();
                    Console.WriteLine($"SQL Server Version: {result}");
                }
                
                connection.Close();
                Console.WriteLine("Connection closed successfully.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Connection failed: {ex.Message}");
            Console.WriteLine($"Error Type: {ex.GetType().Name}");
        }
    }
} 