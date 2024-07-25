# 가상 환경 생성
python -m venv venv

# 가상 환경 활성화 및 패키지 설치
.\venv\Scripts\Activate
pip install -r requirements.txt

# 설치 완료 메시지
Write-Output "가상 환경 설정 및 패키지 설치가 완료되었습니다."
