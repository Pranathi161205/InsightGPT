import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState("");
  const [output, setOutput] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [multiFiles, setMultiFiles] = useState([]);
const [projectId, setProjectId] = useState("");
const [multiQuestion, setMultiQuestion] = useState("");
const [loadingMessage, setLoadingMessage] = useState("AI is generating...");
  const [summaryType, setSummaryType] = useState("Detailed Notes");
  const [languageStyle, setLanguageStyle] = useState("Student-friendly");
  const [outputFormat, setOutputFormat] = useState("Headings + Bullet Points");
  const [purpose, setPurpose] = useState("Study Notes");
  const [analysisMode, setAnalysisMode] = useState("single");
const [selectedMode, setSelectedMode] = useState("");
  const API = "https://insightgpt-6d5t.onrender.com";

  const uploadPDF = async () => {
    if (!file) return alert("Please select a PDF");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setDocumentId(data.document_id);
    setOutput(`PDF uploaded successfully!\n\nCharacters extracted: ${data.characters}`);
    setLoading(false);
  };

  const generateFeature = async (endpoint) => {
    if (!documentId) return alert("Please upload a PDF first");

    setLoading(true);

    const formData = new FormData();
    formData.append("document_id", documentId);
    formData.append("summary_type", summaryType);
    formData.append("language_style", languageStyle);
    formData.append("output_format", outputFormat);
    formData.append("purpose", purpose);

    const res = await fetch(`${API}/${endpoint}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setOutput(
      data.summary ||
        data.ppt_content ||
        data.quiz ||
        JSON.stringify(data, null, 2)
    );

    setLoading(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return alert("Please type a question");
    if (!documentId) return alert("Please upload a PDF first");

    setLoading(true);

    const formData = new FormData();
    formData.append("document_id", documentId);
    formData.append("question", question);

    const res = await fetch(`${API}/ask`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setOutput(data.answer);
    setLoading(false);
  };
const uploadMultiplePDFs = async () => {
  if (multiFiles.length < 2) {
    alert("Please select at least 2 PDFs");
    return;
  }

  setLoading(true);
  setLoadingMessage("Uploading multiple research papers...");

  try {
    const formData = new FormData();

    for (let i = 0; i < multiFiles.length; i++) {
      formData.append("files", multiFiles[i]);
    }

    const res = await fetch(`${API}/upload-multiple`, {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    console.log("Raw upload response:", text);

    const data = text ? JSON.parse(text) : {};

    if (data && data.project_id) {
      setProjectId(data.project_id);

      setOutput(
        `Multiple PDFs uploaded successfully!\n\nProject ID: ${data.project_id}\n\nFiles:\n${data.files?.join("\n")}`
      );
    } else {
      setOutput("Upload completed, but no project ID was returned from backend.");
    }
  } catch (error) {
    console.error(error);
    setOutput("Upload failed. Please check backend terminal or console.");
  }

  setLoading(false);
};
const askAcrossPapers = async () => {
  if (!projectId) {
    alert("Please upload multiple PDFs first");
    return;
  }

  if (!multiQuestion.trim()) {
    alert("Please type a question");
    return;
  }

  setLoading(true);
  setLoadingMessage("Analyzing multiple research papers...");
  setOutput("Analyzing multiple research papers...");

  try {
    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("question", multiQuestion);

    const res = await fetch(`${API}/multi-ask`, {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    console.log("Raw multi-ask response:", text);

    const data = text ? JSON.parse(text) : {};

    setOutput(
      data.answer ||
        data.error ||
        text ||
        "No response received from backend."
    );
  } catch (error) {
    console.error("Multi ask error:", error);
    setOutput(`Error: ${error.message}`);
  }

  setLoading(false);
};
  return (
    <div className="page">
      <nav className="navbar">
  <div className="logo">
    <div className="bot">🤖</div>
    <div>
      <h2>ResearchAI</h2>
      <span>WORKSPACE</span>
    </div>
  </div>

  <div className="nav-links">
  <a href="#home" className="active-link">Home</a>
  <a href="#features">Features</a>
  <a href="#dashboard">Dashboard</a>
  <a href="#how-it-works">How It Works</a>
</div>

<a href="#dashboard">
  <button className="get-started">Get Started</button>
</a>


        
      </nav>
<section className="hero" id="home">
  <h1 className="hero-title">InsightGPT</h1>
  <p className="hero-tagline">
    AI-Powered Research & Presentation Workspace
  </p>
  <p>
          Upload research papers and generate summaries, quizzes, beautiful
          notes, and document-based answers instantly.
        </p>
      </section>
<section className="features-section" id="features">
  <h2>Powerful Features</h2>
  <p>
    Smart AI tools designed to simplify document understanding and research work.
  </p>

  <div className="features-grid-main">
    <div className="feature-box">
      <h3>PDF Upload</h3>
      <p>
        Upload research papers, reports, resumes, and study materials.
      </p>
    </div>

    <div className="feature-box">
      <h3>AI Summarization</h3>
      <p>
        Generate structured and readable summaries automatically.
      </p>
    </div>

    <div className="feature-box">
      <h3>Quiz Generation</h3>
      <p>
        Create important questions and answers from the document.
      </p>
    </div>

    <div className="feature-box">
      <h3>Document Q&A</h3>
      <p>
        Ask questions directly from uploaded document content.
      </p>
    </div>
  </div>
</section>
<section className="analysis-selector" id="dashboard">
  <h2>Choose Analysis Type</h2>
  <p>Select how you want to analyze your research documents.</p>

  <div className="selector-buttons">

    <button
      className={selectedMode === "single" ? "active-select" : ""}
      onClick={() => setSelectedMode("single")}
    >
      Single Paper Analysis
    </button>

    <button
      className={selectedMode === "multiple" ? "active-select" : ""}
      onClick={() => setSelectedMode("multiple")}
    >
      Multiple Paper Analysis
    </button>

  </div>

</section>
      {selectedMode === "single" && (
      <section className="workspace-card">
        

        <div className="main-box">
          <div className="left-panel">
            <h3>Upload Research Paper</h3>
            <p>Select a PDF file to begin AI document analysis.</p>

            <label className="upload-box">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="upload-icon">📄</div>
              <strong>{file ? file.name : "Choose PDF File"}</strong>
              <span>PDF research paper, report, resume, or study material</span>
            </label>

            <button className="primary-btn" onClick={uploadPDF}>
              Upload PDF
            </button>
          </div>

          <div className="right-panel">
            {!documentId ? (
              <>
                <h2>Premium Features</h2>
                <div className="features">
                  <span>AI Summary</span>
                  <span>Beautiful Notes</span>
                  <span>Quiz Maker</span>
                  <span>Document Chat</span>
                  <span>Viva Questions</span>
                  <span>Custom Output</span>
                </div>
              </>
            ) : (
              <>
                <h2>Customize Your Output</h2>

                <div className="custom-options">
                  <select
                    value={summaryType}
                    onChange={(e) => setSummaryType(e.target.value)}
                  >
                    <option>Short Summary</option>
                    <option>Detailed Notes</option>
                    <option>Exam Notes</option>
                    <option>Presentation Notes</option>
                  </select>

                  <select
                    value={languageStyle}
                    onChange={(e) => setLanguageStyle(e.target.value)}
                  >
                    <option>Simple</option>
                    <option>Student-friendly</option>
                    <option>Professional</option>
                    <option>Research-level</option>
                  </select>

                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <option>Paragraphs</option>
                    <option>Bullet Points</option>
                    <option>Headings + Bullet Points</option>
                    <option>Beautiful Notes</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Purpose e.g. viva, seminar, exam, review"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </div>

                <div className="action-grid">
                  <button onClick={() => generateFeature("summary")}>
                     Generate Summary
                  </button>

                  <button onClick={() => generateFeature("ppt-content")}>
                     Presentation Points
                  </button>

                  <button onClick={() => generateFeature("quiz")}>
                     Quiz / Viva
                  </button>
                </div>

                <div className="question-box">
                  <input
                    type="text"
                    placeholder="Ask a question from the document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />

                  <button onClick={askQuestion}>Ask AI</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      )}
      {selectedMode === "multiple" && (
      <section className="multi-paper-section" id="multi-paper">
  <h2>Multi-Paper Research Assistant</h2>
  <p>
    Upload multiple research papers and ask AI to compare, analyze, and combine insights.
  </p>

  <div className="multi-paper-box">
    <div>
      <h3>Upload Multiple PDFs</h3>

      <label className="upload-box">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => setMultiFiles(Array.from(e.target.files))}
        />

        <div className="upload-icon">PDF</div>
        <strong>
          {multiFiles.length > 0
            ? `${multiFiles.length} PDFs selected`
            : "Choose Multiple PDF Files"}
        </strong>
        <span>Select at least 2 research papers</span>
      </label>

      <button className="primary-btn" onClick={uploadMultiplePDFs}>
        Upload Research Papers
      </button>
    </div>

    <div>
      <h3>Ask Across Papers</h3>

      <textarea
        className="multi-question"
        placeholder="Example: Compare the methodology used in these papers"
        value={multiQuestion}
        onChange={(e) => setMultiQuestion(e.target.value)}
      />

      <button className="primary-btn" onClick={askAcrossPapers}>
        Ask Across Multiple Papers
      </button>
    </div>
  </div>
</section>
      )}
      <section className="output-section" id="output">
        <h2>Output</h2>

        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
            <p>AI is generating...</p>
          </div>
        ) : (
          <div className="markdown-output">
            <ReactMarkdown>
              {output || "Your customized AI notes will appear here..."}
            </ReactMarkdown>
          </div>
        )}
      </section>
      <section className="how-section" id="how-it-works">
  <h2>How It Works</h2>

  <div className="steps">
    <div className="step">
      <span>1</span>
      <h3>Upload PDF</h3>
      <p>Select your research paper or study material.</p>
    </div>

    <div className="step">
      <span>2</span>
      <h3>Customize Output</h3>
      <p>Choose summary type, style, format, and purpose.</p>
    </div>

    <div className="step">
      <span>3</span>
      <h3>Generate Content</h3>
      <p>Get summaries, quizzes, presentation points, and answers.</p>
    </div>
  </div>
</section>
    </div>
  );
}

export default App;