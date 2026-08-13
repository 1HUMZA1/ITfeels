import sys
import os
from moviepy import VideoFileClip

def trim_video():
    input_path = "assets/intro_animation.mp4"
    output_path = "assets/intro_animation_trimmed.mp4"
    
    try:
        clip = VideoFileClip(input_path)
        duration = clip.duration
        
        # We trim off the last 4.5 seconds to ensure the iMac outro is removed
        trim_duration = 4.5
        if duration > trim_duration + 2:
            new_duration = duration - trim_duration
            print(f"Original duration: {duration}s. Trimming to {new_duration}s")
            new_clip = clip.subclipped(0, new_duration)
            new_clip.write_videofile(output_path, codec="libx264", audio=False)
            new_clip.close()
            clip.close()
            
            # Replace the old video
            os.replace(output_path, input_path)
            print("Successfully trimmed and replaced!")
        else:
            print("Video is too short to trim!")
            clip.close()
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    trim_video()
