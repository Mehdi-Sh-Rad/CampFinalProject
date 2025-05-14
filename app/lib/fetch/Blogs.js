export async function getBlogs () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogPosts`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت مقالات بوجود آمده است')
    }

    return res.json()
};

export async function getBlog (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogPosts/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'force-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت مقاله بوجود آمده است')
    }

    return res.json()
}


export async function createBlog (data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogPosts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ایجاد مقاله بوجود آمده است')
    }

    return res.json()
};


export async function deleteBlog (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogPosts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('مشکلی در حذف مقاله پیش آمده است')
    }
};


export async function updateBlog (id, data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogPosts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ویرایش مقاله بوجود آمده است')
    }

    return res.json()
};