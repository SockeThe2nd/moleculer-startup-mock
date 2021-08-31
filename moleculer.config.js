const HealthMiddleware = require('@r2d2bzh/moleculer-healthcheck-middleware');

const brokerConfig = {
    namespace: "test",
    tracking: {
        enabled: true,
        shutdownTimeout: 8000
    },
    middlewares: [
        HealthMiddleware({
            port: 3033,
            readiness: {
                path: "/ready"
            },
            liveness: {
                path: "/live"
            }
        })
    ],
    transporter: {
        reconnectTimeWait: 2000,
        type: "Redis",
        maxReconnectAttempts: -1,
        options: {
            host: "localhost",
            db: 0
        },
        reconnectJitter: 2000
    },
    cacher: false,
    registry: {
        discoverer: {
            type: "Redis",
            options: {
                monitor: false,
                serializer: "Notepack",
                fullCheck: 10,
                heartbeatInterval: 10,
                heartbeatTimeout: 30,
                redis: {
                    host: "localhost",
                    db: 0
                },
                scanLength: 100,
                cleanOfflineNodesTimeout: 600,
                disableHeartbeatChecks: false,
                disableOfflineNodeRemoving: false
            }
        }
    },
    // tracing: {
    //     enabled: true,
    //     exporter: {
    //         options: {
    //             baseURL: Zipkin server,
    //             interval: 5,
    //             payloadOptions: {
    //                 debug: false,
    //                 shared: false
    //             }
    //         },
    //         type: Zipkin
    //     },
    //     sampling: {
    //         rate: 0.1
    //     }
    // }
}

module.exports = brokerConfig;