import { initiateSTKPush } from '$lib/server/mpesa';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({request}) => {
        type En = {
            name: string
            mpesa_number: string
            amount: string
        }
        const formData =  Object.fromEntries(await request.formData()) as En
        
        const {name, mpesa_number, amount} = formData
        const kenyanPhoneNumberRegex = /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/;

        if (!kenyanPhoneNumberRegex.test(mpesa_number)) return alert("Invalid mpesa number")
            
        const data = await initiateSTKPush(amount, mpesa_number, name)

        console.log(data)
        // alert("stk push sent successfully")
        // const checkoutRequestId = data.CheckoutRequestID;
    }
};