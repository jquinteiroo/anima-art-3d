"""Gere as locuções offline para reprodução no site, sem API key.

O Edge TTS usa serviço ONLINE da Microsoft; o arquivo MP3 gerado
fica guardado no projeto para reprodução local/offline depois.
Esta integração não é uma API comercial oficial com SLA.
"""
import asyncio
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONFIG = ROOT / "audio" / "narrations.json"
OUTPUT_DIR = ROOT / "audio"


async def main() -> int:
    try:
        import edge_tts
    except ImportError:
        print("Dependência ausente: execute 'py -m pip install edge-tts' e tente novamente.")
        return 1

    try:
        languages = json.loads(CONFIG.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        print(f"Não foi possível ler {CONFIG}: {exc}")
        return 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    errors = 0
    for locale, settings in languages.items():
        name = settings["filename"]
        voice = settings["voice"]
        rate = settings.get("rate", "-6%")
        dest = OUTPUT_DIR / name
        temp = OUTPUT_DIR / (name + ".part")
        print(f"Gerando {locale}: {voice} → {dest.name} ...", flush=True)
        try:
            speaker = edge_tts.Communicate(
                text=settings["text"], voice=voice, rate=rate
            )
            await speaker.save(str(temp))
            if not temp.exists() or temp.stat().st_size < 1500:
                raise RuntimeError("O áudio gerado está vazio ou incompleto.")
            temp.replace(dest)
            print(f"Concluído: {dest} ({dest.stat().st_size:,} bytes)")
        except Exception as exc:
            errors += 1
            temp.unlink(missing_ok=True)
            print(f"Erro em {locale}: {exc}", file=sys.stderr)

    if errors:
        print(f"{errors} idioma(s) não foram gerados. Verifique a conexão e tente de novo.")
        return 1
    print("Narrações prontas. Atualize animada.html no navegador.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
