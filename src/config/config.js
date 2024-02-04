const config = {
    env: "development",
    isDevModeEnabled: true,
    axiosRequestsTimeout: 5000,
    backendApiEndPoint: "http://192.168.1.118:5000/",
    backendSecretKey: "MAReTqRkP9D5g4BQ3gARz6HhU6h2Gsd8HMHfqXjFpf8Xhf3VA2",
    hmacSecretPacketKey: "bgLkjKcXC8Zkgsfr4ftDxxgEnKbj4ZBUjTk6GCqjA6HvQ2eTZT",
};

if (config.backendApiEndPoint.includes("localhost") || config.backendApiEndPoint.includes("127.0.0.1")) {
    alert("mettre l'ip local dans les configs");
}

config.isDevModeEnabled = config.env === "development";
export default config;