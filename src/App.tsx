import "./App.css";
import AnnotationEditor from "./components/AnnotationEditor";
import AnnotationPopup from "./components/AnnotationPopup";

function App() {
  return (
    <div id="three">
      <AnnotationPopup />
      <AnnotationEditor />
    </div>
  );
}

export default App;
