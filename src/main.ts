import { Univer } from '@univerjs/core';
import Aurelia from 'aurelia';
import { MyApp } from './my-app';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";


Aurelia
  .app(MyApp)
  .start();
