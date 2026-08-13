Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('assets\spider.jpg')
$bmp = New-Object System.Drawing.Bitmap($img)
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $color = $bmp.GetPixel($x, $y)
        if ($color.R -lt 55 -and $color.G -lt 65 -and $color.B -lt 55) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}
$bmp.Save('assets\spider_clear.png', [System.Drawing.Imaging.ImageFormat]::Png)
