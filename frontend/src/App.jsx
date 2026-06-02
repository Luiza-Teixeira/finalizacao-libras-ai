import { useState } from "react";
import { Upload, Download } from "lucide-react";

function findCanvasDeep(element) {
  if (!element) return null;
  if (element.tagName === "CANVAS") return element;
  if (element.shadowRoot) {
    const found = findCanvasDeep(element.shadowRoot);
    if (found) return found;
  }
  for (let i = 0; i < element.children.length; i++) {
    const found = findCanvasDeep(element.children[i]);
    if (found) return found;
  }
  return null;
}

function srtToMs(timeString) {
  if (!timeString) return 0;
  const parts = timeString.replace('.', ',').split(',');
  const main = parts[0];
  const ms = parts[1] || '0';
  const [h, m, s] = main.split(':');
  return parseInt(h, 10) * 3600000 + parseInt(m, 10) * 60000 + parseInt(s, 10) * 1000 + parseInt(ms, 10);
}

const getVideoDuration = (file) => new Promise((resolve) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.onloadedmetadata = () => resolve(video.duration * 1000);
  video.src = URL.createObjectURL(file);
});

export default function LibrasAvatarDashboard() {
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [transcription, setTranscription] = useState([]);
  const [finalVideoUrl, setFinalVideoUrl] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const startPipeline = async () => {
    if (!videoFile) return alert("Selecione um vídeo primeiro.");
    
    try {
      setStatus("processing_back");
      
      const formData = new FormData();
      formData.append("file", videoFile);

      const response = await fetch("http://localhost:5000/process", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.erro) throw new Error(data.erro);

      if (data.transcription_api) {
        setTranscription([["00:00:00", data.transcription_api]]);
      }

      await recordVlibrasCanvas(data.job_id, data.glosas);

    } catch (error) {
      console.error(error);
      alert("Erro no processamento: " + error.message);
      setStatus("idle");
    }
  };

  const recordVlibrasCanvas = (jobId, glosasList) => {
    return new Promise((resolve, reject) => {
      
      const setupRecording = async () => {
        try {
          setStatus("recording_avatar");

          const videoDurationMs = await getVideoDuration(videoFile);

          const vwWrapper = document.querySelector('[vw-plugin-wrapper]');
          const vwButton = document.querySelector('[vw-access-button]');

          const isAlreadyOpen = vwWrapper && vwWrapper.classList.contains('active');

          if (!isAlreadyOpen) {
              if (vwButton) vwButton.click();
          }

          let engineReady = false;
          for (let i = 0; i < 40; i++) {
              if (window.plugin && window.plugin.player && window.plugin.player.translate) {
                  engineReady = true;
                  break;
              }
              await new Promise(r => setTimeout(r, 500));
          }
          if (!engineReady) throw new Error("O motor 3D do VLibras não carregou.");

          if (!isAlreadyOpen) {
              await new Promise(r => setTimeout(r, 15000));
          } else {
              await new Promise(r => setTimeout(r, 2000));
          }

          const canvas = findCanvasDeep(document.body);
          if (!canvas) throw new Error("Canvas não encontrado.");

          const stream = canvas.captureStream(30);
          const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
          const chunks = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
          };

          mediaRecorder.onstop = async () => {
            try {
              setStatus("finalizando");
              const blob = new Blob(chunks, { type: "video/webm" });
              
              const formDataFinal = new FormData();
              formDataFinal.append("job_id", jobId);
              formDataFinal.append("avatar_video", blob, "avatar.webm"); 

              const resFinal = await fetch("http://localhost:5000/finalize", {
                method: "POST",
                body: formDataFinal
              });
              
              const dataFinal = await resFinal.json();
              if (dataFinal.erro) throw new Error("Erro no Python: " + dataFinal.erro);

              setFinalVideoUrl(`http://localhost:5000${dataFinal.video_final}`);
              setStatus("done");
              resolve();

            } catch (err) {
              reject(err);
            }
          };

          mediaRecorder.start();

          const listaFrases = glosasList.entries || []; 
          console.log(`[DEBUG] Quantidade de frases enviadas pelo Grupo 3:`, listaFrases.length);
          
          listaFrases.forEach((item) => {
            const timeInMs = srtToMs(item.start); 
            const tempoCorrigido = Math.max(0, timeInMs - 300);
            
            setTimeout(() => {
              const enviarFrase = (tentativa = 0) => {
                if (window.plugin && window.plugin.player && window.plugin.player.translate) {
                   
                   const textoBruto = item.texto_original || item.texto_otimizado || "";
                   
                   const textoLimpo = textoBruto.replace(/[\n\r"';:.,!?()[\]-]/g, ' ').replace(/\s+/g, ' ').trim();

                   if (textoLimpo.length > 0) {
                       console.log(`[LIBRAS] Sinalizando no tempo ${timeInMs}ms:`, textoLimpo);
                       window.plugin.player.translate(textoLimpo);
                   }

                } else if (tentativa < 5) {
                   setTimeout(() => enviarFrase(tentativa + 1), 200);
                }
              };
              enviarFrase();
            }, tempoCorrigido);
          });

          let tempoUltimaLegenda = 0;
          if (listaFrases.length > 0) {
            const ultimaFrase = listaFrases[listaFrases.length - 1];
            tempoUltimaLegenda = srtToMs(ultimaFrase.end);
          }
          
          const tempoTotalGravacao = Math.max(videoDurationMs, tempoUltimaLegenda) + 10000;

          setTimeout(() => {
            mediaRecorder.stop();
          }, tempoTotalGravacao);

        } catch (error) {
          reject(error);
        }
      };

      setupRecording();
    });
  };

  return (
    <div className="min-h-screen bg-[#07070A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-600/30">🤟</div>
          <div>
            <h1 className="text-3xl font-bold">Libras Avatar</h1>
            <p className="text-zinc-400 text-sm">Transforme seus vídeos em acessibilidade</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-2">1. Upload do vídeo</h2>
              <p className="text-zinc-400 text-sm mb-5">Envie um vídeo para extrair áudio e gerar a tradução.</p>
              
              <label className="border-2 border-dashed border-zinc-700 rounded-2xl h-56 flex flex-col items-center justify-center text-center hover:border-purple-500 transition-all cursor-pointer group">
                <input type="file" accept="video/mp4" className="hidden" onChange={handleFileChange} />
                <Upload className="w-14 h-14 text-purple-500 group-hover:scale-110 transition-transform mb-4" strokeWidth={1.8} />
                <p className="font-semibold text-lg">{videoFile ? videoFile.name : "Clique para enviar o vídeo"}</p>
                <p className="text-zinc-500 text-sm mt-2">MP4</p>
              </label>

              {videoFile && status === "idle" && (
                <button onClick={startPipeline} className="w-full mt-4 bg-purple-600 py-3 rounded-xl font-bold hover:bg-purple-500 transition-all">
                  Processar Pipeline Completo
                </button>
              )}
            </section>

            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-2">2. Texto extraído do áudio</h2>
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                {transcription.length > 0 ? transcription.map((item, index) => (
                  <div key={index} className="border-b border-zinc-800 pb-3">
                    <span className="text-purple-400 text-sm font-semibold block mb-1">{item[0]}</span>
                    <p className="text-zinc-200 text-sm leading-relaxed">{item[1]}</p>
                  </div>
                )) : <p className="text-zinc-500 text-sm">Nenhum texto processado ainda.</p>}
              </div>
            </section>

            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-2">3. Monitor do Sistema</h2>
              <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800 min-h-20 flex items-center justify-center">
                <span className="font-semibold text-purple-400 uppercase tracking-wider animate-pulse">
                  {status === "idle" && "Aguardando Início"}
                  {status === "processing_back" && "IA: Extraindo Áudio e Transcrevendo..."}
                  {status === "recording_avatar" && "Render: Gravando Sinais do VLibras..."}
                  {status === "finalizando" && "FFmpeg: Compondo Vídeo de Canto..."}
                  {status === "done" && "Concluído com Sucesso!"}
                </span>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">4. Visualização Final</h2>
              <div className="rounded-3xl overflow-hidden bg-black border border-zinc-800 aspect-video flex items-center justify-center">
                {status === "done" && finalVideoUrl ? (
                  <video src={finalVideoUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-8">
                    <div className="text-5xl mb-3">🎬</div>
                    <p className="text-zinc-500 text-sm">O player exibirá o resultado com a janela de Libras após o término do fluxo.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">5. Baixar resultado</h2>
                <p className="text-zinc-400 text-sm">Salve o arquivo MP4 finalizado localmente.</p>
              </div>
              <a href={finalVideoUrl} download disabled={!finalVideoUrl} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${finalVideoUrl ? "bg-gradient-to-r from-purple-700 to-purple-500 hover:opacity-90 shadow-purple-700/30 cursor-pointer" : "bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none"}`}>
                <Download className="w-5 h-5" />
                <span>BAIXAR VÍDEO</span>
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}