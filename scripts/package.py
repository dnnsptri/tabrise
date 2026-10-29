"""Package only the files needed to install TabRise. No dependencies required."""
from pathlib import Path
import json
import zipfile

root = Path(__file__).resolve().parents[1]
version = json.loads((root / 'manifest.json').read_text())['version']
destination = root / 'downloads' / f'tabrise-{version}.zip'
destination.parent.mkdir(exist_ok=True)
files = ['manifest.json', 'background.js', 'popup.html', 'popup.css', 'README.md', 'LICENSE']
files += [str(p.relative_to(root)) for p in sorted((root / 'icons').glob('*.png'))]
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(root / name, f'tabrise/{name}')
print(f'Created {destination.name} with {len(files)} files')
