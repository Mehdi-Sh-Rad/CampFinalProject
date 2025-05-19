//View all wallets
export async function getWallets () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات کیف پول ها بوجود آمده است')
    }

    return res.json()
};

//View current user Wallet
export async function getWallet () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets?user=true`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات کیف پول بوجود آمده است')
    }

    return res.json()
}

//Charge Wallet 
export async function createWallet (amount, type) {
    const data = {
        amount,
        type
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در شارژ کیف پول بوجود آمده است')
    }

    return res.json()
};


export async function deleteWallet (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('مشکلی در حذف کیف پول پیش آمده است')
    }
};


export async function updateWallet (id, data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ویرایش کیف پول بوجود آمده است')
    }

    return res.json()
};