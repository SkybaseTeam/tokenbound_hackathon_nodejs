module.exports = {
   apps: [
      {
         name: "backend",
         script: "src/app.ts",
         env_production: {
            NODE_ENV: "production",
         },
         env_development: {
            NODE_ENV: "development",
         },
         watch: true,
         log_date_format: "YYYY-MM-DD HH:mm Z",
         cron_restart: "*/2 * * * *",
      },
   ],
};
