export class Content extends Element {
  app;

  constructor(props) {
    super();
    this.app = props.app;
  }

  render() {
    const style = `background-image: url("${this.app.splash}")`;

    return (
      <div styleset={__DIR__ + 'content.css#content'}>
        <label for="directory">
          GIMP Directory:
          <input id="directory" value={this.app.directory} readonly />
          <button id="browse">Browse...</button>
        </label>
        <h3>Splash Image:</h3>
        <div id="splash" style={style}></div>
        <button id="change">Change...</button>
      </div>
    );
  }
}
