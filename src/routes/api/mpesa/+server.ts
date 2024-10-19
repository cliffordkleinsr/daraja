import { CONSUMER_KEY, CONSUMER_SECRET, PASS_KEY, SHORT_CODE } from '$env/static/private';
import { initiateSTKPush } from '$lib/server/mpesa';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
	const credentials = Buffer.from(CONSUMER_KEY + ':' + CONSUMER_SECRET).toString('base64');

	const res = await fetch(url, {
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/json'
		}
	});
	const data = await res.json();
	return new Response(JSON.stringify(data), { status: res.status });
};

export const POST: RequestHandler = async ({ request }) => {
	const { amount, phoneNumber, name } = await request.json();
	
	try {
		const data = await initiateSTKPush(amount, phoneNumber, name);
		return json(data)
	  } catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error occurred' },
			{ status: 500 }
		  );
	  }
};
