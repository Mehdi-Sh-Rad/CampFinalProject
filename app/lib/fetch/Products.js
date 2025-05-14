export async function getCategories () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات دسته بندی بوجود آمده است')
    }

    return res.json()
};

export async function getCategory (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'force-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات دسته بندی بوجود آمده است')
    }

    return res.json()
}


export async function createCategory (data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ایجاد دسته بندی بوجود آمده است')
    }

    return res.json()
};


export async function deleteCategory (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('مشکلی در حذف دسته بندی بوجود آمده است')
    }
};


export async function updateCategory (id, data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ویرایش دسته بندی بوجود آمده است')
    }

    return res.json()
};