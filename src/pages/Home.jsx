import React, { useState } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

import Select from "react-select";
import { BsStars, BsCodeSlash } from "react-icons/bs";
import Editor from "@monaco-editor/react";
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { VscRefresh } from "react-icons/vsc";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

// MOVED OUTSIDE: Static styles to prevent re-creation on every render
const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#000",
    borderColor: state.isFocused ? "#555" : "#333",
    boxShadow: "none",
    minHeight: "44px",
    ":hover": { borderColor: "#777" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#000",
    border: "1px solid #333",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "#222"
      : state.isSelected
      ? "#333"
      : "#000",
    color: "#fff",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#fff" }),
  placeholder: (base) => ({ ...base, color: "#aaa" }),
  input: (base) => ({ ...base, color: "#fff" }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#aaa",
    ":hover": { color: "#fff" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + TAILWIND CSS" },
    { value: "html-bootstarp", label: "HTML + BOOTSTRAP" },
    { value: "html-css-js", label: "HTML + CSS + JAVASCRIPT" },
    { value: "html-tailwind-bootstrap", label: "HTML + TAILWIND + BOOTSTRAP" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    if (!response || typeof response !== "string") return ""; 
    const match = response.match(/```(?:html|xml|css|js)?\n([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  async function getResponse() {
    if (!prompt.trim()) {
      toast.error("Please describe your component first.");
      return;
    }

    setLoading(true);
    setOutputScreen(false);
    setError("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, framework: framework.value }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setCode(extractCode(data.result));
      setOutputScreen(true);
      setTab(1); 
    } catch (error) {
      console.error(error);
      setError("Failed to generate code. Please try again.");
      toast.error("Failed to generate code");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const fileName = "GenZUI-code.html";
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File Downloaded");
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row px-4 md:px-10 gap-6 md:gap-8 justify-between">
        {/* Left Section */}
        <div className="left w-full md:w-1/2 rounded-xl bg-[#141319] mt-5 p-5 flex flex-col">
          <h3 className="sp-text text-[20px] font-semibold">
            AI Component Generator
          </h3>
          <p className="text-gray-400 mt-2 text-sm">
            An intelligent tool that creates reusable, customizable UI components based on your requirements.
          </p>

          <p className="text-sm font-medium mt-4">Framework</p>
          <Select
            className="mt-2"
            options={options}
            styles={customStyles}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#555",
                primary25: "#222",
                neutral0: "#000",
                neutral80: "#fff",
              },
            })}
            onChange={(e) => setFramework(e)}
            placeholder="Select component type"
          />

          <p className="text-sm font-medium mt-5">Describe Your Component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-sm flex-grow cursor-text"
            placeholder="Describe your requirement in detail and let AI code it for you"
          ></textarea>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="flex flex-col sm:flex-row items-center justify-between mt-3 gap-3 sm:gap-0">
            <p className="text-gray-400 text-sm">
              Click On Generate Button To Generate Your Code
            </p>
            <button
              onClick={getResponse}
              disabled={loading}
              className="generate flex items-center p-4 rounded-lg border-0 bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] gap-2 transition-all cursor-pointer hover:opacity-80"
            >
              <BsStars />
              Generate
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="right w-full md:w-1/2 h-auto md:h-[90vh] bg-[#141319] rounded-xl flex flex-col">
          {!outputScreen ? (
            <div className="flex flex-col items-center justify-center h-full relative">
              {loading && (
                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
                  <ClipLoader />
                </div>
              )}
              <div className="skeleton flex flex-col items-center justify-center h-full">
                <div className="circle w-[70px] h-[70px] flex items-center justify-center text-4xl rounded-full bg-gradient-to-bl from-[#0f172a] via-[#1e1a78]">
                  <BsCodeSlash />
                </div>
                <p className="text-gray-400 mt-3 text-sm">
                  Your component and code will appear here!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Tabs */}
              <div className="top bg-[#17171C] w-full h-[50px] flex items-center gap-2 px-4 md:px-5">
                <button
                  onClick={() => setTab(1)}
                  className={`btn w-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                    tab === 1 ? "bg-[#333]" : ""
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`btn w-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                    tab === 2 ? "bg-[#333]" : ""
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Top Actions */}
              <div className="top-2 bg-[#17171C] w-full h-[50px] flex items-center justify-between gap-2 px-4 md:px-5">
                <div className="left">
                  <p className="font-bold text-sm">Code Editor</p>
                </div>
                <div className="right flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button
                        className="copy w-10 h-10 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-[#333] transition-all cursor-pointer"
                        onClick={copyCode}
                      >
                        <IoCopy />
                      </button>
                      <button
                        className="export w-10 h-10 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-[#333] transition-all cursor-pointer"
                        onClick={downloadFile}
                      >
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="copy w-10 h-10 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-[#333] transition-all cursor-pointer">
                        <MdOutlineLaptopChromebook />
                      </button>
                      <button
                        onClick={() => setRefreshKey((prev) => prev + 1)}
                        className="export w-10 h-10 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-[#333] transition-all cursor-pointer"
                      >
                        <VscRefresh />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editor / Preview */}
              <div className="editor flex-1 overflow-hidden">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    onChange={handleEditorChange}
                    height="100%"
                    theme="vs-dark"
                    language="html"
                    options={{ automaticLayout: true }}
                  />
                ) : (
                  <iframe
                    key={refreshKey}
                    srcDoc={code}
                    className="preview w-full h-full bg-white text-black"
                  ></iframe>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
