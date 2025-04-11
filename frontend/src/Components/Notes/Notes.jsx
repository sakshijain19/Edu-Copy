/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { ArrowUpTrayIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Notes() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteFile, setNoteFile] = useState(null);
  const [error, setError] = useState(''); // State for error messages

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = ['pdf', 'docx', 'doc'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        alert('Only PDF, DOCX, and DOC files are allowed.');
        e.target.value = '';
        return;
      }
      setNoteFile(file);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    // Validation
    if (!noteTitle || !subject || !noteFile) {
      setError('All fields are required.');
      return;
    }

    // Clear error if validation passes
    setError('');

    console.log('Uploading:', { noteTitle, subject, noteFile });
    alert('Note uploaded successfully!');
  };

  const handleDownload = (note) => {
    const fileName = `${note.title}.${note.type.toLowerCase()}`;
    const blob = new Blob(['Sample file content'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sampleNotes = [
    { title: 'Discrete Mathematics', subject: 'Computer Science', author: '', type: 'PDF' },
    { title: 'Computer Graphics', subject: 'Computer Science', author: '', type: 'PDF' },
    { title: 'Database Management Systems', subject: 'Computer Science', author: '', type: 'PDF' },
    { title: 'Digital Electronics and Logic Design', subject: 'Computer Science', author: '', type: 'PDF' },
    { title: 'Object Oriented Programming (OOP)', subject: 'Computer Science', author: '', type: 'PDF' },
    { title: 'System Programming & Operating Systems', subject: 'Computer Science', author: '', type: 'PDF' },
    { title: 'Design and Analysis of Algorithms', subject: 'Computer Science', author: 'Dr. Smith', type: 'PDF' },
    { title: 'Engineering Mathematics - III', subject: 'Computer Science', author: 'Prof. Johnson', type: 'DOC' },
    { title: 'Machine Learning Fundamentals', subject: 'Artificial Intelligence', author: 'Dr. Lee', type: 'PDF' },
    { title: 'CSS Basics', subject: 'Web Development', author: 'Prof. Miller', type: 'DOCX' },
    { title: 'Python for Beginners', subject: 'Programming', author: 'Dr. Brown', type: 'PDF' },
    { title: 'Cyber Security & Digital Forensics', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Internet of Things (IoT)', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Blockchain Technology', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Human Computer Interaction', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Web Technology', subject: 'Web Development', author: 'Prof. Miller', type: 'DOCX' },
    { title: 'Deep Learning', subject: 'Computer Science', author: 'Dr. Brown', type: 'PDF' },
    { title: 'Natural Language Processing', subject: 'Computer Science', author: 'Dr. Brown', type: 'PDF' },
    { title: 'Software Engineering', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Microprocessor', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Computer Networks', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Theory of Computation', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Cloud Computing', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Data Science and Big Data Analytics', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Artificial Intelligence', subject: 'Computer Science', author: 'abc', type: 'PDF' },
    { title: 'Mobile Computing', subject: 'Computer Science', author: 'abc', type: 'PDF' },
  ];

  const filteredNotes = sampleNotes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subject === 'All Subjects' || note.subject === subject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="mt-12 mb-12 p-6 w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notes</h2>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('search')}
                className={`${
                  activeTab === 'search'
                    ? 'border-gray-500 text-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Search Notes
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`${
                  activeTab === 'upload'
                    ? 'border-gray-500 text-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Upload Notes
              </button>
            </nav>
          </div>

          {activeTab === 'search' ? (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-4">Find study materials uploaded by students.</p>
              <div className="flex gap-4 mb-6">
                <div className="flex-grow">
                  <label htmlFor="search" className="sr-only">
                    Search notes
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="search"
                      name="search"
                      id="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <select
                  id="subject"
                  name="subject"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option>All Subjects</option>
                  <option>Discrete Mathematics</option>
                  <option>Fundamentals of Data Structures</option>
                  <option>Object Oriented Programming (OOP)</option>
                  <option>Computer Graphics 17</option>
                  <option>Digital Electronics and Logic Design</option>
                  <option>Engineering Mathematics - III</option>
                  <option>Design and Analysis of Algorithms</option>
                  <option>System Programming & Operating Systems</option>
                  <option>Database Management Systems</option>
                  <option>Software Engineering</option>
                  <option>Microprocessor</option>
                  <option>Computer Networks</option>
                  <option>Theory of Computation</option>
                  <option>Machine Learning</option>
                  <option>Cloud Computing</option>
                  <option>Artificial Intelligence</option>
                  <option>Mobile Computing</option>
                  <option>Cyber Security & Digital Forensics</option>
                  <option>Internet of Things (IoT)</option>
                  <option>Blockchain Technology</option>
                  <option>Human Computer Interaction</option>
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note, index) => (
                  <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {note.subject} - {note.author}
                      </p>
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleDownload(note)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <ArrowDownTrayIcon className="mr-2 -ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                          Download {note.type}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-4">Share your study materials with students.</p>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <form onSubmit={handleUpload}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="note-file" className="block text-sm font-medium text-gray-700">
                      Note File (Required)
                    </label>
                    <input
                      id="note-file"
                      name="note-file"
                      type="file"
                      className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="note-title" className="block text-sm font-medium text-gray-700">
                      Note Title (Required)
                    </label>
                    <input
                      type="text"
                      name="note-title"
                      id="note-title"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter note title"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="upload-subject" className="block text-sm font-medium text-gray-700">
                      Subject (Required)
                    </label>
                    <select
                      id="upload-subject"
                      name="upload-subject"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    >
                      <option value="">Select subject</option>
                      <option>Discrete Mathematics</option>
                      <option>Web Development</option>
                      <option>Computer Science</option>
                      <option>Artificial Intelligence</option>
                      <option>Programming</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Upload Notes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}