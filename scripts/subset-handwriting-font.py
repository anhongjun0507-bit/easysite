#!/usr/bin/env python3
"""손글씨 폰트 서브셋 — /letters 전용 (나눔손글씨 펜, OFL).

원본(Google Fonts, Open Font License → 재배포·임베딩 허용)을 받아
KS X 1001 상용 한글 2,350자 + 라틴·숫자·구두점만 남긴 woff2 로 줄인다.
(3.2MB ttf → 수백 KB woff2)

사용:  python3 scripts/subset-handwriting-font.py
출력:  public/fonts/handwriting/NanumPen.subset.woff2
"""

import subprocess
import sys
from pathlib import Path
from urllib.request import urlopen

SRC_URL = "https://fonts.gstatic.com/s/nanumpenscript/v25/daaDSSYiLGqEal3MvdA_FOL_3FkN2z4.ttf"
ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "fonts" / "handwriting"
OUT = OUT_DIR / "NanumPen.subset.woff2"
TMP = Path("/tmp/NanumPenScript.ttf")


def target_chars() -> str:
    # KS X 1001 상용 한글 2,350자 = euc-kr 로 인코딩 가능한 한글 음절
    hangul = [
        chr(cp)
        for cp in range(0xAC00, 0xD7A4)
        if _encodable(chr(cp))
    ]
    # 라틴·숫자·구두점 + 편지에서 실제로 쓰는 기호
    ascii_range = [chr(cp) for cp in range(0x20, 0x7F)]
    extra = list("―—–…·‘’“”「」『』〈〉《》×÷℃※★☆○●△▲□■♥→←↑↓°")
    return "".join(hangul + ascii_range + extra)


def _encodable(ch: str) -> bool:
    """KS X 1001 상용 한글(2,350자)인지 — 파이썬 euc_kr 코덱은 UHC 확장(11,172자)까지
    받아주므로, 인코딩 결과 바이트가 KS X 1001 한글 영역(0xB0A1~0xC8FE)인지까지 확인한다."""
    try:
        b = ch.encode("euc-kr")
    except UnicodeEncodeError:
        return False
    return len(b) == 2 and 0xB0 <= b[0] <= 0xC8 and 0xA1 <= b[1] <= 0xFE


def main() -> int:
    if not TMP.exists():
        print(f"· 원본 다운로드: {SRC_URL}")
        TMP.write_bytes(urlopen(SRC_URL, timeout=60).read())

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chars = target_chars()
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
