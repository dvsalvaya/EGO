from PIL import Image, ImageDraw, ImageOps
import os

BLOCK_SIZE = (512, 512)
FRAME_DIR = "public/assets/frames"

def process_frame(filename):
    path = os.path.join(FRAME_DIR, filename)
    if not os.path.exists(path): return

    print(f"Processing {filename}...")
    try:
        img = Image.open(path).convert("RGBA")
        
        # Resize to square standard
        img = ImageOps.fit(img, BLOCK_SIZE, method=Image.LANCZOS)
        
        # Create Masks
        # 1. Outer Circle (Keep inside)
        mask_outer = Image.new('L', BLOCK_SIZE, 0)
        draw_outer = ImageDraw.Draw(mask_outer)
        draw_outer.ellipse((0, 0) + BLOCK_SIZE, fill=255)
        
        # 2. Inner Circle (Make transparent - The "Hole")
        # Assuming frame thickness is about 15-20%?
        # Let's try to clear the center 75% to be safe (Avatar face zone)
        hole_ratio = 0.75
        hole_size = int(BLOCK_SIZE[0] * hole_ratio)
        offset = (BLOCK_SIZE[0] - hole_size) // 2
        
        mask_inner = Image.new('L', BLOCK_SIZE, 0)
        draw_inner = ImageDraw.Draw(mask_inner)
        draw_inner.ellipse((offset, offset, offset + hole_size, offset + hole_size), fill=255)
        
        # Combine Masks: Alpha = Outer AND (NOT Inner)
        # Actually easier: 
        #   Take image alpha.
        #   Multiply by Outer Mask.
        #   Subtract Inner Mask.
        
        current_alpha = img.split()[3]
        
        # New Alpha logic
        # For every pixel:
        # If outside outer circle -> 0
        # If inside inner circle -> 0
        # Else -> Keep original (or set to 255 if it was opaque jpg)
        
        # Let's create the 'ring' mask
        ring_mask = Image.new('L', BLOCK_SIZE, 0)
        draw = ImageDraw.Draw(ring_mask)
        
        # Draw outer white circle
        draw.ellipse((0, 0) + BLOCK_SIZE, fill=255)
        # Draw inner black circle
        draw.ellipse((offset, offset, offset + hole_size, offset + hole_size), fill=0)
        
        # Apply this ring mask to the image's alpha channel
        # If image was JPG (no alpha), this creates it. 
        # If it was PNG, we intersect with existing alpha to be safe.
        
        # Ensure mask is L mode
        if ring_mask.mode != 'L':
            ring_mask = ring_mask.convert('L')
            
        img.putalpha(ring_mask)
        
        # Save as PNG
        new_filename = filename.rsplit('.', 1)[0] + ".png"
        save_path = os.path.join(FRAME_DIR, new_filename)
        img.save(save_path, "PNG")
        print(f"Saved {new_filename}")
        
    except Exception as e:
        print(f"Failed to process {filename}: {e}")

files = os.listdir(FRAME_DIR)
for f in files:
    if f.lower().endswith(('.png', '.jpg', '.jpeg')):
        process_frame(f)
