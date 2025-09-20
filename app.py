import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS # Thêm thư viện CORS
from dotenv import load_dotenv
from PIL import Image
import io
import base64

# --- KHỞI TẠO VÀ CẤU HÌNH ---
load_dotenv() # Tự động tìm file .env

app = Flask(__name__)
# CHO PHÉP GIAO DIỆN REACT (từ bất kỳ đâu) CÓ THỂ GỌI ĐẾN API NÀY
CORS(app) 

# Cấu hình Google AI
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY không được tìm thấy. Vui lòng kiểm tra file .env.")
    genai.configure(api_key=api_key)
    print(">>> Cấu hình Google AI thành công.")
except Exception as e:
    print(f"!!! Lỗi cấu hình Google AI: {e}")

# Khởi tạo mô hình AI
try:
    generation_model = genai.GenerativeModel('gemini-1.5-flash-latest')
    print(">>> Khởi tạo mô hình AI thành công.")
except Exception as e:
    print(f"!!! Lỗi khởi tạo mô hình AI: {e}")
    generation_model = None

# --- CÁC ĐƯỜNG DẪN API ---

@app.route('/')
def home():
    """API server không cần hiển thị trang web, chỉ cần báo hiệu là nó đang sống"""
    return jsonify({'status': 'AN PRODUCTION AI FILMS - Backend Server is running!'})

@app.route('/generate', methods=['POST'])
def generate_image():
    """Xử lý yêu cầu tạo ảnh và trả về dữ liệu JSON."""
    if not generation_model:
        return jsonify({'error': 'Mô hình AI chưa sẵn sàng.'}), 500

    try:
        prompt_text = request.form.get('prompt')
        reference_image_file = request.files.get('reference_image')
        
        if not prompt_text and not reference_image_file:
             return jsonify({'error': 'Vui lòng nhập mô tả hoặc tải lên ảnh tham chiếu.'}), 400

        # Thêm "câu thần chú" để AI hiểu nhiệm vụ là vẽ ảnh
        full_prompt = f"Tạo một bức ảnh nghệ thuật chất lượng cao dựa trên mô tả sau: {prompt_text}"
        request_contents = [full_prompt]

        if reference_image_file:
            image = Image.open(reference_image_file.stream).convert("RGB")
            request_contents.append(image)

        print(f"Đang gửi yêu cầu đến AI với prompt: '{prompt_text}'")
        response = generation_model.generate_content(request_contents)
        
        if response.parts and response.parts[0].inline_data:
            image_data = response.parts[0].inline_data
            image_base64 = base64.b64encode(image_data.data).decode('utf-8')
            mime_type = image_data.mime_type
            
            return jsonify({'images': [f'data:{mime_type};base64,{image_base64}']})
        else:
            error_message = "AI không trả về ảnh. Phản hồi của AI: " + (response.text or "Không có phản hồi.")
            print(error_message)
            return jsonify({'error': error_message}), 500

    except Exception as e:
        print(f"Đã xảy ra lỗi nghiêm trọng: {e}")
        return jsonify({'error': f'Lỗi từ máy chủ: {e}'}), 500

# Không cần hàm main() khi deploy lên Render với Gunicorn
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)

