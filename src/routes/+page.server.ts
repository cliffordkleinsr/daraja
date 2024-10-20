import { initiateB2C, initiateSTKPush } from '$lib/server/mpesa';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({request}) => {
        type Params = {
            name:string
            amount: string
            phoneNumber:string,
            // remarks:string
        }
        const formData =  Object.fromEntries(await request.formData()) as Params
        
        const {phoneNumber} = formData
        const kenyanPhoneNumberRegex = /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/;

        if (!kenyanPhoneNumberRegex.test(phoneNumber)) return console.error("Invalid mpesa number")
            
        const data = await initiateB2C(formData)

        console.log(data)
        // alert("stk push sent successfully")
        // const checkoutRequestId = data.CheckoutRequestID;
    }
};