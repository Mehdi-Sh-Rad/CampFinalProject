import { fromJSON } from "postcss"

export async function getProducts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?sort=latest`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-cache',
    });
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات محصولات بوجود آمده است');
    }

    return res.json();
};

export async function getProduct (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات محصول بوجود آمده است')
    }

    return res.json()
}


export async function createProduct (formData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('مشکلی در ایجاد محصول بوجود آمده است')
    }

    return res.json()
};


export async function deleteProduct (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('مشکلی در حذف محصول بوجود آمده است')
    }
};


export async function updateProduct (id, data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ویرایش محصول بوجود آمده است')
    }

    return res.json()
};