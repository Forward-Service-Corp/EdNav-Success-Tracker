"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import ActivityDynamicSelect from "./ActivityDynamicSelect";

export default function ActivityModal({ open, setOpen }) {
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    let cleanedQuestions = {};
    const response = await fetch("/api/questions");
    const questions = await response.json();
    const { adult, youth } = await questions;
    cleanedQuestions.adult = adult;
    cleanedQuestions.youth = youth;
    setQuestions(cleanedQuestions);
    return cleanedQuestions;
  };

  useEffect(() => {
    getQuestions().then();
  }, []);

  return (
    <Dialog
      open={open === "activity"}
      onClose={() => setOpen("")}
      className="relative z-60"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-pink-500/35 backdrop-blur-xs transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in"
      />
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel
          transition
          className="bg-base-100 relative transform overflow-hidden rounded-lg p-12 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
        >
          <div className="px-12 py-8">
            <div>
              <DialogTitle
                as="h3"
                className="text-base-content mx-auto max-w-60 text-xl font-light"
              >
                Add an activity
              </DialogTitle>
              <div className="">
                <ActivityDynamicSelect
                  setOpen={setOpen}
                  questions={questions}
                />
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
