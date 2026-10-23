"""Gera narrações em PT-BR e EN para as 3 novas obras da galeria.

Usa edge-tts (serviço online da Microsoft via implementação não oficial);
os MP3 são reproduzidos localmente, sem voz robótica do Safari.
Requer: python -m pip install edge-tts
"""
import asyncio
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "audio"
VOICES = {"pt-BR": "pt-BR-FranciscaNeural", "en-US": "en-US-JennyNeural"}
SCRIPTS = {
    "great-wave": {
        "pt-BR": "Você está diante de A Grande Onda de Kanagawa, gravura criada por Katsushika Hokusai por volta de 1830. Uma onda monumental se ergue sobre pequenas embarcações. Ao fundo, quase escondido entre as águas, vemos o monte Fuji. A força da natureza é revelada por linhas curvas e tons intensos de azul.",
        "en-US": "You are looking at The Great Wave off Kanagawa, a print by Katsushika Hokusai from around 1830. An enormous wave rises above small boats. In the distance, Mount Fuji sits quietly beneath the crest. Curved lines and deep blues capture the power and movement of the sea.",
    },
    "irises": {
        "pt-BR": "Esta obra se chama Íris, pintada por Vincent van Gogh em maio de 1890. O artista representou um buquê de flores violetas em contraste com um fundo rosado. As pinceladas curvas fazem as pétalas parecerem vivas. Com o passar do tempo, alguns pigmentos perderam intensidade, modificando as cores originais.",
        "en-US": "This painting is called Irises, created by Vincent van Gogh in May 1890. Violet flowers stand against a soft pink background. Curving brushstrokes make the petals seem alive. Over time, some pigments faded, changing the painting's original colors.",
    },
    "dance-class": {
        "pt-BR": "A Aula de Dança foi pintada por Edgar Degas em 1874. A cena mostra bailarinas e suas mães aguardando uma avaliação na antiga Ópera de Paris. No centro, uma jovem dança enquanto o mestre Jules Perrot observa. Degas revela o mundo do balé por meio de gestos espontâneos e uma composição que parece capturar um momento cotidiano.",
        "en-US": "The Dance Class was painted by Edgar Degas in 1874. Dancers and their mothers await an examination at the Paris Opéra. In the center, a young ballerina performs while master Jules Perrot watches. Through spontaneous gestures, Degas captures an intimate scene from the everyday world of ballet.",
    },

}


async def main():
    try:
        import edge_tts
    except ImportError:
        raise SystemExit("Instale primeiro: python -m pip install edge-tts")
    OUT.mkdir(parents=True, exist_ok=True)
    failed = 0
    for work, localized in SCRIPTS.items():
        for lang, narration in localized.items():
            path = OUT / f"{work}-{lang}.mp3"
            try:
                print(f"Gerando {path.name}...")
                await edge_tts.Communicate(narration, voice=VOICES[lang], rate="-6%").save(str(path))
                if path.stat().st_size < 1500:
                    raise ValueError("arquivo muito pequeno ou incompleto")
                print(f"OK: {path.name} ({path.stat().st_size//1024} KiB)")
            except Exception as exc:
                print(f"Erro em {path.name}: {exc}")
                failed += 1
    if failed:
        raise SystemExit(f"{failed} arquivos não foram gerados. Tente novamente.")
    print("Concluído! A galeria usará esses MP3s ao ouvir a história das obras.")
    print("Para o áudio do Van Gogh, rode também python generate_narrations.py")


if __name__ == "__main__":
    asyncio.run(main())
