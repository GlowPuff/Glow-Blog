# Glow Blog
An easy to use, mobile responsive, single-author blogging system using Vue JS for the front-end dashboard, Firebase for authentication, php for the back-end ([using my backend project](https://github.com/GlowPuff/Glow-Blog-Backend)), and JSON Web Tokens to enforce security. Glow Blog uses a flat file system in the back-end for speed and simplicity over using SQL databases. It is headless in that there is no template system for front-facing visualization of the posts. Instead, an easy-to-use JavaScript API provides all the functionality needed to pull posts into a website built using any technology stack.

## Front-end Admin Dashboard Features (Vue JS)
* Responsive, modern design
*  Paginated lists of posts and images
* Create, Update, and Delete posts
* Full WYSIWYG editor
* Posts can have a title, description, custom slug, and tags
* Media manager for uploading and managing images for your posts
* Simple API for accessing back-end data

## API Features (JavaScript)
* JavaScript API that can be consumed by a website built with any technology stack
* Supports pagination - only pull the amount of data you need
* Image upload support with progress
* Archive - filter posts by Month and Year
* Tags - filter by tags assigned to posts
* Error catching with easy to understand error response object

## Back-end Features (php)
* Flat file system with no reliance on SQL databases
* CRUD functionality for posts
* Pagination for reading posts and image thumbnails
* Uses JSON Web Tokens to enforce security
* Automatically caches Firebase security keys for faster responses
* Handles image uploading and thumbnail creation

---
### This project includes a sample website to demonstrate the API and back-end features
* Navigate to **/** to view the demo website
* Navigate to **/dashboard** for the admin dashboard. You'll be re-routed to the login page if you haven't already logged in yet. Use the credentials from the Firebase user you create (see **Notes** below).
---

# Installation

## Project setup
This project is the Dashboard front-end for my blog system. It uses my php-based backend system ([required, available here](https://github.com/GlowPuff/Glow-Blog-Backend)).
```
npm install
```

### Development
```
npm run dev
```

### Production
```
npm run build
```

### Prerequisites
[My back-end service](https://github.com/GlowPuff/Glow-Blog-Backend)
PHP 5.6

# Notes
**Firefox:** I used Chrome during development, but I noticed Firefox wouldn't connect to the local back-end php server because of the self-signed certificate I'm using.

**Firebase:** Google's Firebase is used for authentication, so a free Firebase account is required. Create a new Firebase project and note the project id and keys. These credentials need to be placed in the **/firebase/index.js** file. I use a **.env.local** file to store sensitive, non-public keys into variables that are pulled in at compile time.

**In the Firebase dashboard, create a user account you'll sign into the blog with.**

**CORS:** VS Code runs the hot-reload server ("npm run dev") at localhost:8080. To serve the back-end php scripts, I use [UwAmp](https://www.uwamp.com/), which serves from localhost. Because the php scripts are served from a different origin than they are being called from, some of the scripts have a basic CORS implementation to handle the preflight request and avoid errors. Preflight requests are also triggered when making a connection using non-default headers, which the API does do.

There is a way to avoid the dual-server CORS problem during development with a little extra configuration, which would probably make Firefox happy, also. I haven't tried it yet: [Forum post with instructions](https://forum.vuejs.org/t/using-php-with-vue-cli/52842/3)

**Self signed SSL certificate:** I'm using a self signed certificate to avoid **https** errors every time I run the project locally. This optional process is configured in the *module.exports* object in **vue.config.js**.
```
const  fs  =  require( 'fs' )
module.exports  =  {
	devServer:  {
		open: process.platform ===  'darwin',
		host:  '0.0.0.0',
		port:  8080,  // CHANGE YOUR PORT HERE!
		https:  true,
		hotOnly:  false,

		//setup HTTPS with self-signed certificate
		https:  {
			key:  fs.readFileSync( './certs/server.key' ),
			cert:  fs.readFileSync( './certs/server.crt' ),
		},
		public:  'https://localhost:8080/'
	},
}
```

**UwAmp and secure cURL requests:** The backend makes a secure connection to a Google server in order to grab the latest Firebase keys. In order to make the secure connection, UwAmp has to be configured properly.
[Original Instructions](https://mrant.net/uwamp-curl-error-60-ssl-certificate-problem-unable-to-get-local-issuer-certificate-see-http-curl-haxx-se-libcurl-c-libcurl-errors-html/)
```
UwAmp cURL error 60: SSL certificate problem: unable to get local issuer certificate (see http://curl.haxx.se/libcurl/c/libcurl-errors.html)

If you get the above error you may need to specify a certificate file in your PHP.INI which you can download from  [https://curl.haxx.se/ca/cacert.pem](https://curl.haxx.se/ca/cacert.pem)

Once downloaded edit your PHP.INI and set the following

[curl]
; A default value for the CURLOPT_CAINFO option.
; This is required to be an absolute path.
curl.cainfo = "C:\uwamp\bin\php\cacert.pem"
```
I put my cacert.pem file right in C:\

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments
* [Vue JS](https://vuejs.org/) The front-end framework
* [SleekDB](https://sleekdb.github.io/) A flat file database storage system
* [UwAmp](https://www.uwamp.com/) Portable server environment
* [Bulma](https://bulma.io/) CSS framework
* [php-jwt](https://github.com/firebase/php-jwt) Encode/decode JSON Web Tokens (JWT) in php
* [vue2-editor](https://www.npmjs.com/package/vue2-editor) Vue.js HTML editor based on Quill
* [axios](https://github.com/axios/axios) HTTP client
