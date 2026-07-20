#!/usr/bin/env python3
"""/letters 제목·UI 서체 서브셋 — 동글동글한 한글 무료 폰트 3종 (전부 OFL).

한 폰트당 두 개를 굽는다.

  · display — src/content/letters-copy.ts 에 **실제로 쓰인 글자만**. 100자 안팎 → 10KB 안팎.
              첫 화면(LCP)에 preload 하는 파일이라 여기에 2,350자를 넣으면 그대로 손해다.
  · ui      — KS X 1001 상용 한글 2,350자 + 라틴·구두점. 날짜·버튼·우편함처럼
              문구가 바뀔 수 있는 자리를 다 그린다. preload 하지 않고 swap 으로 늦게 받는다.

⚠️ letters-copy.ts 의 문구를 고치면 이 스크립트를 다시 돌려야 한다(빠진 글자는 대체 서체로 그려진다).

라이선스 (2026-07 확인)
  · 배민 주아(Jua)        SIL OFL 1.1 — Google Fonts 수록
  · 카페24 써라운드        OFL — 수정·복제·배포 가능, 폰트 자체의 유료 판매만 금지
  · 카페24 동동            OFL — 위와 동일
  (넥슨 배찌체는 "폰트 파일의 수정·복제·배포 금지"라 서브셋 자체가 불가 → 후보에서 제외했다)

사용:  python3 scripts/subset-letters-font.py            # 3종 전부
       python3 scripts/subset-letters-font.py jua        # 하나만
출력:  public/fonts/ui/{key}.{display,ui}.subset.woff2 + LICENSE.md
"""

import re
import subprocess
import sys
from pathlib import Path
from urllib.request import urlopen

sys.path.insert(0, str(Path(__file__).resolve().parent))
from hangul_charset import ks_x_1001_chars  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
COPY = ROOT / "src" / "content" / "letters-copy.ts"
OUT_DIR = ROOT / "public" / "fonts" / "ui"

FONTS = {
    "jua": {
        "label": "배민 주아 (Jua)",
        "url": "https://raw.githubusercontent.com/google/fonts/main/ofl/jua/Jua-Regular.ttf",
        "license": "SIL Open Font License 1.1 — https://fonts.google.com/specimen/Jua",
    },
    "ssurround": {
        "label": "카페24 써라운드",
        "url": "https://raw.githubusercontent.com/fonts-archive/Cafe24Ssurround/main/Cafe24Ssurround.ttf",
        "license": "OFL (수정·재배포 가능, 폰트 유료 판매 금지) — https://fonts.cafe24.com",
    },
    "dongdong": {
        "label": "카페24 동동",
        "url": "https://raw.githubusercontent.com/fonts-archive/Cafe24Dongdong/main/Cafe24Dongdong.ttf",
        "license": "OFL (수정·재배포 가능, 폰트 유료 판매 금지) — https://fonts.cafe24.com",
    },
}

# 문구에 없더라도 항상 넣어 두는 글자 — 숫자·기본 문장부호(카운트업, 날짜, 소인에 쓰인다)
ALWAYS = "0123456789.,·'\"()[]?!:%/ 년월일통장"


def copy_chars() -> str:
    """letters-copy.ts 의 따옴표 안 문자열을 전부 긁는다(단순 파서로 충분)."""
    src = COPY.read_text(encoding="utf-8")
    literals = re.findall(r"'([^']*)'", src) + re.findall(r'"([^"]*)"', src)
    return "".join(literals).replace("\\n", "")


def subset(src: Path, chars: str, out: Path) -> int:
    subprocess.run(
        [
            sys.executable,
            "-m",
            "fontTools.subset",
            str(src),
            f"--text={chars}",
            "--flavor=woff2",
            "--layout-features=*",
            "--no-hinting",
            "--desubroutinize",
            f"--output-file={out}",
        ],
        check=True,
    )
    size = out.stat().st_size
    print(f"  · {out.name}  {size / 1024:.0f} KB")
    return size


def write_license():
    lines = [
        "# /letters 제목·UI 서체 라이선스",
        "",
        "`scripts/subset-letters-font.py` 가 원본을 받아 서브셋한 결과물이다.",
        "세 폰트 모두 OFL 계열이라 수정(서브셋)·재배포·웹 임베딩이 허용된다.",
        "",
    ]
    for key, f in FONTS.items():
        lines += [f"## {f['label']} (`{key}`)", "", f"- 원본: {f['url']}", f"- 라이선스: {f['license']}", ""]
    lines += [
        "## 제외한 후보",
        "",
        "- 넥슨 배찌체 — \"폰트 파일의 수정·복제·배포 금지, 배포된 형태 그대로 사용\" 조항이라",
        "  서브셋(수정 + 재배포) 파이프라인에 쓸 수 없다.",
        "",
    ]
    (OUT_DIR / "LICENSE.md").write_text("\n".join(lines), encoding="utf-8")


def main(argv: list[str]) -> int:
    keys = argv or list(FONTS)
    unknown = [k for k in keys if k not in FONTS]
    if unknown:
        print(f"모르는 폰트: {', '.join(unknown)} (가능: {', '.join(FONTS)})", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    display_chars = "".join(sorted(set(copy_chars() + ALWAYS)))
    ui_chars = ks_x_1001_chars()
    print(f"· display 문자 {len(display_chars)}자 / ui 문자 {len(ui_chars)}자")

    for key in keys:
        font = FONTS[key]
        print(f"\n[{key}] {font['label']}")
        tmp = Path(f"/tmp/letters-font-{key}.ttf")
        if not tmp.exists():
            print(f"  · 원본 다운로드: {font['url']}")
            tmp.write_bytes(urlopen(font["url"], timeout=120).read())
        subset(tmp, display_chars, OUT_DIR / f"{key}.display.subset.woff2")
        subset(tmp, ui_chars, OUT_DIR / f"{key}.ui.subset.woff2")

    write_license()
    print(f"\n· {OUT_DIR.relative_to(ROOT)}/LICENSE.md 갱신")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
