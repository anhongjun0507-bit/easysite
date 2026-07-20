#!/usr/bin/env python3
"""손글씨 폰트 서브셋 — /letters 전용 (나눔손글씨 다행체, OFL).

원본(NAVER CLOVA 나눔손글씨 109종, SIL Open Font License → 수정·재배포·임베딩 허용)을 받아
KS X 1001 상용 한글 2,350자 + 라틴·숫자·구두점만 남긴 woff2 로 줄인다.
(3.3MB woff → 수백 KB woff2)

딥블랙 배경에 얹는 본문이라 획이 가는 '펜'체 대신 획 굵기가 고른 '다행체'를 쓴다.

사용:  python3 scripts/subset-handwriting-font.py
출력:  public/fonts/handwriting/NanumDaHaeng.subset.woff2
"""

import subprocess
import sys
from pathlib import Path
from urllib.request import urlopen

sys.path.insert(0, str(Path(__file__).resolve().parent))
from hangul_charset import ks_x_1001_chars  # noqa: E402

SRC_URL = "https://cdn.jsdelivr.net/gh/projectnoonnu/naverfont_02@1.0/Daheng.woff"
ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "fonts" / "handwriting"
OUT = OUT_DIR / "NanumDaHaeng.subset.woff2"
TMP = Path("/tmp/NanumDaHaengCe.woff")


def main() -> int:
    if not TMP.exists():
        print(f"· 원본 다운로드: {SRC_URL}")
        TMP.write_bytes(urlopen(SRC_URL, timeout=60).read())

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chars = ks_x_1001_chars()
    print(f"· 서브셋 대상 문자 수: {len(chars)}")

    subprocess.run(
        [
            sys.executable,
            "-m",
            "fontTools.subset",
            str(TMP),
            f"--text={chars}",
            "--flavor=woff2",
            "--layout-features=*",
            "--no-hinting",
            "--desubroutinize",
            f"--output-file={OUT}",
        ],
        check=True,
    )
    print(f"· 완료: {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
