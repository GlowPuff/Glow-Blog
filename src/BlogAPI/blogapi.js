// const instance = this.$axios.create({
//   baseURL: 'https://some-domain.com/api/',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
// });
import firebase from 'firebase/app';

function ApiResult( success, data = null, message = '', innerMessage = '' )
{
	this.success = success;
	this.message = message;
	this.innerMessage = innerMessage;
	this.data = data;
}

class BlogAPI
{
	constructor()
	{
		this.axios = require( 'axios' );
		this.axios.interceptors.response.use(
			response => response,
			error =>
			{
				return Promise.reject( error.response );
			}
		);

		this.options = {
			api: ''
		};
	}

	settings( setting )
	{
		Object.assign( this.options, setting );
	}

	// createuser( email, token )
	// {
	// 	if ( typeof token === 'undefined' )
	// 		return Promise.reject(
	// 			{
	// 				data: {
	// 					error: 'Token is undefined'
	// 				}
	// 			} );

	// 	return this.request( 'post', 'auth/createuser.php', { email: email }, token );
	// }

	async checkFirebase()
	{
		if ( firebase.auth().currentUser == null )
		{
			throw new ApiResult( false, null, 'Current user is null' );
		}

		try
		{
			let token = await firebase.auth().currentUser.getIdToken( true );
			return token;
		} catch ( error )
		{
			return new ApiResult( false, null, 'Error acquiring token' );
		}
	}

	async login( email, pass )
	{
		try
		{
			await firebase
				.auth()
				.signInWithEmailAndPassword( email, pass );
			return new ApiResult( true );
		} catch ( error )
		{
			throw new ApiResult( false, null, error.code, error.message );
		}
	}

	async getSiteData()
	{
		try
		{
			let result = await this.request( 'get', 'actions/site-data.php', {}, "" );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async getPostsPaging( page, limit = 0, queryTag = "" )
	{
		try
		{
			// let token = await this.checkFirebase();

			let result = await this.request( 'get', 'actions/read-paging.php',
				{
					page: page,
					limit: limit,
					queryTag: queryTag
				}, "" );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async getPostsArchive( queryMonth, queryYear )
	{
		try
		{
			let result = await this.request( 'get', 'actions/read-archive.php',
				{
					queryMonth: queryMonth,
					queryYear: queryYear
				}, "" );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async getArchive()
	{
		try
		{
			let result = await this.request( 'get', 'actions/get-archive.php',
				{}, "" );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async getPost( slug )
	{
		try
		{
			let result = await this.request( 'get', 'actions/read-single.php',
				{
					slug: slug
				}, "" );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async getSettings()
	{
		try
		{
			let token = await this.checkFirebase();

			let result = await this.request( 'get', 'actions/getsettings.php', {}, token );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async setSettings( settings )
	{
		try
		{
			let token = await this.checkFirebase();

			await this.request( 'post', 'actions/setsettings.php', settings, token );

			return new ApiResult( true );
		} catch ( error )
		{
			throw error;
		}
	}

	async sendPost( data, mode )
	{
		try
		{
			let token = await this.checkFirebase();
			let result;

			if ( mode == 'create' )
				result = await this.request( 'post', 'actions/create.php', data, token );
			else
				result = await this.request( 'post', 'actions/update.php', data, token );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async deletePost( id )
	{
		try
		{
			let token = await this.checkFirebase();

			await this.request( 'post', 'actions/delete.php',
				{
					postID: id
				}, token );

			return new ApiResult( true );
		} catch ( error )
		{
			throw error;
		}
	}

	async getImages( page, limit )
	{
		try
		{
			let token = await this.checkFirebase();

			let result = await this.request( 'get', 'actions/getmedia.php',
				{
					page: page,
					limit: limit
				}, token );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async uploadImage( formData, callback )
	{
		try
		{
			let token = await this.checkFirebase();

			let result = await this.axios.post( this.options.api + '/actions/uploadmedia.php',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': 'Bearer ' + token
					},
					onUploadProgress: callback
				} );
			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async deleteImage( filename )
	{
		try
		{
			let token = await this.checkFirebase();

			let result = await this.request( 'post', 'actions/deletemedia.php',
				{
					filename: filename
				}, token );

			return new ApiResult( true, result.data );
		} catch ( error )
		{
			throw error;
		}
	}

	async request( method, endpoint, data, token = '' )
	{
		if ( method !== 'get' && method !== 'post' )
			throw new ApiResult( false, null, 'API error', 'Request method is not defined' );

		let axiosParams;
		if ( method === 'get' )
		{
			axiosParams = {
				method: 'get',
				params: data,
				headers: { 'Authorization': 'Bearer ' + token }
			}
		}
		else
		{
			axiosParams = {
				method: 'post',
				data: data,
				headers: { 'Authorization': 'Bearer ' + token }
			}
		}

		try
		{
			let result = await this.axios( this.options.api + endpoint, axiosParams );
			return new ApiResult( true, result.data );
		} catch ( error )
		{
			console.log( 'request error:' );
			console.log( error );
			throw new ApiResult( false, null, error.data.message, error.data.error );
		}
	}
}

let blogapi = new BlogAPI();

export { blogapi };