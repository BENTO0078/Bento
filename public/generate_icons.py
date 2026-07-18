#!/usr/bin/env python3
"""Generate Bento PWA icons — emerald rounded square with white 'B' on dark background."""

from PIL import Image, ImageDraw, ImageFont
import os

PUBLIC_DIR = os.path.dirname(os.path.abspath(__file__))

DARK = (15, 23, 42)       # #0f172a
EMERALD = (16, 185, 129)  # #10b981
WHITE = (255, 255, 255)

SIZES = [192, 512]


def create_icon(size: int) -> Image.Image:
    """Create a single icon at the given size."""
    img = Image.new("RGBA", (size, size), DARK + (255,))
    draw = ImageDraw.Draw(img)

    # Calculate emerald rounded square
    margin = int(size * 0.11)
    corner_radius = int(size * 0.22)

    # Draw rounded rectangle (emerald)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=corner_radius,
        fill=EMERALD,
    )

    # Draw white "B" centered
    font_size = int(size * 0.58)
    try:
        # Try system fonts in order of preference
        font = None
        for font_name in [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
            "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
        ]:
            if os.path.exists(font_name):
                font = ImageFont.truetype(font_name, font_size)
                break

        if font is None:
            font = ImageFont.load_default()
    except Exception:
        font = ImageFont.load_default()

    # Measure and center the text
    bbox = draw.textbbox((0, 0), "B", font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) / 2 - bbox[0]
    y = (size - text_h) / 2 - bbox[1]
    draw.text((x, y), "B", fill=WHITE, font=font)

    return img


def main():
    for size in SIZES:
        icon = create_icon(size)
        path = os.path.join(PUBLIC_DIR, f"icon-{size}.png")
        icon.save(path, "PNG")
        print(f"Created {path} ({size}x{size})")


if __name__ == "__main__":
    main()
