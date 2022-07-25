# Golang SDK


## Usage Examples

This section includes some examples of how to use Golang SDK:

* Sending a transfer
* Deploying a contract

## Generating Account Keys


```bash
    import (
        "fmt"
        "github.com/casper-ecosystem/casper-golang-sdk/keypair"
        "github.com/casper-ecosystem/casper-golang-sdk/keypair/ed25519"
        "github.com/casper-ecosystem/casper-golang-sdk/sdk"
        "math/big"
        "time"
    )
```
```bash
    func main() {
        nodeRpc := "http://159.65.118.250:7777/rpc"
        nodeEvent := "http://159.65.118.250:9999"
        privKeyPath := "/path/to/secret_key.pem"
        
        rpcClient, _ := sdk.NewRpcClient(nodeRpc)
        eventClient := sdk.NewEventService(nodeEvent)

        pair, _ := ed25519.ParseKeyFiles(privKeyPath)
        target, _ := keypair.FromPublicKeyHex("0172a54c123b336fb1d386bbdff450623d1b5da904f5e2523b3e347b6d7573ae80")

        deployParams := sdk.DeployParams{
            Account:   pair.PublicKey(),
            Timestamp: time.Now(),
            TTL:       30 * time.Minute,
            GasPrice:  1,
            ChainName: "casper-test",
        }
        payment := sdk.StandardPayment(big.NewInt(100000000))
        session := sdk.NewTransfer(big.NewInt(25000000000), target, uint64(5589324))

        deploy, _ := sdk.MakeDeploy(deployParams, payment, session)
        _ = deploy.Sign(pair)
        putDeploy, _ := rpcClient.PutDeploy(deploy)

        processedDeploy, _ := eventClient.AwaitDeploy(putDeploy.DeployHash)

        fmt.Printf("%+v\n", processedDeploy)
    }
```

## Deploying a contract

```bash
    import (
        "fmt"
        "github.com/casper-ecosystem/casper-golang-sdk/keypair"
        "github.com/casper-ecosystem/casper-golang-sdk/keypair/ed25519"
        "github.com/casper-ecosystem/casper-golang-sdk/sdk"
        "math/big"
        "time"
    )
```
```bash
    func main() {
        nodeRpc := "http://159.65.118.250:7777/rpc"
        nodeEvent := "http://159.65.118.250:9999"
        privKeyPath := "/path/to/secret_key.pem"
        modulePath := "/path/to/contract.wasm"

        rpcClient, _ := sdk.NewRpcClient(nodeRpc)
        eventClient := sdk.NewEventService(nodeEvent)

        pair, _ := ed25519.ParseKeyFiles(privKeyPath)
        module, _ := ioutil.ReadFile(modulePath)

        deployParams := sdk.DeployParams{
            Account:   pair.PublicKey(),
            Timestamp: time.Now(),
            TTL:       30 * time.Minute,
            GasPrice:  1,
            ChainName: "casper-test",
        }
        payment := sdk.StandardPayment(big.NewInt(100000000))
        session := sdk.NewModuleBytes(module, nil)

        deploy, _ := sdk.MakeDeploy(deployParams, payment, session)
        _ = deploy.Sign(pair)
        putDeploy, _ := rpcClient.PutDeploy(deploy)

        processedDeploy, _ := eventClient.AwaitDeploy(putDeploy.DeployHash)

        fmt.Printf("%+v\n", processedDeploy)
    }
 ```   