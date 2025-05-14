export async function getOrders () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت سفارشات بوجود آمده است')
    }

    return res.json()
};

export async function getOrder (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'force-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت سفارش بوجود آمده است')
    }

    return res.json()
}


export async function createOrder (data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ایجاد سفارش بوجود آمده است')
    }

    return res.json()
};


export async function deleteOrder (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('مشکلی در حذف سفارش پیش آمده است')
    }
};


export async function updateOrder (id, newStatus) {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({status: newStatus})
    })
    if (!res.ok) {
        throw new Error('مشکلی در ویرایش سفارش بوجود آمده است')
    }

    return res.json()
};