import "./assets/scss/reset.css";
import "./assets/scss/main.css";
import { ProcessingErrors } from "efko-flare-js";
import { App } from "./App";
const errorHandler = new ProcessingErrors();
errorHandler.init();
App.mount("#main");
