import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from PIL import Image
import io
import base64

# --- KHỞI TẠO VÀ CẤU HÌNH ---
# Tải các biến môi trường từ file .env nếu có (sẽ không gây lỗi nếu file không tồn tại)
# Đây là thay đổi quan trọng nhất để ứng dụng chạy được trên Render
load_dotenv()

# Khởi tạo ứng dụng Flask
app = Flask(__name__)

# --- CẤU HÌNH GOOGLE AI ---
try:
    # os.getenv sẽ đọc từ biến môi trường của Render hoặc từ file .env đã được load
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or "PLACEHOLDER" in api_key:
        print("!!! LỖI: Không tìm thấy GEMINI_API_KEY hợp lệ.")
    else:
        genai.configure(api_key=api_key)
        print(">>> THÀNH CÔNG: Đã cấu hình Google AI.")
except Exception as e:
    print(f"!!! LỖI: Cấu hình Google AI thất bại: {e}")

try:
    # Sử dụng mô hình đa năng (multimodal) có khả năng chỉnh sửa và tạo ảnh
    generative_model = genai.GenerativeModel('gemini-1.5-flash-latest')
    print(">>> THÀNH CÔNG: Đã khởi tạo mô hình AI 'gemini-1.5-flash-latest'.")
except Exception as e:
    print(f"!!! LỖI: Không thể khởi tạo mô hình AI: {e}")
    generative_model = None

# --- CÁC ĐƯỜNG DẪN CỦA ỨNG DỤNG ---

@app.route('/')
def index():
    """Hiển thị trang chủ của ứng dụng."""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Xử lý yêu cầu chỉnh sửa/tạo ảnh."""
    if not generative_model:
        return jsonify({'error': 'Mô hình AI chưa được khởi tạo thành công.'}), 500
    if 'image' not in request.files:
        return jsonify({'error': 'Không tìm thấy file ảnh.'}), 400

    image_file = request.files['image']
    prompt_text = request.form.get('prompt', 'Edit this image')

    try:
        image_bytes = image_file.read()
        image_part = {
            "mime_type": image_file.mimetype,
            "data": image_bytes
        }
        prompt_parts = [prompt_text, image_part]

        response = generative_model.generate_content(prompt_parts)

        if response.parts and response.parts[0].inline_data:
            image_data = response.parts[0].inline_data
            img_bytes = image_data.data
            img_str = base64.b64encode(img_bytes).decode("utf-8")
            
            return jsonify({
                'message': 'Image edited successfully!',
                'image_data': f'data:{image_data.mime_type};base64,{img_str}'
            })
        else:
            error_message = response.text if hasattr(response, 'text') else 'AI did not return an image.'
            print(f"AI returned text instead of an image: {error_message}")
            return jsonify({'error': f'AI không trả về ảnh. Lý do: {error_message}'}), 500

    except Exception as e:
        print(f"Đã xảy ra lỗi khi xử lý: {e}")
        return jsonify({'error': f'Lỗi từ máy chủ: {e}'}), 500

