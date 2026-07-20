#!/usr/bin/env python3
"""서브셋 대상 문자표 — 한글 폰트를 굽는 스크립트들이 함께 쓴다.

KS X 1001 상용 한글 2,350자 + 라틴·숫자·구두점.
(subset-handwriting-font.py 에 있던 것을 subset-letters-font.py 와 공유하려고 옮겼다)
"""

# 라틴·숫자·구두점 + 편지에서 실제로 쓰는 기호
_ASCII = [chr(cp) for cp in range(0x20, 0x7F)]
_EXTRA = list("―—–…·‘’“”「」『』〈〉《》×÷℃※★☆○●△▲□■♥→←↑↓°")


def _encodable(ch: str) -> bool:
    """KS X 1001 상용 한글(2,350자)인지 — 파이썬 euc_kr 코덱은 UHC 확장(11,172자)까지
    받아주므로, 인코딩 결과 바이트가 KS X 1001 한글 영역(0xB0A1~0xC8FE)인지까지 확인한다."""
    try:
        b = ch.encode("euc-kr")
    except UnicodeEncodeError:
        return False
    return len(b) == 2 and 0xB0 <= b[0] <= 0xC8 and 0xA1 <= b[1] <= 0xFE


def ks_x_1001_chars() -> str:
    """상용 한글 2,350자 + 라틴·숫자·구두점 — 본문/UI 를 다 그릴 수 있는 최소 집합"""
    hangul = [chr(cp) for cp in range(0xAC00, 0xD7A4) if _encodable(chr(cp))]
    return "".join(hangul + _ASCII + _EXTRA)
