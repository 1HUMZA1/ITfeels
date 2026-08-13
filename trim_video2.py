import os
import shutil
from moviepy import VideoFileClip

def process():
    original = r"C:\Users\humza\.gemini\antigravity\scratch\IT Feels\assets\intro taste\change_the_app_intergace_in_th.mp4"
    dest = r"C:\Users\humza\.gemini\antigravity\scratch\IT Feels\website\assets\intro_animation.mp4"
    
    # Copy original to dest to restore it
    shutil.copy(original, dest)
    
    clip = VideoFileClip(dest)
    
    # Trim off only the last 1.5 seconds, which should contain the iMac and "IT FEELS"
    # This leaves the supported devices part intact!
    new_dur = clip.duration - 1.5
    print(f"Original: {clip.duration}, Trimming to {new_dur}")
    new_clip = clip.subclipped(0, new_dur)
    
    tmp_path = dest.replace(".mp4", "_tmp.mp4")
    new_clip.write_videofile(tmp_path, codec="libx264", audio=False)
    new_clip.close()
    clip.close()
    
    os.replace(tmp_path, dest)
    print("Done")

if __name__ == "__main__":
    process()
