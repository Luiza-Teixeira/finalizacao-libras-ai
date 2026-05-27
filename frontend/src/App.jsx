import {
  Upload,
  Play,
  Volume2,
  Settings,
  Maximize,
  Download,
} from "lucide-react";

export default function LibrasAvatarDashboard() {
  return (
    <div className="min-h-screen bg-[#07070A] text-white p-6">
      <div className="max-w-7xl mx-auto">

        <header className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-600/30">
            🤟
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Libras Avatar
            </h1>

            <p className="text-zinc-400 text-sm">
              Transforme seus vídeos em acessibilidade
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="flex flex-col gap-6">

            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl">

              <h2 className="text-xl font-bold mb-2">
                1. Upload do vídeo
              </h2>

              <p className="text-zinc-400 text-sm mb-5">
                Envie um vídeo para extrair áudio e gerar a tradução em Libras.
              </p>

              <div className="border-2 border-dashed border-zinc-700 rounded-2xl h-56 flex flex-col items-center justify-center text-center hover:border-purple-500 transition-all cursor-pointer group">

                <div className="mb-4">
                  <Upload
                    className="w-14 h-14 text-purple-500 group-hover:scale-110 transition-transform"
                    strokeWidth={1.8}
                  />
                </div>

                <p className="font-semibold text-lg">
                  Clique para enviar o vídeo
                </p>

                <p className="text-zinc-500 text-sm mt-2">
                  MP4
                </p>
              </div>
            </section>

            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl">

              <h2 className="text-xl font-bold mb-2">
                2. Texto extraído do áudio
              </h2>

              <p className="text-zinc-400 text-sm mb-5">
                O sistema identificou as falas do vídeo.
              </p>

              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">

                {[
                  [
                    "00:00:00",
                    "Olá, sejam todos bem-vindos ao nosso canal.",
                  ],
                  [
                    "00:00:04",
                    "Hoje vamos falar sobre acessibilidade e inclusão.",
                  ],
                  [
                    "00:00:08",
                    "A Libras é uma ferramenta fundamental.",
                  ],
                  [
                    "00:00:12",
                    "Para garantir acesso à informação.",
                  ],
                  [
                    "00:00:16",
                    "Com avatares 3D podemos ampliar a acessibilidade.",
                  ],
                  [
                    "00:00:20",
                    "Vamos construir um mundo mais inclusivo.",
                  ],
                ].map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-zinc-800 pb-3"
                  >
                    <span className="text-purple-400 text-sm font-semibold block mb-1">
                      {item[0]}
                    </span>

                    <p className="text-zinc-200 text-sm leading-relaxed">
                      {item[1]}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl">

              <h2 className="text-xl font-bold mb-2">
                3. Avatar 3D gerando Libras
              </h2>

              <p className="text-zinc-400 text-sm mb-5">
                Pré-visualização do avatar traduzindo o conteúdo.
              </p>

              <div className="bg-gradient-to-b from-purple-900/30 to-black rounded-2xl h-80 flex items-center justify-center relative overflow-hidden">

                <div className="absolute top-4 left-4 bg-purple-600 text-xs px-3 py-2 rounded-full font-semibold shadow-lg shadow-purple-600/40">
                  GERANDO...
                </div>

                <div className="w-44 h-44 rounded-full border-4 border-purple-500 bg-zinc-900 flex items-center justify-center overflow-hidden shadow-2xl shadow-purple-600/20">

                  <div className="flex flex-col items-center mt-10">

                    <div className="w-16 h-16 rounded-full bg-zinc-500 mb-2"></div>

                    <div className="w-24 h-20 rounded-t-full bg-zinc-600"></div>

                  </div>

                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">

            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl">

              <h2 className="text-2xl font-bold mb-2">
                4. Vídeo gerado com avatar
              </h2>

              <p className="text-zinc-400 text-sm mb-5">
                Resultado final com tradução em Libras.
              </p>

              <div className="rounded-3xl overflow-hidden bg-black border border-zinc-800">

                <div className="relative aspect-video">

                  <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">

                    <div className="text-center">

                      <div className="text-7xl mb-4">
                        🎬
                      </div>

                      <p className="text-zinc-400 text-sm">
                        Pré-visualização do vídeo final
                      </p>

                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 w-32 h-44 rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl bg-black">

                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center pt-6">

                      <div className="flex flex-col items-center">

                        <div className="w-16 h-16 rounded-full bg-zinc-500 mb-2"></div>

                        <div className="w-24 h-20 rounded-t-full bg-zinc-600"></div>

                      </div>

                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0D0D12] border-t border-zinc-800">

                  <div className="flex items-center gap-4 flex-1">

                    <button className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 transition-all flex items-center justify-center shadow-lg shadow-purple-600/30">

                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />

                    </button>

                    <span className="text-sm text-zinc-400">
                      00:00 / 01:23
                    </span>

                    <div className="h-2 flex-1 rounded-full bg-zinc-800 overflow-hidden">

                      <div className="w-1/3 h-full bg-purple-500 rounded-full"></div>

                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4 text-zinc-300">

                    <button className="hover:text-white transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>

                    <button className="hover:text-white transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>

                    <button className="hover:text-white transition-colors">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#111117] border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">

              <div>

                <h2 className="text-2xl font-bold mb-2">
                  5. Baixar vídeo
                </h2>

                <p className="text-zinc-400 text-sm">
                  Faça o download do vídeo com tradução em Libras.
                </p>
              </div>

              <button className="bg-gradient-to-r from-purple-700 to-purple-500 hover:opacity-90 transition-all px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-700/30">

                <div className="flex items-center gap-3">

                  <Download className="w-5 h-5" />

                  <span>
                    BAIXAR VÍDEO
                  </span>

                </div>
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}