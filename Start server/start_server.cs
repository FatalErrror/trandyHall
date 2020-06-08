using System.Diagnostics;
using System.IO;

public class main
{
    public static void Main()
    {
        Process.Start("CMD.exe",@"/c node " + File.ReadAllText("path.txt"));
    }
}