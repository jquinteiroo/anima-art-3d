"""Combina os alvos MindAR já compilados, sem recompilar as imagens.

Entradas:
  targets.mind: Van Gogh original (1 alvo)
  galeria-targets-novas.mind: Grande Onda, Aula de Dança e Íris (3 alvos)

Saída:
  galeria-targets.mind: Van Gogh, Grande Onda, Íris, Aula de Dança (4 alvos)

Requer: python -m pip install msgpack
"""
from pathlib import Path
import sys

try:
    import msgpack
except ImportError:
    print("Instale o pacote: python -m pip install msgpack")
    raise SystemExit(1)

ROOT = Path(__file__).resolve().parent
ORIGINAL = ROOT / "targets.mind"
NOVAS = ROOT / "galeria-targets-novas.mind"
COMPLETA = ROOT / "galeria-targets.mind"


def main() -> int:
    if not ORIGINAL.is_file():
        print(f"Arquivo original do Van Gogh não encontrado: {ORIGINAL}")
        return 1
    if not NOVAS.is_file():
        print(f"Arquivo das três obras novas não encontrado: {NOVAS}")
        return 1

    try:
        original = msgpack.unpackb(ORIGINAL.read_bytes(), raw=False)
        novas = msgpack.unpackb(NOVAS.read_bytes(), raw=False)
    except (ValueError, TypeError, msgpack.ExtraData, msgpack.FormatError) as exc:
        print(f"Arquivo .mind inválido: {exc}")
        return 1

    if len(original.get("dataList", [])) != 1:
        print("O targets.mind original deve conter um único alvo: Campo de Trigo com Ciprestes.")
        return 1
    if len(novas.get("dataList", [])) != 3:
        print("O galeria-targets-novas.mind deve conter exatamente três alvos.")
        return 1
    if original.get("v") != 2 or novas.get("v") != 2:
        print("Os arquivos precisam utilizar o formato MindAR v2.")
        return 1

    # Índices: 0 Van Gogh, 1 Hokusai, 2 Íris, 3 Degas.
    resultado = {
        "v": 2,
        "dataList": [
            original["dataList"][0],
            novas["dataList"][0],
            novas["dataList"][2],
            novas["dataList"][1],
        ],
    }

    encoded = msgpack.packb(resultado, use_bin_type=True)
    assert len(msgpack.unpackb(encoded, raw=False)["dataList"]) == 4
    COMPLETA.write_bytes(encoded)
    print(f"OK: {COMPLETA} ({len(encoded):,} bytes, quatro alvos)")
    print("Ordem: Van Gogh, Grande Onda, Íris, Aula de Dança")
    print("Agora reinicie a galeria e teste os quatro alvos.")
    print("Para versionar: git add frontend/poc-mindar/galeria-targets.mind")
    print('git commit -m "assets: adiciona quatro alvos da galeria"')
    print("git push origin master")
    return 0


if __name__ == "__main__":
    sys.exit(main())
