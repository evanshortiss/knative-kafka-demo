# Function project

## Local execution
Make sure that `Java 11 SDK` is installed.

To start server locally run `./mvnw quarkus:dev`.
The command starts http server and automatically watches for changes of source code.
If source code changes the change will be propagated to running server. It also opens debugging port `5005`
so debugger can be attached if needed.

To run test locally run `./mvnw test`.


## Function invocation

Do not forget to set `URL` variable to the route of your function.

You get the route via `func describe`, or use `http://localhost:8080` during
local development.

The following cURL command can be used to invoke the function with an order
payload included in this repository:

```shell script
URL=http://localhost:8080/
curl -v ${URL} \
  -H "Content-Type:application/json" \
  --data @order.json
```


## The `func` CLI

It's recommended to set `FUNC_REGISTRY` environment variable.
```shell script
# replace ~/.bashrc by your shell rc file
# replace docker.io/johndoe with your registry
export FUNC_REGISTRY=docker.io/johndoe
echo "export FUNC_REGISTRY=docker.io/johndoe" >> ~/.bashrc
```

### Building

This command builds OCI image for the function.

```shell script
func build                  # build jar
func build --builder native # build native binary
```

### Running

This command runs the func locally in a container
using the image created above.
```shell script
func run
```

### Deploying

This commands will build and deploy the function into cluster.

```shell script
func deploy # also triggers build
``1
