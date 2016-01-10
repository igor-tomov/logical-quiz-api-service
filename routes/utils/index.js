module.exports = {
	/**
	 * Prepare error HTTP respose from supplied tv4.js error payload
	 *
	 * @param {Object} error - error payload
	 * @return {Object}
	 */
	prepareErrorResponse( error ){
		var message;

		if ( Array.isArray( error ) ){
			message = error.map( item => item.dataPath ? ( item.dataPath + " - " + item.message ) : item.message );

			if ( message.length === 1 ){
				message = message[0];
			}
		}else{
			message = error.dataPath + " - " + error.message
		}

		return {
			error: "Validation error",
			message: message
		}
	}
};