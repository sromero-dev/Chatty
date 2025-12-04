function ChatContainer() {
  return (
    <div className="h-full p-4">
      <div className="space-y-4">
        {/* Ejemplo de contenido largo */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="p-4 bg-base-200 rounded-lg">
            <div className="font-medium">Mensaje #{i + 1}</div>
            <div className="text-sm text-base-content/70">
              Este es un mensaje de ejemplo para demostrar el scroll interno.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatContainer;
