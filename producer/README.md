# Producer

Randomly generates e-commerce orders and sends them to a configured Kafka instance.

## Configuration

Environment variables are used to configure this application.

* LOG_LEVEL (default: `info`) - Supports `trace`, `debug`, `info`, or `warn`
* HTTP_PORT (default: `8080`)
* KAFKA_CLIENT_ID (default: `order-producer`)
* KAFKA_TOPIC (default: `orders`)
* KAFKA_SVC_USERNAME - Required
* KAFKA_SVC_PASSWORD - Required
* KAFKA_BOOTSTRAP_URL - Required

## HTTP API

This service exposes a HTTP API on port 8080. It accepts a `GET` request to
`/order`. Use this endpoint to place randomly generated orders into Kafka.

## Usage

### Local Development

Start a local Kafka and Zookeeper using the compose file in the root of this
repository.

```bash
# Start kafka using the docker-compose.yml in
docker-compose up
```

Now start the Node.js server in local development mode. It will automatically
reload when `js` files are saved.

```
npm run dev
```

### Local Deployment

Set the appropriate environment variables and run the service via `npm start`.
Environment variables can be defined in a `.env` file in the *producer/* folder
if you'd like to avoid setting them in the shell.

### Deploy on OpenShift/Kubernetes

Requires an OpenShift 4.6 Cluster running the:

  * OpenShift Pipelines Operator
  * Service Binding Operator

Login to the cluster using `oc` CLI then:

1. Run `setup.producer.sh` script from the root of this repository.
2. Wait for the script to finish. It will print GitHub webhook params.
3. Configure a GitHub webhook (optional)
