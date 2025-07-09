// components/AddClientForm.jsx

"use client";
import React, { useEffect, useState } from "react";
import {
  adultSchools,
  wisconsinCounties,
  youthSchools,
} from "/public/data/schools";
import { useClient } from "../contexts/ClientContext";
import InputVariants from "../components/InputVariants";
import { useEditing } from "../contexts/EditingContext";
import { validation } from "../lib/validation";
import { useNavigator } from "../contexts/NavigatorsContext";

function AddClientForm({ setOpen }) {
  const [feps, setFeps] = useState([]);
  const [errors, setErrors] = useState({});
  const { setEditing } = useEditing();
  const { navigatorList } = useNavigator();
  const { setSelectedClient } = useClient(null);
  const [formData, setFormData] = useState({
    caseNumber: "",
    clientStatus: "in progress",
    contactNumber: "",
    county: "",
    dateReferred: "",
    dob: "",
    email: "",
    fep: "",
    first_name: "",
    group: "",
    lastGrade: "",
    last_name: "",
    navigator: "",
    pin: "",
    region: "",
    schoolIfEnrolled: "",
    ttsDream: "",
  });
  const navigatorNames = navigatorList.map((navigator) => navigator.name);
  const lastGradeCompletedOptions = [
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th - No Diploma",
    "Foreign Diploma",
    "GED",
    "No Formal Education",
  ];
  const formBackup = {
    caseNumber: "",
    clientStatus: "in progress",
    contactNumber: "",
    dateReferred: "",
    dob: "",
    email: "",
    fep: "",
    first_name: "",
    group: "",
    lastGrade: "",
    last_name: "",
    navigator: "",
    officeCity: "",
    pin: "",
    region: "",
    schoolIfEnrolled: "",
    transcripts: false,
    ttsDream: "",
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/feps");
      const data = await res.json();
      await console.log(data);
      const names = data.map((person) => person.name);
      await setFeps(names);
    }

    fetchData().then();
  }, []);

  async function postData() {
    const response = await fetch(`/api/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data) {
      setFormData(formBackup);
      setSelectedClient(data);
      alert(
        `Client ${data.first_name} ${data.last_name} has been added to the database.`,
      );
      setEditing(false);
    }
  }

  const validateContactInfo = () => {
    const newErrors = { ...errors };
    let valid = true;

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Validate phone number
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Phone number is required";
      valid = false;
    } else if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.contactNumber)) {
      newErrors.contactNumber =
        "Please enter a valid phone number (xxx) xxx-xxxx";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const formFields = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      required: true,
      value: formData.first_name,
      options: null,
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      required: true,
      value: formData.last_name,
      options: null,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      value: formData.email,
      options: null,
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      type: "text",
      required: true,
      value: formData.contactNumber,
      options: null,
    },
    {
      name: "caseNumber",
      label: "Case Number",
      type: "text",
      required: true,
      value: formData.caseNumber,
      options: null,
    },
    {
      name: "pin",
      label: "PIN",
      type: "text",
      required: true,
      value: formData.pin,
      options: null,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      required: true,
      value: formData.dob,
      options: null,
    },
    {
      name: "fep",
      label: "FEP",
      type: "select",
      required: true,
      options: feps,
      value: formData.fep,
    },
    {
      name: "navigator",
      label: "Navigator",
      type: "select",
      required: true,
      options: navigatorNames,
      value: formData.navigator,
    },
    {
      name: "dateReferred",
      label: "Date Referred",
      type: "date",
      required: true,
      value: formData.dateReferred,
      options: null,
    },
    {
      name: "lastGrade",
      label: "Last Grade Completed",
      type: "select",
      required: true,
      options: lastGradeCompletedOptions,
      value: formData.lastGrade,
    },
    {
      name: "region",
      label: "Region",
      type: "select",
      required: true,
      options: ["1", "2", "3", "4", "5", "6"],
      value: formData.region,
    },
    {
      name: "group",
      label: "Age Group",
      type: "select",
      required: true,
      options: ["adult", "youth"],
      value: formData.group,
    },
    {
      name: "schoolIfEnrolled",
      label: "School (if enrolled)",
      type: "select",
      required: true,
      options:
        formData.group === "adult"
          ? formData.group === "youth"
            ? null
            : adultSchools
          : youthSchools,
      value: formData.schoolIfEnrolled,
    },
    {
      name: "county",
      label: "County",
      type: "select",
      required: true,
      options: wisconsinCounties,
      value: formData.officeCity,
    },
    {
      name: "ttsDream",
      label: "TTS Dream",
      type: "textarea",
      required: false,
      value: formData.ttsDream,
      options: null,
    },
  ];

  const validateForm = () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key] && formData[key] !== false) {
        newErrors[key] = "This field is required";
      }
    });

    if (formData.email && !validation.isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.contactNumber) {
      const { isValid } = validation.formatPhoneNumber(formData.contactNumber);
      if (!isValid) {
        newErrors.contactNumber = "Please enter a valid 10-digit phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special handling for phone numbers
    if (name === "contactNumber") {
      const { formatted } = validation.formatPhoneNumber(value);
      setFormData({ ...formData, [name]: formatted });

      if (validation.formatPhoneNumber(value).isValid) {
        setErrors({ ...errors, [name]: null });
      }
      return;
    }
    validateContactInfo();

    // Special handling for email
    if (name === "email" && value) {
      if (validation.isValidEmail(value)) {
        setErrors({ ...errors, [name]: null });
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    postData(formData).then();
    if (!validateForm()) {
      alert("Please fill in all required fields.");
    }
    setFormData(formBackup);
  };

  const handleReset = () => {
    setFormData(formBackup);
    setOpen("");
    setEditing("");
  };

  const deriveStatusFromClientData = (obj, path = []) => {
    let isInProgress = false;
    let isInactive = false;

    const check = (node, currentPath) => {
      if (typeof node !== "object" || node === null) return;

      for (const [key, value] of Object.entries(node)) {
        const newPath = [...currentPath, key];

        if (key === "inactive" && value && Object.keys(value).length > 0) {
          isInactive = true;
        }

        if (
          newPath.includes("enrolled in") &&
          newPath.includes("educational activity") &&
          Array.isArray(value) &&
          value.length > 0
        ) {
          isInProgress = true;
        }

        if (typeof value === "object") {
          check(value, newPath);
        }
      }
    };

    check(obj, path);

    if (isInactive) return "Inactive";
    if (isInProgress) return "In Progress";
    return "";
  };

  useEffect(() => {
    const newStatus = deriveStatusFromClientData(formData);
    if (newStatus && newStatus !== formData.clientStatus) {
      setFormData((prev) => ({ ...prev, status: newStatus }));
    }
  }, [formData]);

  // The rest of your component remains the same, but pass errors to InputVariants
  return (
    <div
      className={`bg-base-200 no-scrollbar flex h-full w-full flex-col justify-start overflow-y-scroll rounded p-6 shadow-lg`}
    >
      <div className={`mb-8 flex h-[80px] items-center justify-between`}>
        <div className={`text-lg md:text-2xl`}>Personal Details</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative mt-[70px] grid grid-cols-3 gap-6">
          {formFields.map((field) => {
            return (
              <InputVariants
                key={field.name}
                label={field.label}
                name={field.name}
                handleChange={handleChange}
                type={field.type}
                required={field.required}
                options={field.options}
                value={field.value}
                error={errors[field.name]} // Pass error message
              />
            );
          })}
        </div>
        <div className="m-10 flex flex-row justify-between">
          <button
            type="submit"
            disabled={false}
            className="btn btn-success btn-soft mt-6 rounded-md p-2 px-6 text-white"
          >
            Submit
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="btn btn-error btn-soft mt-6 rounded-md p-2 px-6"
          >
            Cancel
          </button>
        </div>
      </form>
      <div
        onClick={() => {
          setEditing("");
          setSelectedClient(null);
        }}
        className={`text-base-content mt-5 mr-5 cursor-pointer text-2xl`}
      ></div>
    </div>
  );
}

export default AddClientForm;