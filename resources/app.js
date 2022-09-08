import { MenuBar } from 'menu/menu-bar.js';
import { Content } from 'content/content.js';

import { fs } from '@sys';
import { path } from '@env';

export class Application extends Element {
  directory;
  splash;

  componentDidMount() {
    const directory = path('applications', 'GIMP 2').replace(' (x86)', '');
    this.componentUpdate({ directory });
    const splash = this.parseDirectory(directory);
    this.componentUpdate({ splash });
  }

  parseDirectory(directory) {
    const versions = [];
    const FOLDER = 2;
    for (const item of fs.$readdir(`${directory}/share/gimp`)) {
      if (item.type === FOLDER) {
        const version = Number(item.name);
        if (!isNaN(version)) {
          versions.push(item.name);
        }
      }
    }

    let latest = 0;
    for (const version of versions) {
      if (Number(version) > latest) {
        latest = version;
      }
    }

    return `${directory}/share/gimp/${latest}/images/gimp-splash.png`;
  }

  ['on click at #browse']() {
    const filename = Window.this
      .selectFolder({
        mode: 'open',
        caption: 'Select GIMP folder...',
      })
      ?.replace('file://', '')
      ?.replace(/.+/, (filename) => decodeURIComponent(filename));

    if (!filename) return;

    this.componentUpdate({ directory: filename });
  }

  async ['on click at #change']() {
    const filename = Window.this
      .selectFile({
        mode: 'open',
        filter: 'PNG files (*.png)|*.png',
        caption: 'Change splash image...',
        extension: 'png',
      })
      ?.replace('file://', '')
      ?.replace(/.+/, (filename) => decodeURIComponent(filename));

    if (!filename) return;

    try { 
      this.parseDirectory(this.directory);
    } catch (e) {
      Window.this.modal(<error caption="Error">Incorrect GIMP directory?</error>);
      return;
    }

    if (!fs.$stat(this.parseDirectory(this.directory))) {
      Window.this.modal(<error caption="Error">Incorrect GIMP directory?</error>);
      return;
    }

    this.componentUpdate({ splash: filename });

    const fileFrom = await fs.open(filename, 'r');
    const fileTo = await fs.open(this.parseDirectory(this.directory), 'w');

    const buffer = await fileFrom.read();
    await fileTo.write(buffer);

    Window.this.modal(<info caption="Success">Splash successfully changed!</info>);

  }

  render() {
    return (
      <body>
        <MenuBar />
        <Content app={this} />
      </body>
    );
  }
}
