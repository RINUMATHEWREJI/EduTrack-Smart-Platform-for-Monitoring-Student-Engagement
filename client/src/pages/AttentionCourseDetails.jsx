import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../utils/auth";
import { Document, Page, pdfjs } from "react-pdf";
import "../css/AttentionCourseDetails.css";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjs.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const API_URL = import.meta.env.VITE_API_URL;

function AttentionCourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
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

            {/* Show PDF thumbnail */}
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

            {/* Teacher analytics buttons */}
            <div className="analytics-buttons">
              <Link to={`/materials/${m.id}/summary`}>
                <button>View Summary</button>
              </Link>
              <Link to={`/materials/${m.id}/students`}>
                <button>View Per-Student</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for PDF viewer */}
      {selectedPdf && (
        <div
          className="pdf-modal-overlay"
          onClick={() => setSelectedPdf(null)}
        >
          <div
            className="pdf-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <Document
              file={selectedPdf}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={800}
                />
              ))}
            </Document>
            <button onClick={() => setSelectedPdf(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttentionCourseDetails;
