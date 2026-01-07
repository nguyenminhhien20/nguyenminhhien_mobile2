const BASE_URL = "https://api-railway-production-0c51.up.railway.app/api";

export const API_CONFIG = {
    BASE_URL: BASE_URL,
    // Nên kiểm tra xem API của bạn có yêu cầu /api hay không
    USERS: `${BASE_URL}/users`,
    PRODUCTS: `${BASE_URL}/products`,
    
    // Hàm này cực kỳ quan trọng để hiện ảnh từ Railway lên App Mobile
    IMAGE_URL: (resource: string, fileName: string) => {
        if (!fileName) return 'https://via.placeholder.com/150'; // Ảnh mặc định nếu user không có ảnh
        return `${BASE_URL}/image/${resource}/${fileName}`;
    },
};