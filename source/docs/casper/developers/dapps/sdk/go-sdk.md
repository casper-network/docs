# Go SDK

## Usage Examples

This section includes some examples of how to use Go SDK:

-   [Get a _Deploy_ from the Network](#get-a-deploy-from-the-network)
-   [Handle the deploy processed event](#handle-the-deploy-processed-event)
-   [Sending a transfer](#sending-a-transfer)

### Get a Deploy from the Network

```go
package main

import (
    "context"
    "fmt"
    "net/http"

    "github.com/make-software/casper-go-sdk/casper"
)

func main() {
    handler := casper.NewRPCHandler("https://<Node Address and Port>/rpc", http.DefaultClient)
    client := casper.NewRPCClient(handler)
    deployHash := "62972eddc6fdc03b7ec53e52f7da7e24f01add9a74d68e3e21d924051c43f126"
    deploy, err := client.GetDeploy(context.Background(), deployHash)
    if err != nil {
        return
    }
    fmt.Println(deploy.Deploy.Hash)
}
```

### Handle the deploy processed event

```go
package main

import (
    "context"
    "log"

    "github.com/make-software/casper-go-sdk/sse"
)

func main() {
    client := sse.NewClient("https://<Node Address and Port>/events/main")
    defer client.Stop()
    client.RegisterHandler(
        sse.DeployProcessedEventType,
        func(ctx context.Context, rawEvent sse.RawEvent) error {
            deploy, err := rawEvent.ParseAsDeployProcessedEvent()
            if err != nil {
                return err
            }
            log.Printf("Deploy hash: %s", deploy.DeployProcessed.DeployHash)
            return nil
        })
    lastEventID := 1234
    client.Start(context.TODO(), lastEventID)
}
```

### Sending a transfer

```go
package main

import (
    "context"
    "encoding/hex"
    "log"
    "math/big"
    "net/http"

    "github.com/make-software/casper-go-sdk/casper"
    "github.com/make-software/casper-go-sdk/types/clvalue"
)

func main() {
    accountPublicKey, err := casper.NewPublicKey("012488699f9a31e36ecf002675cd7186b48e6a735d10ec1b308587ca719937752c")
    if err != nil { return }
    amount := big.NewInt(100000000)
    session := casper.ExecutableDeployItem{
        ModuleBytes: &casper.ModuleBytes{
            ModuleBytes: hex.EncodeToString([]byte("<Contract WASM>")),
            Args: (&casper.Args{}).
                AddArgument("target", clvalue.NewCLByteArray(accountPublicKey.AccountHash().Bytes())).
                AddArgument("amount", *clvalue.NewCLUInt512(amount)),
        },
    }

    payment := casper.StandardPayment(amount)

    deployHeader := casper.DefaultHeader()
    deployHeader.Account = accountPublicKey
    deployHeader.ChainName = "casper-test"

    newDeploy, err := casper.MakeDeploy(deployHeader, payment, session)

    handler := casper.NewRPCHandler("https://<Node Address>:7777/rpc", http.DefaultClient)
    client := casper.NewRPCClient(handler)
    result, err := client.PutDeploy(context.Background(), *newDeploy)

    log.Println(result.DeployHash)
}
```
