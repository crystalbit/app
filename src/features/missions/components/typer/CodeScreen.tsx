import { useCallback, useEffect, useRef, useState } from 'react';

const CHARS_PER_STROKE = 5;

const CodeScreen = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [content, setContent] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const runScript = useCallback(() => {
    // get more text and update the cursor
    const curIdx = currentIndex + CHARS_PER_STROKE;
    setCurrentIndex(curIdx);

    setContent(sourceCode.substring(0, curIdx));
  }, [sourceCode, currentIndex, setCurrentIndex]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
    if (!sourceCode.length) {
      fetch('../code.txt')
        .then((r) => r.text())
        .then((text) => {
          setSourceCode(text);
        });
    }
    const listener = (e: any) => {
      if (e.keyCode === 32 || (e.keyCode <= 90 && e.keyCode >= 48)) {
        e.preventDefault();
        runScript();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [runScript, sourceCode]);

  return (
    <>
      <div
        ref={containerRef}
        className="code-container"
        onClick={() => runScript()}
      >
        <div className="code-screen-source success">{content}</div>
      </div>
    </>
  );
};

export default CodeScreen;
