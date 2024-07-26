import Aurelia from 'aurelia';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { Home } from './routes/home/home';



Aurelia
  .app(Home)
  .start();
