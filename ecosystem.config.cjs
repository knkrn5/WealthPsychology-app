module.exports = {
    apps: [
        {
            name: 'wealthpsychology-app',
            script: 'server.js',
            watch: false,
            instances: '4',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development', // Default to development
            },
            env_production: {
                NODE_ENV: 'production',
                CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
                CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
                WS_DB_HOST: process.env.WS_DB_HOST,
                WS_DB_PORT: process.env.WS_DB_PORT,
                WS_DB_USER: process.env.WS_DB_USER,
                WS_DB_PASSWORD: process.env.WS_DB_PASSWORD,
                WS_DB_DATABASE: process.env.WS_DB_DATABASE,
            },
            max_memory_restart: '500M', 
            out_file: './logs/out.log', 
            error_file: './logs/error.log', 
            merge_logs: true, 
            // wait_ready: true,
        },
    ],
};
