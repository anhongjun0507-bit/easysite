#!/usr/bin/env python3
"""디스플레이(명조) 폰트 서브셋 — /letters 전용 (나눔명조, OFL).

/letters 의 큰 제목은 첫 화면 LCP 라서 폰트가 무거우면 그대로 손해다.
그래서 상용 한글 2,350자를 다 넣지 않고, **src/content/letters-copy.ts 에 실제로 쓰인 글자만**
남긴다(보통 100자 미만 → 10KB 안팎).

⚠️ letters-copy.ts 의 문구를 고치면 이 스크립트를 다시 돌려야 한다.
   (빠뜨린 글자는 Pretendard 로 대체돼 눈에 띈다)

사용:  python3 scripts/subset-display-font.py
출력:  public/fonts/display/NanumMyeongjo-{Regular,ExtraBold}.subset.woff2
"""

import re
import subprocess
import sys
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parent.parent
COPY = ROOT / "src" / "content" / "letters-copy.ts"
OUT_DIR = ROOT / "public" / "fonts" / "display"
BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl/nanummyeongjo/NanumMyeongjo-{}.ttf"
WEIGHTS = ["Regular", "ExtraBold"]

# 문구에 없더라도 항상 넣어 두는 글자 — 숫자·기본 문장부호(카운트업, 날짜에 쓰인다)
ALWAYS = "0123456789.,·'\"()[]?!:%/ "


def copy_chars() -> str:
    """letters-copy.ts 의 따옴표 안 문자열을 전부 긁는다(단순 파서로 충분)."""
    src = COPY.read_text(encoding="utf-8")
    literals = re.findall(r"'([^']*)'", src) + re.findall(r'"([^"]*)"', src)
    return "".join(literals).replace("\\n", "")


def main() -> int:
    chars = "".join(sorted(set(copy_chars() + ALWAYS)))
    print(f"· 서브셋 대상 문자 수: {len(chars)}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for weight in WEIGHTS:
        tmp = Path(f"/tmp/NanumMyeongjo-{weight}.ttf")
        if not tmp.exists():
            url = BASE.format(weight)
            print(f"· 원본 다운로드: {url}")
            tmp.write_bytes(urlopen(url, timeout=90).read())

        out = OUT_DIR / f"NanumMyeongjo-{weight}.subset.woff2"
        subprocess.run(
            [
                sys.executable,
                "-m",
                "fontTools.subset",
                str(tmp),
                f"--text={chars}",
                "--flavor=woff2",
                "--layout-features=*",
                "--no-hinting",
                "--desubroutinize",
                f"--output-file={out}",
            ],
            check=True,
        )
        print(f"· 완료: {out.relative_to(ROOT)} ({out.stat().st_size / 1024:.1f} KB)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
