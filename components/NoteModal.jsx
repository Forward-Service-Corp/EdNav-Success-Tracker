"use client";
import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useClient } from '../contexts/ClientContext';
import { useNavigator } from '../contexts/NavigatorsContext';

export default function NoteModal({ open, setOpen }) {
  const { selectedClient } = useClient();
  const { selectedNavigator } = useNavigator();
  // const [notes, setNotes] = useState([]);
  // const [openNote, setOpenNote] = useState('');
  const [note, setNote] = useState({
    noteContent: "",
    noteAuthor: selectedNavigator?.name,
    createdAt: new Date(),
    clientId: selectedClient?._id,
  });

  const handleSave = async () => {
    // console.log(note);
    note.clientId = selectedClient?._id;
    const response = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ note: note }),
    });
    await response.json();
// console.log(data);
    setOpen("");
    setNote((prev) => ({ ...prev, noteContent: "" }));
  };

  const handleCancel = () => {
    setOpen("");
    setNote((prev) => ({ ...prev, noteContent: "" }));
  };

  const handleChange = (e) => {
    setNote((prev) => ({ ...prev, noteContent: e.target.value }));
  };

  return (
    <Dialog
      open={open === "note"}
      onClose={() => setOpen("")}
      className="relative z-60"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/35 backdrop-blur-xs transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="bg-base-100 relative transform overflow-hidden rounded-lg p-12 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="px-12 py-8">
              <div>
                <DialogTitle
                  as="h3"
                  className="text-base-content mx-auto text-xl font-light"
                >
                  Add a note
                </DialogTitle>
                <div className="mt-4 flex flex-col gap-4">
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Note"
                    value={note.noteContent}
                    onChange={handleChange}
                  ></textarea>
                  <div className="flex gap-2">
                    <button
                      disabled={note.noteContent.length === 0}
                      onClick={handleSave}
                      className="btn btn-sm btn-primary w-fit"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-sm btn-secondary w-fit"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
