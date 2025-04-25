import Note from "../models/Note.js";
import path from "path";

export const uploadNote = async (req, res) => {
  try {
    const { title, subject, semester, uploaderName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileUrl = `/uploads/notes/${req.file.filename}`;

    const newNote = new Note({
      title,
      subject,
      semester,
      uploaderName,
      fileUrl,
    });

    await newNote.save();

    res.status(201).json({ message: "Note uploaded successfully", note: newNote });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch notes" });
  }
};
