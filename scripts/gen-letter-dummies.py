#!/usr/bin/env python3
"""편지 스캔 더미 생성 — /letters 전용.

실제 손편지 스캔이 도착하기 전까지 전체 스크롤 플로우를 돌리기 위한 placeholder.
크림 종이 + 괘선 + 접힌 자국 + 잉크 필기 스트로크 + 그레인을 절차적으로 그린다.
(스톡 사진은 쓰지 않는다)

사용:  python3 scripts/gen-letter-dummies.py
출력:  public/letters/dummy-01a.jpg …
       + src/content/letters-blur.ts (파일명 → blurDataURL 맵, 자동 생성)

실제 스캔이 오면 같은 파일명으로 교체하거나, letters.ts 의 images 경로만 바꾸면 된다.
"""

import base64
import io
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "letters"

W, H = 1200, 1700
PAPERS = {
    # (base, warm shade) — 편지지 3종은 서로 다른 종이 톤을 쓴다
    "cream": ((243, 235, 216), (223, 210, 184)),
    "ivory": ((240, 233, 222), (216, 205, 188)),
    "blush": ((242, 231, 222), (219, 201, 190)),
}
INK = (32, 46, 78)


def paper(base, shade, rng):
    img = Image.new("RGB", (W, H), base)
    d = ImageDraw.Draw(img, "RGBA")

    # 얼룩진 종이 톤 — 큰 반경의 흐린 얼룩 여러 개
    for _ in range(26):
        cx, cy = rng.randint(-100, W + 100), rng.randint(-100, H + 100)
        r = rng.randint(120, 420)
        a = rng.randint(6, 16)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*shade, a))
    img = img.filter(ImageFilter.GaussianBlur(38))
    return img


def rules(img, rng, top=210, gap=74):
    """괘선 — 아주 옅은 하늘색 선"""
    d = ImageDraw.Draw(img, "RGBA")
    y = top
    while y < H - 150:
        d.line((110, y, W - 110, y), fill=(120, 145, 175, 34), width=2)
        y += gap
    return img


def _glyph(d, rng, x, y, size):
    """한 글자 흉내 — 정사각 셀 안에 짧은 가로/세로/곡선 획 2~4개.
    한글은 네모틀 문자라, 물결선보다 이렇게 그려야 멀리서 손글씨처럼 읽힌다."""
    ink = (*INK, rng.randint(135, 205))
    w = rng.choice([3, 3, 4])
    for _ in range(rng.randint(2, 4)):
        kind = rng.random()
        x0 = x + rng.uniform(0, size * 0.35)
        y0 = y + rng.uniform(0, size * 0.5)
        if kind < 0.42:  # 가로획
            d.line((x0, y0, x0 + rng.uniform(size * 0.4, size * 0.85), y0 + rng.uniform(-2, 2)), fill=ink, width=w)
        elif kind < 0.74:  # 세로획
            d.line((x0, y0 - size * 0.35, x0 + rng.uniform(-2, 3), y0 + rng.uniform(size * 0.15, size * 0.45)), fill=ink, width=w)
        elif kind < 0.9:  # 짧은 사선(ㅅ·ㅈ 계열)
            d.line((x0, y0, x0 + rng.uniform(size * 0.25, size * 0.5), y0 + size * 0.3), fill=ink, width=w)
        else:  # 동그라미(ㅇ·ㅎ)
            r = rng.uniform(size * 0.16, size * 0.26)
            d.ellipse((x0, y0 - r, x0 + r * 2, y0 + r), outline=ink, width=max(2, w - 1))


def handwriting(img, rng, lines=16, top=250, gap=74):
    """필기 — 괘선 위에 글자 셀을 낱말 단위로 배치(낱말 사이 공백·문단 끝 짧은 줄)"""
    d = ImageDraw.Draw(img, "RGBA")
    y = top
    for _ in range(lines):
        if rng.random() < 0.08:  # 가끔 한 줄 비워 문단 사이 여백
            y += gap
            continue
        x = 132 + rng.uniform(0, 30)
        end = W - 132 - (rng.uniform(180, 520) if rng.random() < 0.3 else rng.uniform(0, 90))
        while x < end:
            for _ in range(rng.randint(2, 5)):  # 한 낱말
                size = rng.uniform(30, 38)
                if x + size > end:
                    break
                _glyph(d, rng, x, y - size * 0.15, size)
                x += size + rng.uniform(1, 4)
            x += rng.uniform(12, 22)  # 낱말 사이
        y += gap
    return img


def creases(img, rng):
    """가로 접힌 자국 2줄 + 미세한 밝기 변화"""
    d = ImageDraw.Draw(img, "RGBA")
    for f in (0.34, 0.67):
        y = int(H * f) + rng.randint(-14, 14)
        d.line((0, y, W, y), fill=(120, 105, 82, 26), width=6)
        d.line((0, y - 3, W, y - 3), fill=(255, 252, 242, 34), width=3)
    return img.filter(ImageFilter.GaussianBlur(0.6))


def grain(img, rng, strength=9):
    noise = Image.effect_noise((W, H), 26).convert("L")
    return Image.blend(img, Image.merge("RGB", (noise, noise, noise)), strength / 100)


def vignette(img):
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse((-W * 0.25, -H * 0.18, W * 1.25, H * 1.18), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(180))
    dark = Image.new("RGB", (W, H), (146, 130, 104))
    return Image.composite(img, Image.blend(img, dark, 0.28), mask)


def blur_data_url(img):
    small = img.resize((10, 14), Image.LANCZOS)
    buf = io.BytesIO()
    small.save(buf, "JPEG", quality=40)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


BLUR_TS = ROOT / "src" / "content" / "letters-blur.ts"


def write_blur_map(entries):
    lines = [
        "// 자동 생성 파일 — 수정하지 말 것. (python3 scripts/gen-letter-dummies.py)",
        "// next/image placeholder=\"blur\" 용 저해상도 미리보기. 실제 스캔 교체 시 스크립트를 다시 돌린다.",
        "",
        "export const LETTER_BLUR: Record<string, string> = {",
    ]
    for name, data in entries:
        lines.append(f"  '/letters/{name}.jpg': '{data}',")
    lines += ["}", ""]
    BLUR_TS.parent.mkdir(parents=True, exist_ok=True)
    BLUR_TS.write_text("\n".join(lines), encoding="utf-8")
    print(f"· {BLUR_TS.relative_to(ROOT)} 생성 ({len(entries)}개)")


def build(name, tone, seed, lines):
    rng = random.Random(seed)
    base, shade = PAPERS[tone]
    img = paper(base, shade, rng)
    img = rules(img, rng)
    img = handwriting(img, rng, lines=lines)
    img = creases(img, rng)
    img = vignette(img)
    img = grain(img, rng)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / f"{name}.jpg"
    img.save(path, "JPEG", quality=78, optimize=True, progressive=True)
    print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.0f}KB")
    return name, blur_data_url(img)


if __name__ == "__main__":
    # (파일명, 종이톤, 시드, 줄 수)
    made = [
        build("dummy-01a", "cream", 11, 16),
        build("dummy-01b", "cream", 12, 13),
        build("dummy-02a", "ivory", 21, 17),
        build("dummy-03a", "blush", 31, 15),
        build("dummy-03b", "blush", 32, 11),
    ]
    write_blur_map(made)
