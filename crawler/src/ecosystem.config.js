module.exports = {
   apps: [
      {
         name: "---Product---job crawl Ventory Fun",
         script: "./app.ts",
         env_production: {
            NODE_ENV: "production",
         },
         env_development: {
            NODE_ENV: "development",
         },
         watch: true,
         log_date_format: "YYYY-MM-DD HH:mm Z",
         cron_restart: "00 */2 * * *",
      },
    //   {
    //      name: "---Product---job manager Collection 404 Starknet",
    //      script: "./Cronjob.collection.js",
    //      env_production: {
    //         NODE_ENV: "production",
    //      },
    //      env_development: {
    //         NODE_ENV: "development",
    //      },
    //      watch: true,
    //      log_date_format: "YYYY-MM-DD HH:mm Z",
    //      cron_restart: "*/5 * * * *",
    //   },
   ],
};
