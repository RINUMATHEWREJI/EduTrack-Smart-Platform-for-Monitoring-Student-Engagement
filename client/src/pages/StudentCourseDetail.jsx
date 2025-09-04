// StudentCourseDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../utils/auth";
import "./StudentCourseDetail.css";
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjs.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const API_URL = import.meta.env.VITE_API_URL;

function StudentCourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const [sessionId, setSessionId] = useState(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  // Fetch course + materials
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

  // Start attention session
  const startSession = async (materialId, pdfUrl) => {
    try {
      const res = await axios.post(
        `${API_URL}materials/${materialId}/attention/start/`,
        {},
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setSessionId(res.data.session_id);
      setSelectedPdf(pdfUrl);
      startCamera(materialId, res.data.session_id);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  // Stop session
  const stopSession = async (materialId) => {
    if (!sessionId) return;
    try {
      await axios.post(
        `${API_URL}materials/${materialId}/attention/stop/`,
        { session_id: sessionId },
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
    } catch (error) {
      console.error("Error stopping session:", error);
    }
    stopCamera();
    setSessionId(null);
    setSelectedPdf(null);
  };

  // Start webcam and send frames periodically
  const startCamera = async (materialId, sessionId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;

      intervalRef.current = setInterval(async () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const formData = new FormData();
          formData.append("session_id", sessionId);
          formData.append("frame", blob, "frame.jpg");
          try {
            await axios.post(
              `${API_URL}materials/${materialId}/attention/record/`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${getAccessToken()}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (err) {
            console.error("Error sending frame:", err);
          }
        }, "image/jpeg");
      }, 5000); // every 5s
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    fetchCourse();
    return () => stopCamera();
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="student-course-detail">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <h3>Materials</h3>
      <ul>
        {materials.map((m) => (
          <li key={m.id}>
            <h4>{m.title}</h4>
            {m.material_type === "PDF" && m.file && (
              <div
                className="pdf-preview"
                onClick={() =>
                  startSession(m.id, `${API_URL.replace("/api/", "")}${m.file}`)
                }
              >
                <Document file={`${API_URL.replace("/api/", "")}${m.file}`}>
                  <Page pageNumber={1} width={200} />
                </Document>
                <p>Click to view full PDF</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      {selectedPdf && (
        <div
          className="pdf-modal"
          onClick={() =>
            stopSession(
              materials.find(
                (m) => `${API_URL.replace("/api/", "")}${m.file}` === selectedPdf
              )?.id
            )
          }
        >
          <div className="pdf-container" onClick={(e) => e.stopPropagation()}>
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
            <button
              onClick={() =>
                stopSession(
                  materials.find(
                    (m) =>
                      `${API_URL.replace("/api/", "")}${m.file}` === selectedPdf
                  )?.id
                )
              }
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hidden webcam */}
      <video ref={videoRef} style={{ display: "none" }} />
    </div>
  );
}

export default StudentCourseDetail;
