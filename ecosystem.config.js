module.exports = {
  apps : [{
    name: 'muzsoyuz',
    script: 'npm run start:prod',
  }],
  deploy: {
    production : {
      // SSH user
      user : 'root',
      // SSH host
      host : '165.227.137.68',
      key: 'deploy.key',
      // GIT remote/branch
      ref  : 'origin/master',
      // GIT remote
      repo : 'github.com/drummer1992/muzsoyuz',
      // Fetch all branches or fast
      fetch: 'all',
      // Path in the server
      path : '/home/nodejs/muzsoyuz',
      // Command run after pull source code
      'post-deploy' : 'npm install && npm run build && pm2 reload ecosystem.config.js --env production && pm2 save'
    }
  }
};
