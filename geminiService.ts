import { GenerationOptions } from '../types'; // Giả sử file types.ts nằm ở thư mục gốc

// --- ĐÂY LÀ DÒNG ANH CẦN THAY ĐỔI ---
// Thay thế URL này bằng đường link "Bộ Não" trên Render của anh
const API_BASE_URL = 'https://an-s9zd.onrender.com';

async function generateApiRequest(endpoint: string, options: GenerationOptions): Promise<string[]> {
    const formData = new FormData();
    
    // Thêm các trường dữ liệu vào formData dựa trên options
    if (options.prompt) formData.append('prompt', options.prompt);
    if (options.newReferenceImage) formData.append('reference_image', options.newReferenceImage);
    if (options.newReferenceImage2) formData.append('reference_image2', options.newReferenceImage2);
    if (options.referenceImage) formData.append('reference_image', options.referenceImage);
    if (options.characterReferenceImage) formData.append('character_image', options.characterReferenceImage);
    if (options.sceneImage) formData.append('scene_image', options.sceneImage);
    if (options.characterImages) {
        options.characterImages.forEach(img => formData.append('character_images', img));
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Đã có lỗi không xác định từ máy chủ.');
    }

    // Thêm phần chẩn đoán lỗi thông minh
    if (data.status && data.status.includes('Backend Server is running')) {
        throw new Error('Kết nối backend thành công nhưng đã gọi sai cổng (endpoint). Vui lòng kiểm tra lại code frontend.');
    }

    if (data.images && data.images.length > 0) {
        return data.images;
    } else {
        throw new Error('Không nhận được ảnh nào từ AI. Phản hồi của AI có thể là văn bản.');
    }
}

// Các hàm tương ứng với từng chế độ
export const generateNewImages = (options: GenerationOptions): Promise<string[]> => {
    return generateApiRequest('/generate-new', options);
};

export const generateConsistentImages = (options: GenerationOptions): Promise<string[]> => {
    return generateApiRequest('/generate-consistent', options);
};

export const generatePoseReferenceImages = (options: GenerationOptions): Promise<string[]> => {
    return generateApiRequest('/generate-pose', options);
};

export const generateSetupImages = (options: GenerationOptions): Promise<string[]> => {
    return generateApiRequest('/generate-setup', options);
};


