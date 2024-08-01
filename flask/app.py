from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
from waitress import serve
from openai import OpenAI

# .env 파일의 경로 지정
dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path)

app = Flask(__name__)
# app.config['DEBUG'] = True  # 디버그 모드 활성화

# @app.route('/')
# def home():
#     return "Hello from Flask!"

# @app.route('/api', methods=['GET'])
# def api():
#     if request.remote_addr != '127.0.0.1':
#         return jsonify({'error': 'Forbidden'}), 403
    
#     client = OpenAI(api_key=os.getenv('OPEN_AI_KEY'))

#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {
#                 "role": "system",
#                 "content": "너는 사진을 보고 음식 종류를 골라내는 역할을 할거야. 너는 음식 이름을 제외하고는 아무것도 이야기하지 못해. 너는 반드시 한국어로 음식 이름을 응답해야해. 사진 속 음식은 높은 확률로 한국 음식이야"
#             },
#             {
#             "role": "user",
#             "content": [
#                 {"type": "text", "text": "해당 사진이 어떤 음식인지 단어로 이야기해줘. 보통 접시 단위로 음식의 종류가 결정돼. 접시가 여럿이어서 여러 종류의 음식이라면 ,로 구분해서 말해줘."},
#                 {
#                     "type": "image_url",
#                     "image_url": {
#                     "url": "https://ns-sugarguard.s3.ap-northeast-2.amazonaws.com/images/recipe/test-file.jpg",
#                     },
#                 },
#                 ],
#             }
#         ],
#         max_tokens=500,
#     )

#     print(response.choices[0].message.content)
#     return jsonify({'message': 'Hello from Flask API!'})

@app.route('/api/food-detection', methods=['POST'])
def api():
    if request.remote_addr != '127.0.0.1':
        return jsonify({'error': 'Forbidden'}), 403
    
    if request.content_type == 'application/json':
        data = request.get_json()
        image_url = data.get('image_url')
    elif request.content_type == 'application/x-www-form-urlencoded':
        image_url = request.form.get('image_url')
    else:
        return jsonify({'error': 'Unsupported content type'}), 400

    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400

    try:
        client = OpenAI(api_key=os.getenv('OPEN_AI_KEY'))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "너는 사진을 보고 사진 속 음식 종류를 골라내는 역할을 할거야. 너는 음식 이름을 제외하고는 아무것도 이야기하지 못해. 너는 반드시 한국어로 음식 이름을 응답해야해. 사진 속 음식은 높은 확률로 한국 음식이야. 음식이 발견되지 않으면 반드시 빈 문자열로 응답해야해"
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "해당 사진이 어떤 음식인지 단어로 이야기해줘. 보통 접시 단위로 음식의 종류가 결정돼. 접시가 여럿이어서 여러 종류의 음식이라면 ,로 구분해서 말해줘. 음식이 발견되지 않으면 반드시 빈 문자열로 응답해야해."},
                        {
                            "type": "image_url",
                            "image_url": {
                            "url": image_url,
                            },
                        },
                    ],
                }
            ],
            max_tokens=500,
        )

        return jsonify({'food_names': response.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/food-calories', methods=['POST'])
def api_calkcal():
    if request.remote_addr != '127.0.0.1':
        return jsonify({'error': 'Forbidden'}), 403
    
    if request.content_type == 'application/json':
        data = request.get_json()
        image_url = data.get('image_url')
    elif request.content_type == 'application/x-www-form-urlencoded':
        image_url = request.form.get('image_url')
    else:
        return jsonify({'error': 'Unsupported content type'}), 400

    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400

    try:
        client = OpenAI(api_key=os.getenv('OPEN_AI_KEY'))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "너는 사진을 보고 사진 속 음식의 총 칼로리를 계산하는 역할을 할거야. 너는 음식 이름과 음식들의 전체 칼로리를 제외하고는 아무것도 이야기하지 못해. 너는 반드시 json 형식으로 foodname에 한국어로 음식 이름을 calories에 모든 음식의 합선 칼로리리 값을 float로 답해야해. 사진 속 음식은 높은 확률로 한국 음식이야. 음식이 발견되지 않으면 반드시 foodname에 빈 문자열로, calories에 0으로 응답해야해"
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "해당 사진이 어떤 음식인지와 총 칼로리가 몇인지 말해줘. 보통 접시 단위로 음식의 종류가 결정돼. 접시가 여럿이어서 여러 종류의 음식이라면 ,로 구분해서 json 형식으로 답변해줘. 음식이 발견되지 않으면 반드시 foodname에 빈 문자열로, calories에 0으로 응답해야해."},
                        {
                            "type": "image_url",
                            "image_url": {
                            "url": image_url,
                            },
                        },
                    ],
                }
            ],
            max_tokens=500,
        )

        return jsonify({'json': response.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ingredients-detection', methods=['POST'])
def api_ingredients():
    if request.remote_addr != '127.0.0.1':
        return jsonify({'error': 'Forbidden'}), 403
    
    if request.content_type == 'application/json':
        data = request.get_json()
        image_url = data.get('image_url')
    elif request.content_type == 'application/x-www-form-urlencoded':
        image_url = request.form.get('image_url')
    else:
        return jsonify({'error': 'Unsupported content type'}), 400

    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400

    try:
        client = OpenAI(api_key=os.getenv('OPEN_AI_KEY'))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "너는 사진을 보고 사진 속 음식 재료 종류를 골라내는 역할을 할거야. 너는 음식 재료 이름을 제외하고는 아무것도 이야기하지 못해. 너는 반드시 한국어로 음식재료 이름을 응답해야해. 사진 속 음식 재료는 높은 확률로 한국 음식이야. 음식이 발견되지 않으면 반드시 빈 문자열로 응답해야해"
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "해당 사진이 어떤 음식재료인지 단어로 이야기해줘. 여러 종류의 음식재료라면 ,로 구분해서 말해줘. 같은 재료가 있다면 중복해서 이야기하지 말고 1번만 말해야해. 가급적 겹져져 있는 음식 재료도 꼼곰히 살펴봐야해. 음식이 발견되지 않으면 반드시 빈 문자열로 응답해야해"},
                        {
                            "type": "image_url",
                            "image_url": {
                            "url": image_url,
                            },
                        },
                    ],
                }
            ],
            max_tokens=500,
        )

        return jsonify({'ingredients_names': response.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # app.run(port=os.getenv('FLASK_PORT'))
    print("Starting Flask server with Waitress...")
    serve(app, host='127.0.0.1', port=os.getenv('FLASK_PORT'))