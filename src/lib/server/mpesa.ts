import { CONSUMER_KEY, CONSUMER_SECRET, PASS_KEY, SHORT_CODE } from '$env/static/private';
import axios from 'axios'

const getToken = async () => {
	const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
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


const initiateSTKPush = async (
	amount: string,
	phoneNumber: string,
	name: string
) => {
	const token = await getToken();
	const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
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
		CallBackURL: "https://mydomain.com/callback-url-path",
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

export { initiateSTKPush}