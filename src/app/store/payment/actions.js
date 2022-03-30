const paymentAPIUrl = process.env.PAYMENT_API;

export const createCheckoutSession = async ({ isPremium, isMonthly, userId }) => {
    try {
        const response = await fetch(`${paymentAPIUrl}/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //'x-api-key': process.env.PAYMENT_API_KEY
            },
            body: JSON.stringify({
                isPremium,
                isMonthly,
                userId
            })
        });
        const data = await response.json();
        return data.url;
    } catch (e) {
        console.log(e);
    }
}

export const getPortalSession = async ({ userId }) => {
    try {
        const response = await fetch(`${paymentAPIUrl}/get-portal-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //'x-api-key': process.env.PAYMENT_API_KEY
            },
            body: JSON.stringify({
                userId
            })
        });
        const data = await response.json();
        return data.url;
    } catch (e) {
        console.log(e);
    }
}