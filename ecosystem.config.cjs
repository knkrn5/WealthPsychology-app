module.exports = {
    apps: [
        {
            name: 'wealthpsychology-app',
            script: './server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development', // Default to development
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: process.env.PORT || 55555, 
                CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
                CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
                WS_DB_HOST: process.env.WS_DB_HOST,
                WS_DB_PORT: process.env.WS_DB_PORT,
                WS_DB_USER: process.env.WS_DB_USER,
                WS_DB_PASSWORD: process.env.WS_DB_PASSWORD,
                WS_DB_DATABASE: process.env.WS_DB_DATABASE,
            },
            max_memory_restart: '500M', 
            merge_logs: true, 
            // wait_ready: true,
        },
    ],
};
