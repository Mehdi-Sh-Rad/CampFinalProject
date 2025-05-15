export async function getComments () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت نظرات بوجود آمده است')
    }

    return res.json()
};

export async function getComment () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments?user=true`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت نظر بوجود آمده است')
    }

    return res.json()
}


export async function getProductComment (productId) {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments?productId=${productId}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت نظرات محصول بوجود آمده است')
    }

    return res.json()
};

export async function createComment (text, product, user) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text,
            product,
            user,
        })
    })
    if (!res.ok) {
        throw new Error('مشکلی در ایجاد نظر بوجود آمده است')
    }

    return res.json()
};


export async function deleteComment (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('مشکلی در حذف نظر پیش آمده است')
    }
};

