# Libras AI — Grupo 4

Sistema responsável pela integração e geração do vídeo final com tradução em Libras.

## 📌 Objetivo

O projeto recebe um vídeo enviado pelo usuário e realiza o fluxo de processamento para gerar um novo vídeo com acessibilidade em Libras.

O Grupo 4 atua como integrador principal entre os serviços responsáveis por:

- extração de áudio;
- transcrição do conteúdo;
- processamento do avatar em Libras;
- composição final do vídeo.

---

# ⚙️ Fluxo do Sistema

O backend realiza:

1. Upload do vídeo original;
2. Envio do vídeo para API de extração de áudio;
3. Envio do vídeo para API de transcrição;
4. Recebimento do conteúdo transcrito;
5. Processamento do avatar em Libras;
6. Sincronização do avatar com o vídeo original;
7. Geração do vídeo final utilizando FFmpeg.

---

# 🧩 Integrações

## Grupo 1 — Extração de Áudio

Responsável pela extração do áudio do vídeo enviado.

---

## Grupo 2 — Transcrição

Responsável por gerar a transcrição automática do conteúdo do vídeo.

---

## Grupo 3 — Avatar Libras

Responsável pela renderização e animação do avatar em Libras.

---

# 🛠️ Tecnologias Utilizadas

## Backend

- Python
- Flask
- FFmpeg
- Requests

## Frontend

- React
- Vite
- TailwindCSS

---

# 📂 Estrutura do Projeto

```txt
backend/
frontend/
```

---

# ▶️ Executando o Backend

## Instalar dependências

```bash
pip install -r requirements.txt
```

## Executar servidor

```bash
python app.py
```

---

# ▶️ Executando o Frontend

## Instalar dependências

```bash
npm install
```

## Executar projeto

```bash
npm run dev
```

---

# 📹 Funcionalidades

- Upload de vídeo;
- Extração automática de áudio;
- Transcrição automática;
- Integração com avatar em Libras;
- Geração de vídeo acessível;
- Download do vídeo final.

---

# 👥 Equipe
-ADRIEL DAYWISON BIBIANO LUIZ -ANDERSON OLÍVIO DE ALMEIDA SILVA -ARTHUR DA SILVA BEZERRA DE SANTANA -DANDÁLIA LUIZA DA SILVA TEIXEIRA -JADER GABRIEL DE OLIVEIRA SILVA -KAUAM BRILHANTE COSTA -VICTORIA MARIA BELTRÃO DE ANDRADE

Projeto desenvolvido durante a Residência Tecnológica.

Grupo 4 — Libras AI
