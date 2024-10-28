import { useState } from 'react';
import { Sidebar, ChevronLeft, ChevronRight } from 'lucide-react';

const PDFViewer = ({ pdfUrl }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  
  // You can implement a function to get the actual page count
  const numPages = 10;

  const handlePageClick = (event) => {
    if (!addingNote) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    
    setClickPosition({ x, y });
    setNewNoteText('');
    
    const noteInput = document.getElementById('noteInput');
    if (noteInput) noteInput.focus();
  };

  const addNote = () => {
    if (!newNoteText.trim()) return;

    const newNote = {
      id: Date.now(),
      text: newNoteText,
      page: currentPage,
      position: clickPosition,
    };

    setNotes([...notes, newNote]);
    setNewNoteText('');
    setAddingNote(false);
  };

  const navigateToNote = (note) => {
    setCurrentPage(note.page);
    setShowSidebar(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-gray-100 transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Notes</h2>
          <div className="space-y-2">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="p-2 bg-yellow-100 rounded cursor-pointer hover:bg-yellow-200"
                onClick={() => navigateToNote(note)}
              >
                <div className="text-sm font-medium">Page {note.page}</div>
                <div className="text-sm">{note.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Controls */}
          <div className="flex items-center space-x-4 mb-4">
            <button
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Sidebar className="w-6 h-6" />
            </button>
            <button
              className={`px-4 py-2 rounded ${
                addingNote ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setAddingNote(!addingNote)}
            >
              {addingNote ? 'Cancel Note' : 'Add Note'}
            </button>
            <div className="flex items-center space-x-2">
              <button
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span>Page {currentPage} of {numPages}</span>
              <button
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage >= numPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Container */}
          <div className="relative w-full" onClick={handlePageClick}>
            <div className="w-full aspect-[1/1.414] relative">
              {/* PDF Embed */}
              <object
                data={pdfUrl}
                type="application/pdf"
                className="absolute inset-0 w-full h-full"
              >
                <embed
                  src={pdfUrl}
                  type="application/pdf"
                  className="absolute inset-0 w-full h-full"
                />
              </object>

              {/* Notes Layer */}
              <div className="absolute inset-0 pointer-events-none">
                {notes
                  .filter((note) => note.page === currentPage)
                  .map((note) => (
                    <div
                      key={note.id}
                      className="absolute w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:bg-yellow-400 pointer-events-auto"
                      style={{
                        left: `${note.position.x}%`,
                        top: `${note.position.y}%`,
                      }}
                      title={note.text}
                    >
                      📝
                    </div>
                  ))}
              </div>

              {/* Note Input Form */}
              {addingNote && (
                <div
                  className="absolute bg-white p-4 rounded shadow-lg pointer-events-auto"
                  style={{
                    left: `${clickPosition.x}%`,
                    top: `${clickPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <textarea
                    id="noteInput"
                    className="w-48 h-24 p-2 border rounded"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter note text..."
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      className="px-2 py-1 bg-gray-100 rounded"
                      onClick={() => setAddingNote(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={addNote}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;