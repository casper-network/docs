# .NET SDK


The [C# .NET SDK](https://github.com/make-software/casper-net-sdk) allows developers to interact with the Casper Network using C#.

## Documentation

Visit [https://make-software.github.io/casper-net-sdk/](https://make-software.github.io/casper-net-sdk/) to find the SDK documentation, examples and tutorials.

## Get started

This example shows how to retrieve an account balance from a testnet node. Make sure you have .NET 5 or higher before continuing.

Open a terminal window and create a new console app:

```
dotnet new console -o GetAccountBalance
cd GetAccountBalance
```

The Casper.Network.SDK for .NET is published as a nuget package in [nuget.org](https://www.nuget.org/packages/Casper.Network.SDK).

To add a reference to the SDK in your project, use the Package Manager in Visual Studio or the `dotnet` cli tool.

**Package Manager (Windows)**
```
Install-Package Casper.Network.SDK
``` 

**dotnet cli tool (Windows/Mac/Linux)**
```
dotnet add package Casper.Network.SDK
````

Now, replace the default code in `Program.cs` with this main program:

```
using System;
using System.Threading.Tasks;
using Casper.Network.SDK;
using Casper.Network.SDK.JsonRpc;
using Casper.Network.SDK.Types;

namespace Casper.NET.SDK.Examples
{
    public class GetAccountBalance
    {
        public static async Task Main(string[] args)
        {
            string nodeAddress = "http://testnet-node.make.services:7777/rpc";

            var hex = "0203914289b334f57366541099a52156b149436fdb0422b3c48fe4115d0578abf690";
            var publicKey = PublicKey.FromHexString(hex);

            try
            {
                var casperSdk = new NetCasperClient(nodeAddress);

                // Get the balance using the account public key
                //
                var rpcResponse = await casperSdk.GetAccountBalance(publicKey);
                Console.WriteLine("Public Key Balance: " + rpcResponse.Parse().BalanceValue);
            }
            catch (RpcClientException e)
            {
                Console.WriteLine("ERROR:\n" + e.RpcError.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }
    }
}
```

Finally, run the example with:

```
dotnet run
```

The program will print the account balance retrieved from the testnet.

Visit [https://make-software.github.io/casper-net-sdk/](https://make-software.github.io/casper-net-sdk/) to find other examples, tutorials and a complete documentation for this SDK.
