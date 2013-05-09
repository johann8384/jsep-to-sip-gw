module.exports = {
	development: {
    httpport: 8080,
    //sip gateway that supports PeerConnection SDP 
    //Asterisks server with patches
		outboundproxy: '10.255.132.180:5060',
    //sip domain of your sip gateway
    domain: 'comcastlabs.com',
    //ip and host of the machine the this is running on
    localHost: '10.255.132.197:5060',
    //your organizations name
    org: 'ComcastLabs',
    plugins: [
      { name: 'basic', run: true, config : {}}
    ]
	},
	test: {

	},
	production: {

	}
}

