export async function getPayments () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات پرداخت ها بوجود آمده است')
    }

    return res.json()
};

export async function getPayment (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'force-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات پرداخت بوجود آمده است')
    }

    return res.json()
}


export async function createPayment (data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ایجاد پرداخت بوجود آمده است')
    }

    return res.json()
};




