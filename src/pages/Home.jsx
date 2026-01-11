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

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#000",
    borderColor: state.isFocused ? "#555" : "#333",
    boxShadow: "none",
    minHeight: "44px",
    ":hover": { borderColor: "#777" },
  }),
  menu: (base) => ({ ...base, backgroundColor: "#000", border: "1px solid #333" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#222" : state.isSelected ? "#333" : "#000",
    color: "#fff",
  }),
  singleValue: (base) => ({ ...base, color: "#fff" }),
  placeholder: (base) => ({ ...base, color: "#aaa" }),
};

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    if (!response || typeof response !== "string") return "";
    return response.trim(); // Gemini already returns raw HTML
  }

  async function getResponse() {
    if (!prompt.trim()) {
      toast.error("Please describe your component first");
      return;
    }

    setLoading(true);
    setOutputScreen(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const res = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          framework: framework.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Backend error");

      setCode(extractCode(data.result));
      setOutputScreen(true);
      setTab(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate code");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Copied!");
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row px-5 gap-6 mt-6">
        {/* Left */}
        <div className="w-full md:w-1/2 bg-[#141319] p-5 rounded-xl">
          <h2 className="text-xl font-bold">AI Component Generator</h2>

          <p className="text-sm text-gray-400 mt-2">Select framework</p>

          <Select
            value={framework}
            onChange={(e) => setFramework(e)}
            options={options}
            styles={customStyles}
            className="mt-2"
          />

          <textarea
            className="w-full min-h-[200px] mt-4 p-3 bg-[#09090B] rounded-xl"
            placeholder="Describe your UI..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={getResponse}
            disabled={loading}
            className="mt-4 w-full p-3 bg-indigo-700 rounded-xl flex items-center justify-center gap-2"
          >
            <BsStars /> Generate
          </button>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 bg-[#141319] rounded-xl overflow-hidden">
          {!outputScreen ? (
            <div className="flex items-center justify-center h-full">
              {loading ? <ClipLoader /> : <BsCodeSlash size={50} />}
            </div>
          ) : (
            <>
              <div className="flex">
                <button onClick={() => setTab(1)} className={`w-1/2 p-2 ${tab === 1 ? "bg-[#333]" : ""}`}>Code</button>
                <button onClick={() => setTab(2)} className={`w-1/2 p-2 ${tab === 2 ? "bg-[#333]" : ""}`}>Preview</button>
              </div>

              <div className="flex justify-end p-2 gap-2">
                {tab === 1 ? (
                  <>
                    <IoCopy onClick={copyCode} className="cursor-pointer" />
                    <PiExportBold onClick={downloadFile} className="cursor-pointer" />
                  </>
                ) : (
                  <VscRefresh onClick={() => setRefreshKey((k) => k + 1)} className="cursor-pointer" />
                )}
              </div>

              {tab === 1 ? (
                <Editor value={code} height="80vh" language="html" theme="vs-dark" />
              ) : (
                <iframe key={refreshKey} srcDoc={code} className="w-full h-[80vh] bg-white" />
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
