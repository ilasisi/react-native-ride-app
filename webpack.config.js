const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);
    config.resolve.alias["@stripe/stripe-react-native"] = "null-loader";
    return config;
};
