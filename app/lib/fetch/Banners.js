export async function getBanners () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'no-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات بنرها بوجود آمده است')
    }

    return res.json()
};

export async function getBanner (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }, 
        cache: 'force-cache',
    })
    if (!res.ok) {
        throw new Error('مشکلی در دریافت اطلاعات بنر بوجود آمده است')
    }

    return res.json()
}


export async function createBanner (data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ایجاد بنر بوجود آمده است')
    }

    return res.json()
};


export async function deleteBanner (id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('مشکلی در حذف بنر پیش آمده است')
    }
};


export async function updateBanner (id, data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error('مشکلی در ویرایش بنر بوجود آمده است')
    }

    return res.json()
};