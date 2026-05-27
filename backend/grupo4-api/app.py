import os
import uuid
import subprocess
import requests
import shutil

from flask import Flask, request, jsonify, send_file

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
TEMP_FOLDER = "temp"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)

FFMPEG = r"C:\Users\luiza\Documents\ffmpeg-8.1.1-essentials_build\bin\ffmpeg.exe"

FFPROBE = r"C:\Users\luiza\Documents\ffmpeg-8.1.1-essentials_build\bin\ffprobe.exe"

GRUPO1_API = "https://equipe01-extracaoaudio-globorio.onrender.com/upload"

GRUPO2_API = "https://adrianovalenca-api-vlibras-transcricao.hf.space/gerar-srt"

GRUPO3_API = "https://API_GRUPO_3/avatar"

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
        "-t", str(original_duration),

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

        "-shortest",

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

    try:
        with open(original_video_path, "rb") as audio_video:
            response = requests.post(
                GRUPO1_API,
                files={
                    "file": audio_video
                }
            )
        grupo1_json = response.json()

        print("ENVIANDO PARA GRUPO 2")

        with open(original_video_path, "rb") as video:
            response_grupo2 = requests.post(
                GRUPO2_API,
                files={
                    "file": video
                },
                timeout=300
            )

        print("GRUPO 2 RESPONDEU")
        print(response_grupo2.status_code)
        print(response_grupo2.text[:300])

        grupo2_texto = response_grupo2.text

        avatar_video_path = os.path.join(
            TEMP_FOLDER,
            f"{job_id}_avatar.mp4"
        )

        shutil.copy(
            r"C:\Users\luiza\Documents\teste-ffmpeg\avatar2.mp4",
            avatar_video_path
        )

        original_info = get_video_info(
            original_video_path
        )

        normalized_avatar_path = os.path.join(
            TEMP_FOLDER,
            f"{job_id}_avatar_sync.mp4"
        )

        normalize_avatar(
            avatar_video_path,
            original_info["fps"],
            original_info["duration"],
            normalized_avatar_path
        )

        final_video_path = os.path.join(
            OUTPUT_FOLDER,
            f"{job_id}_final.mp4"
        )

        merge_videos(
            original_video_path,
            normalized_avatar_path,
            final_video_path,
            original_info["width"],
            original_info["height"]
        )

        if os.path.exists(original_video_path):
            os.remove(original_video_path)

        if os.path.exists(avatar_video_path):
            os.remove(avatar_video_path)

        if os.path.exists(normalized_avatar_path):
            os.remove(normalized_avatar_path)

        return jsonify({
            "status": "ok",
            "job_id": job_id,
            "audio_api": grupo1_json,
            "transcription_api": grupo2_texto,
            "video_final": f"/download/{job_id}"
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

if __name__ == "__main__":
    app.run(debug=True)