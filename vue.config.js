const fs = require( 'fs' )

module.exports = {
	devServer: {
		open: process.platform === 'darwin',
		host: '0.0.0.0',
		port: 8080, // CHANGE YOUR PORT HERE!
		https: true,
		hotOnly: false,

		//setup HTTPS with self-signed certificate
		https: {
			key: fs.readFileSync( './certs/server.key' ),
			cert: fs.readFileSync( './certs/server.crt' ),
		},
		public: 'https://localhost:8080/'
	},
}