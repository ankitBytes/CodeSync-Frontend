import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
const Session = () => {
  const [code, setCode] = useState("// Start coding...");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    
    newSocket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      newSocket.off("code-update");
      newSocket.disconnect();
    };
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    if (socket && socket.connected) {
      socket.emit("code-change", value);
    }
  };

  if (!socket) {
    return (
      <div style={{ height: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Connecting to session...</div>
      </div>
    );
  }

  return (
    <div style={{ height: "90vh" }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on"
        }}
      />
    </div>
  );
};

export default Session;
