export async function getUsers () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات کاربران بوجود آمده است')
    }

    return res.json()
};

export async function getUser (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات کاربر بوجود آمده است')
    }

    return res.json()
}


export async function createUser (data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ایجاد کاربر بوجود آمده است')
    }

    return res.json()
};


export async function deleteUser (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('مشکلی در حذف کاربر پیش آمده است')
    }
};


export async function updateUser (id, newStatus) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: newStatus })
    })
    if (!res.ok) {
        throw new Error('مشکلی در ویرایش کاربر بوجود آمده است')
    }

    return res.json()
};