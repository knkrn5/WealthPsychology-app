module.exports = {
    apps: [
        {
            name: 'wealthpsychology-app',
            script: 'server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
            },
            max_memory_restart: '500M', 
            // out_file: './logs/out.log', 
            // error_file: './logs/error.log', 
            // merge_logs: true, 
            // wait_ready: true,
        },
    ],
};
