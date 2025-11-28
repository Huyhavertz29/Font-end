import { orderContant } from "./contant";


export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

export const renderOptions = (arr) => {
    let results = []
    if (arr) {
        results = arr?.map((opt) => {
            return {
                value: opt,
                label: opt
            }
        })
    }
    results.push({
        label: 'Thêm type',
        value: 'add_type'
    })
    return results

}

export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replaceAll(',', '.')
        return `${result} VND`
    } catch (error) {
        return null
    }
}

// export const initFacebookSDK = () => {
//     if (window.FB) {
//         window.FB.XFBML.parse();
//     }
//     let locale = "vi_VN"
//     window.fbAsyncInit = function () {
//         window.FB.init({
//             appId: process.env.REACT_APP_FB_ID,
//             cookie: true,
//             xfbml: true,
//             version: "v8.6"
//         });
//     };
//     console.log("FB:", window.FB);
//     console.log("ENV:", process.env.REACT_APP_FB_ID);
//     console.log("FB root exists:", document.getElementById("facebook-jssdk"));
//     (function (d, s, id) {
//         console.log(s);
//         var js,
//             fjs = d.getElementsByTagName(s)[0];
//         if (d.getElementById(id)) return;
//         js = d.createElement(s);
//         js.src = `//connect.facebook.net/${locale}/sdk.js`;
//         fjs.parentNode.insertBefore(js, fjs);
//     })(document, "script", "facebook-jssdk")
// }

export const initFacebookSDK = () => {
    if (window.FB) return; // Nếu SDK đã load, không load lại

    window.fbAsyncInit = function () {
        window.FB.init({
            appId: process.env.REACT_APP_FB_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0', // dùng version mới
        });

        // Parse tất cả plugin FB
        window.FB.XFBML.parse();
    };

    (function (d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id; // bắt buộc
        js.src = `https://connect.facebook.net/vi_VN/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
};
export const saveCartToStorage = (orderItems, userId) => {
    if (userId && orderItems && orderItems.length > 0) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(orderItems))
    }
}

export const loadCartFromStorage = (userId) => {
    if (!userId) return []
    const saved = localStorage.getItem(`cart_${userId}`)
    return saved ? JSON.parse(saved) : []
}

export const clearCartStorage = (userId) => {
    if (userId) {
        localStorage.removeItem(`cart_${userId}`)
    }
}

export const convertDataChart = (data, type) => {
    try {
        const object = {}
        Array.isArray(data) && data.forEach((opt) => {
            if (!object[opt[type]]) {
                object[opt[type]] = 1
            } else {
                object[opt[type]] += 1
            }
        })
        const results = Array.isArray(Object.keys(object)) && Object.keys(object).map((item) => {
            return {
                name: orderContant.payment[item],
                value: object[item]
            }
        })
        return results
    } catch (e) {
        return []
    }
}