import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../utils/auth";
import { Document, Page, pdfjs } from "react-pdf";
import './CourseDetails.css'
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjs.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const API_URL = import.meta.env.VITE_API_URL;

function CourseDetail() {
  const { id } = useParams(); // course id from URL
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    material_type: "PDF",
    file: null,
  });

  const [selectedPdf, setSelectedPdf] = useState(null); // full viewer
  const [numPages, setNumPages] = useState(null);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${API_URL}courses/${id}/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setCourse(res.data);
      setMaterials(res.data.materials || []);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const addMaterial = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newMaterial.title);
      formData.append("material_type", "PDF");
      if (newMaterial.file) formData.append("file", newMaterial.file);

      await axios.post(`${API_URL}courses/${id}/materials/`, formData, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNewMaterial({ title: "", material_type: "PDF", file: null });
      fetchCourse();
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };

  const deleteMaterial = async (materialId) => {
    try {
      await axios.delete(`${API_URL}courses/${id}/materials/${materialId}/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      fetchCourse();
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-detail">
  <h2>{course.title}</h2>
  <p>{course.description}</p>

  <h3>Materials</h3>
  <ul>
    {materials.map((m) => (
      <li key={m.id}>
        <h4>{m.title}</h4>

        {m.material_type === "PDF" && m.file && (
          <div
            className="pdf-thumbnail"
            onClick={() =>
              setSelectedPdf(`${API_URL.replace("/api/", "")}${m.file}`)
            }
          >
            <Document file={`${API_URL.replace("/api/", "")}${m.file}`}>
              <Page pageNumber={1} width={200} />
            </Document>
            <p>Click to view full PDF</p>
          </div>
        )}

        <button onClick={() => deleteMaterial(m.id)}>Delete</button>
      </li>
    ))}
  </ul>

  <div className="add-material">
    <h3>Add Material</h3>
    <input
      type="text"
      placeholder="Title"
      value={newMaterial.title}
      onChange={(e) =>
        setNewMaterial({ ...newMaterial, title: e.target.value })
      }
    />
    <input
      type="file"
      accept="application/pdf"
      onChange={(e) =>
        setNewMaterial({ ...newMaterial, file: e.target.files[0] })
      }
    />
    <button onClick={addMaterial}>Add Material</button>
  </div>

  {selectedPdf && (
    <div className="pdf-modal-overlay" onClick={() => setSelectedPdf(null)}>
      <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
        <Document
          file={selectedPdf}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} width={800} />
          ))}
        </Document>
        <button onClick={() => setSelectedPdf(null)}>Close</button>
      </div>
    </div>
  )}
</div>

  );
}

export default CourseDetail;
