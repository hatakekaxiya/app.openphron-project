import { useState, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import AnsiToHtml from "ansi-to-html";

import { formatText, generateChartCode, parseMessage } from "../../utils";
import "./index.scss";

interface ContentViewerProps {
  content: any;
  isTypingMessage?: boolean;
}

const ContentViewer = ({ content, isTypingMessage = false }: ContentViewerProps) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);
  const parseContent = parseMessage(content);

  const handleCopyCode = (chartData: string): void => {
    try {
      const codeString: string = generateChartCode(chartData);
      if (!navigator.clipboard) {
        return;
      }

      navigator.clipboard
        .writeText(codeString)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => {
            setCopySuccess(false);
          }, 3000);
        })
        .catch((error: Error) => {
          console.error("Error copying to clipboard:", error);
          alert("Failed to copy chart code.");
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!isTypingMessage || !content) return;
    let currentIndex = 0;

    const typeWriter = () => {
      if (currentIndex < parseContent.length) {
        const chunkSize = 5;
        const nextIndex = Math.min(currentIndex + chunkSize, parseContent.length);
        setDisplayText(parseContent.slice(0, nextIndex));
        currentIndex = nextIndex;
        setTimeout(typeWriter, 5);
      } else {

      }
    };
    setDisplayText("");
    typeWriter();
  }, [content])

  return (
    <div className="overflow-auto">
      {parseContent.map((part, index) => {
        if (part.type === "code") {
          return (
            <div key={index}>
              {" "}
              {copySuccess == false ? (
                <div
                  className="copy-button-container"
                  onClick={() => handleCopyCode(part.content)}
                >
                  <ContentCopyIcon className="ContentCopyIcon" />
                  <span>Copy</span>
                </div>
              ) : (
                <div className="copy-button-container">
                  <DoneIcon />
                  <span>Copied!</span>
                </div>
              )}
              <div key={index} ref={outputRef}>
                <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                  {part.content}
                </SyntaxHighlighter>
              </div>
            </div>
          );
        }
        const ansiToHtml = new AnsiToHtml();
        const htmlContent = ansiToHtml.toHtml(formatText(part.content));

        return (
          <div key={index}>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        );
      })}
    </div>
  );
};

export default ContentViewer;