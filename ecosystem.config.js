module.exports = {
  apps: [
    {
      name: 'asiabazar',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: 'C:/Users/Administrator/Downloads/asiabazar/asiabazar',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
};
