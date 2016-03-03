require('trix');
import $ from 'jquery';

module.exports = {
  install(Vue) {
    Vue.component('trix', {
      name: 'trix',
      props: {
        model: {
          type: String,
          twoWay: true,
          required: true,
          default: ''
        },
        picture: {
          type: Boolean,
          twoWay: false,
          required: false,
          default: false
        }
      },
      template: `
        <div>
          <style>
            trix-toolbar .button_group button.attach::before {
              background-size: 20px 20px;
              background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNMzY4LDIyNGMyNi41LDAsNDgtMjEuNSw0OC00OGMwLTI2LjUtMjEuNS00OC00OC00OGMtMjYuNSwwLTQ4LDIxLjUtNDgsNDhDMzIwLDIwMi41LDM0MS41LDIyNCwzNjgsMjI0eiIvPg0KCTxwYXRoIGQ9Ik00NTIsNjRINjBjLTE1LjYsMC0yOCwxMi43LTI4LDI4LjN2MzI3LjRjMCwxNS42LDEyLjQsMjguMywyOCwyOC4zaDM5MmMxNS42LDAsMjgtMTIuNywyOC0yOC4zVjkyLjMNCgkJQzQ4MCw3Ni43LDQ2Ny42LDY0LDQ1Miw2NHogTTM0OC45LDI2MS43Yy0zLTMuNS03LjYtNi4yLTEyLjgtNi4yYy01LjEsMC04LjcsMi40LTEyLjgsNS43bC0xOC43LDE1LjhjLTMuOSwyLjgtNyw0LjctMTEuNSw0LjcNCgkJYy00LjMsMC04LjItMS42LTExLTQuMWMtMS0wLjktMi44LTIuNi00LjMtNC4xTDIyNCwyMTUuM2MtNC00LjYtMTAtNy41LTE2LjctNy41Yy02LjcsMC0xMi45LDMuMy0xNi44LDcuOEw2NCwzNjguMlYxMDcuNw0KCQljMS02LjgsNi4zLTExLjcsMTMuMS0xMS43aDM1Ny43YzYuOSwwLDEyLjUsNS4xLDEyLjksMTJsMC4zLDI2MC40TDM0OC45LDI2MS43eiIvPg0KPC9nPg0KPC9zdmc+DQo=);
            }

            trix-editor figure {
              position: relative;
              display: block;
            }

            trix-editor figure a.remove {
              position: absolute;
              left: 0;
              top: 0;
            }
          </style>
          <div id="{{ id }}">
            <input id="file-{{ id }}" type="file" accept="image/*" style="position:absolute;top:-1000px;left:-1000px;margin:0;opacity:0;-ms-filter:"alpha(opacity=0)";font-size:200px;direction:ltr;cursor:pointer;">
            <input id="input-{{ id }}" :value="model" type="hidden" name="content">
            <trix-editor input="input-{{ id }}"></trix-editor>
          </div>
        </div>`,
      data() {
        return {
          id: '' // used to identify the trix instance from the rest (if any)
        };
      },
      ready() {
        this.id = `trix-${String(Math.random()).slice(2)}`;
        let lastCursorIndex = 0; // will have the last cursor position that's relevant to use
        let doNotListen = false; // flag used whether or not we should be listening or not
        let timer = null; // setTimeout reference to be used for clearing

        // giving some time for `trix-editor` to initiate...
        setTimeout(() => {
          this.__trix = document.querySelector(`trix-editor[input="input-${this.id}"]`);
          this.__trix.editor.loadHTML(this.model);
          this.__input = document.querySelector(`#input-${this.id}`);
          this.__fileInput = document.querySelector(`#file-${this.id}`);

          // image upload button (to be added in the tool bar)
          this.__button = document.createElement('button');
          this.__button.setAttribute('type', 'button');
          this.__button.setAttribute('class', 'attach');
          this.__button.setAttribute('data-attribute', 'attach');
          this.__button.setAttribute('title', 'attach');
          this.__button.innerHTML = 'Attach';

          if(this.picture === true) {
            document.querySelector(`#${this.id} .button_group.block_tools`).appendChild(this.__button);
          }

          // button triggering click on our file input
          this.__buttonClick = () => {
            let clickEvent = new MouseEvent('click');
            this.__fileInput.dispatchEvent(clickEvent);
          };
          this.__button.addEventListener('click', this.__buttonClick);

          // watching file input for change
          this.__fileInputChange = (event) => {
            // we have 512ms before the `trix-selection-change` is triggered
            doNotListen = true;
            let FR = new FileReader();

            FR.onload = (e) => {
              this.__trix.editor.setSelectedRange(lastCursorIndex);
              this.__trix.editor.insertHTML(`<img src="${e.target.result}">`);
              this.__fileInput.value = '';
              doNotListen = false;
            };

            FR.readAsDataURL(event.target.files[0]);
          };
          this.__fileInput.addEventListener('change', this.__fileInputChange);

          // on focus we'll "repopulate" the content of trix to make
          // sure outside changes are reflected
          this.__trixFocus = () => {
            this.__trix.editor.loadHTML(this.model);
          };
          this.__trix.addEventListener('focus', this.__trixFocus);

          // disabling dropped or pasted files
          this.__trixFileAccept = (event) => {
            event.preventDefault();
          };
          this.__trix.addEventListener('trix-file-accept', this.__trixFileAccept);

          // watching for trix change and reflecting the change back to the model
          this.__trixChange = () => {
            this.model = this.__input.value;
          };
          this.__trix.addEventListener('trix-change', this.__trixChange);

          this.__trixSelectionChange = () => {
            // this makes sure that when file is uploaded it's added
            // at the last cursor position instead of the beginning
            clearTimeout(timer);
            timer = setTimeout(() => {
              let _lastCursorIndex = this.__trix.editor.getPosition();
              // single cursor move triggers three events, we're filtering out those
              if(_lastCursorIndex !== lastCursorIndex && doNotListen === false) {
                lastCursorIndex = _lastCursorIndex;
              }
            }, 512);
          };
          this.__trix.addEventListener('trix-selection-change', this.__trixSelectionChange);

          // on blur we're going to be reformatting the content and remove
          // figure with it's double base64 encoding
          this.__trixBlur = () => {
            let div = document.createElement('div');
            div.innerHTML = this.__input.value;

            // this is the main reason we have jquery, the selector context
            // i know there are much smaller libraries out there
            // but I'm pretty sure JQ is going to be a dependency (date-time picker)
            $('figure', div).each((index, figure) => {
              $('img', figure).each((index, img) => {
                img.setAttribute('class', 'img-responsive');
                img.removeAttribute('height');
                img.removeAttribute('width');
                img.setAttribute('style', 'max-width: 100%; width: auto; height: auto; margin: 8px;');
                $(figure).replaceWith(img);
              });
            });

            this.model = $(div).html();
          };
          this.__trix.addEventListener('blur', this.__trixBlur);
        }, 128);
      },
      beforeDestroy() {
        this.__button.removeEventListener('click', this.__buttonClick);
        this.__fileInput.removeEventListener('change', this.__fileInputChange);
        this.__trix.removeEventListener('focus', this.__trixFocus);
        this.__trix.removeEventListener('blur', this.__trixBlur);
        this.__trix.removeEventListener('trix-selection-change', this.__trixSelectionChange);
        this.__trix.removeEventListener('trix-file-accept', this.__trixFileAccept);
        this.__trix.removeEventListener('trix-change', this.__trixChange);
      }
    });
  }
};
