import { CONSUMER_KEY, CONSUMER_SECRET, INITIATOR_NAME, PASS_KEY, SECURITY_CREDENTIAL, SHORT_CODE } from '$env/static/private';
import axios from 'axios'
import cert from '$lib/certificates/ProductionCertificate.cer?raw'

const getToken = async () => {
	const url = 'https://api.safaricom.co.ke/oauth/v2/generate?grant_type=client_credentials';
	const credentials = Buffer.from(CONSUMER_KEY + ':' + CONSUMER_SECRET).toString('base64');

	const res = await axios.get(url, {
		headers: {
			'Authorization': `Basic ${credentials}`,
		}
	});
	// const data = await res.json();
	// if (!res.ok) new Error(`Error fetching token: ${res.statusText}`);

	return res.data.access_token;
};


// Doesnt work with devt
const initiateSTKPush = async (
	amount: string,
	phoneNumber: string,
	name: string
) => {
	const token = await getToken();
	const url = "https://api.safaricom.co.ke/mpesa/stkpush/v2/processrequest";
	const cleanedNumber = phoneNumber.replace(/\D/g, "");
 
    const formattedPhone = `254${cleanedNumber.slice(-9)}`
	const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);
	const password:string = Buffer.from(SHORT_CODE + PASS_KEY + timestamp).toString('base64');

	const payload = {
		BusinessShortCode: SHORT_CODE,
		Password: password,
		Timestamp: timestamp,
		TransactionType: "CustomerPayBillOnline",
		Amount: amount,
		PartyA: formattedPhone,
		PartyB: SHORT_CODE,
		PhoneNumber: formattedPhone,
		CallBackURL: "https://daraja-lemon.vercel.app/callback",
		AccountReference: formattedPhone,
		TransactionDesc: "Test",
	}
	
	try {
		// const res = await fetch(url, {
        //     method: 'POST',
		// 	headers: {
		// 		'Authorization': 'Bearer ' + token,
		// 		 'Content-Type': 'application/json'
		// 	},
        //     body: JSON.stringify(payload)
		// })
		const res = await axios.post(url, payload, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		console.log(res.data)
		// const data = await res.json()
		return {data: res.data}
	} catch (error) {
		console.error('Error initiating STK Push:', error);
	}
};

interface Params {
	name:string
	amount: string
	phoneNumber:string,
	// remarks:string
}



const initiateB2C = async (body: Params) => {
	const { amount, phoneNumber} = body
	const cleanedNumber = phoneNumber.replace(/\D/g, "");
	const formattedPhone = `254${cleanedNumber.slice(-9)}`
	let ConversationID = crypto.randomUUID()
	const url = 'https://api.safaricom.co.ke/mpesa/b2c/v3/paymentrequest'
	const token = await getToken()
	const requestBody = { 
			OriginatorConversationID: ConversationID,
			InitiatorName: INITIATOR_NAME,
			SecurityCredential:SECURITY_CREDENTIAL,
			CommandID:"BusinessPayment",
			Amount: amount,
			PartyA:SHORT_CODE,
			PartyB:formattedPhone,
			Remarks:"here are my remarks",
			QueueTimeOutURL:"https://mydomain.com/b2c/queue",
			ResultURL:"https://mydomain.com/b2c/result",
			Occassion:"Christmas"
	}

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'	
		},
		body: JSON.stringify(requestBody)
	})

	const data = await res.json()
	return data
}
export { initiateSTKPush, initiateB2C}