import os
import uuid
import subprocess
import requests
import time


from flask_cors import CORS
from flask import Flask, request, jsonify, send_file
import static_ffmpeg

static_ffmpeg.add_paths()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
TEMP_FOLDER = "temp"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)

FFMPEG = "ffmpeg"

FFPROBE = "ffprobe"

GRUPO1_API = "https://equipe01-extracaoaudio-globorio.onrender.com/upload"

GRUPO2_API = "https://adrianovalenca-api-vlibras-transcricao.hf.space/gerar-srt"

GRUPO3_API = (
    "https://residencia-globo-grupo3-growup2026-1-1.onrender.com/otimizar-srt"
)

def run_command(cmd):

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(result.stderr)
        raise Exception(result.stderr)

    return result

def get_video_info(video_path):

    cmd = [
        FFPROBE,
        "-v", "error",
        "-select_streams", "v:0",
        "-show_entries",
        "stream=width,height,r_frame_rate,duration",
        "-of", "default=noprint_wrappers=1",
        video_path
    ]

    result = run_command(cmd)

    lines = result.stdout.splitlines()

    fps_line = next(
        line for line in lines
        if "r_frame_rate" in line
    )

    duration_line = next(
        line for line in lines
        if "duration" in line
    )

    width_line = next(
        line for line in lines
        if "width" in line
    )

    height_line = next(
        line for line in lines
        if "height" in line
    )

    fps_raw = fps_line.split("=")[1]
    duration = float(duration_line.split("=")[1])

    width = int(width_line.split("=")[1])
    height = int(height_line.split("=")[1])

    num, den = fps_raw.split("/")
    fps = round(float(num) / float(den), 2)

    return {
        "fps": fps,
        "duration": duration,
        "width": width,
        "height": height
    }

def extract_audio(video_path, output_audio_path):

    cmd = [
        FFMPEG,
        "-y",

        "-i", video_path,

        "-vn",

        "-acodec", "mp3",

        output_audio_path
    ]

    run_command(cmd)

def normalize_avatar(
    avatar_path,
    original_fps,
    original_duration,
    output_path
):
    cmd = [
        FFMPEG,
        "-y",
        "-i", avatar_path,

        "-r", str(original_fps),

        "-c:v", "libx264",
        "-preset", "fast",

        output_path
    ]

    run_command(cmd)

def merge_videos(
    original_video,
    avatar_video,
    output_video,
    original_width,
    original_height
):

    avatar_width = int(original_width * 0.18)
    avatar_height = int(original_height * 0.32)

    margin_x = int(original_width * 0.02)
    margin_y = int(original_height * 0.02)

    filter_complex = (
        f"[1:v]scale={avatar_width}:{avatar_height}[avatar];"
        f"[0:v][avatar]overlay=W-w-{margin_x}:H-h-{margin_y}[v]"
    )

    cmd = [
        FFMPEG,
        "-y",

        "-i", original_video,
        "-i", avatar_video,

        "-filter_complex", filter_complex,

        "-map", "[v]",
        "-map", "0:a:0",

        "-c:v", "libx264",
        "-preset", "fast",

        "-c:a", "aac",
        "-b:a", "192k",

        "-movflags", "+faststart",

        

        output_video
    ]

    run_command(cmd)

@app.route("/process", methods=["POST"])
def process_video():

    if "file" not in request.files:

        return jsonify({
            "erro": "Nenhum vídeo enviado"
        }), 400

    video_file = request.files["file"]

    job_id = str(uuid.uuid4())

    original_video_path = os.path.join(
        UPLOAD_FOLDER,
        f"{job_id}_original.mp4"
    )

    video_file.save(original_video_path)
    print("VÍDEO RECEBIDO")

    try:
        print("ENVIANDO PARA O GRUPO 1...")
        with open(original_video_path, "rb") as audio_video:
            response = requests.post(
                GRUPO1_API,
                files={
                    "file": audio_video
                },
                timeout= 300
            )
        print("GRUPO 1 RESPONDEU")
        grupo1_json = response.json()
        print(grupo1_json)


        audio_path = os.path.join(
            TEMP_FOLDER,
            f"{job_id}_audio.mp3"
        )

        download_url = (
            "https://equipe01-extracaoaudio-globorio.onrender.com"
            + grupo1_json["download_url"]
        )

        print("BAIXANDO AUDIO DO GRUPO 1...")
        print(download_url)

        audio_response = requests.get(
            download_url,
            timeout=300
        )
        audio_response.raise_for_status()
        print("CONTENT-TYPE:", audio_response.headers.get("content-type"))
        print("PRIMEIROS BYTES:", audio_response.content[:20])

        with open(audio_path, "wb") as f:
            f.write(audio_response.content)

        print("AUDIO BAIXADO COM SUCESSO")
        print("TAMANHO:", os.path.getsize(audio_path))
        
        if os.path.getsize(audio_path) == 0:
            raise Exception("Audio baixado vazio")
        
        print("ENVIANDO MP3 PARA O GRUPO 2...")
        print("URL:", GRUPO2_API)
        print("TAMANHO:", os.path.getsize(audio_path))

        with open(audio_path, "rb") as audio:

            files = {
                "file": audio
            }

            response_grupo2 = requests.post(
                GRUPO2_API,
                files=files,
                timeout=300
            )
        grupo2_json = response_grupo2.json()
        task_id = grupo2_json["task_id"]
        print("TASK ID:", task_id)

        STATUS_URL = (
        f"https://adrianovalenca-api-vlibras-transcricao.hf.space/status/{task_id}"
        )

        while True:

            print("CONSULTANDO STATUS...")

            resposta_status = requests.get(
                STATUS_URL,
                timeout=60
            )

            content_type = resposta_status.headers.get(
                "content-type",
                ""
            )

            if "application/json" in content_type:

                json_status = resposta_status.json()

                print(json_status)

                if json_status.get("status") == "erro":
                    raise Exception(
                        json_status.get("detalhe")
                    )

                print("AINDA PROCESSANDO...")
                time.sleep(10)

            else:

                print("SRT PRONTO!")

                srt_path = os.path.join(
                    TEMP_FOLDER,
                    f"{job_id}.srt"
                )

                with open(srt_path, "wb") as f:

                    f.write(resposta_status.content)

                break
        with open(
            srt_path,
            "r",
            encoding="utf-8"
        ) as f:
            grupo2_texto = f.read()

        print("ENVIANDO PARA O GRUPO 3...")
        with open(srt_path, "rb") as srt_file:

            response_grupo3 = requests.post(
                GRUPO3_API,
                files={
                    "file": srt_file
                },
                timeout=600
            )
        print("STATUS GRUPO 3:", response_grupo3.status_code)
        print("RESPOSTA GRUPO 3:", response_grupo3.text[:500])
        grupo3_json = response_grupo3.json()

        #if os.path.exists(original_video_path):
            #os.remove(original_video_path)

        if os.path.exists(audio_path):
            os.remove(audio_path)

        return jsonify({
            "status": "ok",
            "job_id": job_id,
            "audio_api": grupo1_json,
            "transcription_api": grupo2_texto,
            "glosas": grupo3_json
        })

    except Exception as e:
        import traceback

        traceback.print_exc()

        return jsonify({
            "erro": str(e)
        }), 500

@app.route("/download/<job_id>")
def download_video(job_id):

    file_path = os.path.join(
        OUTPUT_FOLDER,
        f"{job_id}_final.mp4"
    )

    if not os.path.exists(file_path):

        return jsonify({
            "erro": "Vídeo não encontrado"
        }), 404

    return send_file(
        file_path,
        as_attachment=True
    )

@app.route("/finalize", methods=["POST"])
def finalize_video():
    try:
        # Agora recebemos os dados no formato Formulário (FormData) enviado pelo React
        job_id = request.form.get("job_id")
        avatar_file = request.files.get("avatar_video")

        if not job_id or not avatar_file:
            return jsonify({"erro": "Parâmetros job_id ou avatar_video ausentes"}), 400

        # Caminhos dos arquivos
        original_video_path = os.path.join(UPLOAD_FOLDER, f"{job_id}_original.mp4")
        # Atenção: Agora salvamos com a extensão .webm original do navegador
        avatar_video_path = os.path.join(TEMP_FOLDER, f"{job_id}_avatar.webm")
        normalized_avatar_path = os.path.join(TEMP_FOLDER, f"{job_id}_normalized.mp4")
        final_video_path = os.path.join(OUTPUT_FOLDER, f"{job_id}_final.mp4")

        # 1. Salva o vídeo que veio direto do seu frontend
        print("[-] Recebendo avatar em WEBM direto do navegador...")
        avatar_file.save(avatar_video_path)

        # 2. Obter metadados do vídeo original do usuário
        original_info = get_video_info(original_video_path)

        # 3. Ajustar o tempo/FPS do avatar (O FFmpeg lê WEBM nativamente!)
        print("[-] Normalizando escala de tempo do avatar...")
        normalize_avatar(
            avatar_video_path,
            original_info["fps"],
            original_info["duration"],
            normalized_avatar_path
        )

        # 4. Mesclar os vídeos criando o efeito de canto de tela
        print("[-] Mesclando vídeos (Picture-in-Picture)...")
        merge_videos(
            original_video_path,
            normalized_avatar_path,
            final_video_path,
            original_info["width"],
            original_info["height"]
        )
        
        # 5. Limpeza de arquivos temporários e do original (TUDO AQUI AGORA)
        if os.path.exists(original_video_path): os.remove(original_video_path)
        if os.path.exists(avatar_video_path): os.remove(avatar_video_path)
        if os.path.exists(normalized_avatar_path): os.remove(normalized_avatar_path)

        return jsonify({
            "status": "success",
            "video_final": f"/download/{job_id}"
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"erro": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)