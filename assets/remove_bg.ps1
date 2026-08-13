Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('chameleon.jpg')
$bmp = New-Object System.Drawing.Bitmap($img)
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $color = $bmp.GetPixel($x, $y)
        if ($color.R -lt 40 -and $color.G -lt 40 -and $color.B -lt 40) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}
$bmp.Save('chameleon_clear.png', [System.Drawing.Imaging.ImageFormat]::Png)
