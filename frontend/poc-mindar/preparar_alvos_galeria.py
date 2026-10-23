"""Baixa, em ordem estável, quatro imagens Open Access do Metropolitan Museum.

Use os QUATRO JPGs gerados no compilador oficial do MindAR, nesta ordem.
Depois salve o resultado como galeria-targets.mind na pasta poc-mindar.
Requer internet. Utiliza apenas a biblioteca padrão do Python.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import time

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "alvos-galeria"
IMAGES = [
    ("01-van-gogh-ciprestes.jpg", "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg"),
    ("02-hokusai-grande-onda.jpg", "https://images.metmuseum.org/CRDImages/as/web-large/DP141042.jpg"),
    ("03-van-gogh-iris.jpg", "https://images.metmuseum.org/CRDImages/ep/web-large/DP346474.jpg"),
    ("04-degas-aula-danca.jpg", "https://images.metmuseum.org/CRDImages/ep/web-large/DP-20101-001.jpg"),
]


def download(name: str, url: str) -> None:
    dest = OUT / name
    if dest.is_file() and dest.stat().st_size > 4096:
        print(f"OK (já existe): {name}")
        return
    for attempt in range(1, 4):
        try:
            req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; AnimaArt3D/1.0)"})
            with urlopen(req, timeout=30) as response:
                if response.headers.get("Content-Type", "").lower().startswith("text/html"):
                    raise ValueError("O servidor devolveu HTML, não uma imagem")
                data = response.read()
            if len(data) < 4096 or not data.startswith(b"\xff\xd8"):
                raise ValueError("Resposta não parece um arquivo JPEG válido")
            dest.write_bytes(data)
            print(f"OK: {name} ({len(data)//1024} KiB)")
            return
        except (HTTPError, URLError, TimeoutError, OSError, ValueError) as exc:
            print(f"Falha {attempt}/3 em {name}: {exc}")
            if attempt < 3:
                time.sleep(2)
    raise RuntimeError(f"Não foi possível baixar: {name}. Abra a URL no navegador: {url}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for filename, url in IMAGES:
        download(filename, url)
    print("\nQuatro imagens prontas em:", OUT)
    legacy = OUT / "05-sargent-madame-x.jpg"
    if legacy.exists():
        print("AVISO: arquivo antigo 05-sargent-madame-x.jpg ainda existe.")
        print("NÃO selecione esse arquivo ao compilar. Use somente os arquivos 01 a 04.")
    print("Abra https://hiukim.github.io/mind-ar-js-doc/tools/compile/")
    print("Selecione as quatro imagens na ordem 01 -> 04, clique Start e depois Download.")
    print("Renomeie targets.mind para galeria-targets.mind e coloque junto de galeria.html.")
    print("Depois: git add frontend/poc-mindar/galeria-targets.mind && git commit && git push")


if __name__ == "__main__":
    main()
