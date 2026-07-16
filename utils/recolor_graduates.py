import os
from PIL import Image

def recolor_to_maroon(img_path):
    print(f"Recoloring {img_path} to maroon...")
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    recolored_count = 0
    for item in datas:
        r, g, b, a = item
        if a > 0:
            # Recoloring to Brand Monk's deep maroon color (77, 16, 16)
            # maintaining the original alpha/transparency level
            new_data.append((77, 16, 16, a))
            recolored_count += 1
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(img_path, "PNG")
    print(f"Done. Recolored {recolored_count} pixels.")

if __name__ == "__main__":
    public_dir = r"c:\Users\Gowshika\Desktop\bma webinar portal\Brandmonk_Webinar_frontend\public"
    grad_path = os.path.join(public_dir, "graduates-silhouette.png")
    if os.path.exists(grad_path):
        recolor_to_maroon(grad_path)
